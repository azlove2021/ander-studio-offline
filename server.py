#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
安德生物工作室 · 本地离线镜像服务
==================================
零依赖（仅标准库），一条命令起站：

    python server.py            # 默认 http://127.0.0.1:8080
    python server.py 9000       # 指定端口

能力：
1. 静态资源：目录结构与线上一致，页面里的 `/assets/...` 绝对路径无需改动。
2. 本地账号库：账号与密码哈希存在 _data/accounts.json（PBKDF2-HMAC-SHA256）。
   首次用某个邮箱登录会自动创建该本地账号，之后校验密码。
3. 离线题库：420 道样例题 + 答案 + 题目图片，接口与线上同形，
   所以页面的 library-view.js 无需改动即可渲染。
4. 受保护页拦截：未登录访问题库/管理中心/社区时 302 回登录页并带 next 参数。
5. 教学模型：29 个模型是自包含应用，直接由静态服务提供。

离线版不做的功能：收藏、试题篮、试卷导出、练习记录。
"""
import gzip
import hashlib
import json
import mimetypes
import os
import re
import secrets
import sys
import threading
import time
import urllib.parse
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, "_data")
ACCOUNTS_FILE = os.path.join(DATA, "accounts.json")
QUESTIONS_FILE = os.path.join(DATA, "questions.json")
ANSWERS_FILE = os.path.join(DATA, "answers.json")

PBKDF2_ROUNDS = 120_000
PAGE_SIZE = 20          # 与线上一致，前端也按 20 条请求
# 前端用 /^[a-f0-9]{64}$/ 校验 contextRevision，这里给一个稳定的合法值
CONTEXT_REVISION = hashlib.sha256(b"ander-offline-revision-v1").hexdigest()

# ---- 需要登录才能看的页面（与线上拦截范围对齐） ----
PROTECTED = {
    "/question-bank.html",
    "/question-basket.html",
    "/question-detail.html",
    "/practice.html",
    "/manage",
    "/manage.html",
    "/community",
    "/community.html",
    "/community/resources",
    "/community/discussions",
    "/account",
    "/account.html",
    "/account/profile",
}

# 干净 URL → 实际文件
CLEAN = {
    "/": "index.html",
    "/account": "account.html",
    "/account/login": "account/login.html",
    "/account/register": "account/register.html",
    "/account/recover": "account/recover.html",
    "/manage": "manage.html",
    "/community": "community.html",
    "/community/resources": "community/resources.html",
    "/community/discussions": "community/discussions.html",
    "/games/life-ark": "games/life-ark.html",
    "/models": "models.html",
}

SESSIONS = {}          # token -> {"email","name","csrf"}
SMS_INBOX = []
CODES = {}
CHALLENGES = {}
_lock = threading.Lock()


def now():
    return time.strftime("%H:%M:%S")


# ---------------- 数据加载 ----------------
def load_json(path, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


_LIB = {"loaded": False, "meta": {}, "items": [], "answers": {}, "descendants": {}, "counts": {}}


def library():
    """懒加载题库，进程内只读一次。"""
    if _LIB["loaded"]:
        return _LIB
    q = load_json(QUESTIONS_FILE, {})
    _LIB["meta"] = q.get("meta") or {}
    _LIB["items"] = q.get("items") or []
    _LIB["answers"] = load_json(ANSWERS_FILE, {})

    # 预计算节点后代表与快照内的节点题量，供 selected 筛选使用
    nodes = ((_LIB["meta"].get("catalog") or {}).get("nodes")) or []
    children = {}
    for n in nodes:
        children.setdefault(n.get("parentId") or "", []).append(n.get("id"))

    def collect(node_id, depth=0):
        if depth > 12:
            return []
        out = [node_id]
        for c in children.get(node_id, []):
            out.extend(collect(c, depth + 1))
        return out

    for n in nodes:
        _LIB["descendants"][n["id"]] = collect(n["id"])

    counts = {}
    for n in nodes:
        ids = set(_LIB["descendants"][n["id"]])
        counts[n["id"]] = sum(1 for q in _LIB["items"] if ids & set(q.get("nodes") or []))
    _LIB["counts"] = counts
    _LIB["loaded"] = True
    return _LIB


def load_accounts():
    return load_json(ACCOUNTS_FILE, {"users": {}})


def save_accounts(data):
    os.makedirs(DATA, exist_ok=True)
    tmp = ACCOUNTS_FILE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    os.replace(tmp, ACCOUNTS_FILE)


def hash_password(password, salt=None):
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"),
                                bytes.fromhex(salt), PBKDF2_ROUNDS).hex()
    return salt, digest


def verify_password(password, salt, expected):
    return secrets.compare_digest(hash_password(password, salt)[1], expected)


# ---------------- 题库筛选 ----------------
def strip_tags(html):
    return re.sub(r"<[^>]+>", "", html or "")


def browse(payload):
    lib = library()
    items = lib["items"]
    kinds = set(payload.get("kinds") or [])
    sources = set(payload.get("sources") or [])
    years = set(payload.get("years") or [])
    bands = set(payload.get("bands") or [])
    keyword = (payload.get("keyword") or "").strip().lower()

    # 勾选的目录节点展开成「自身 + 全部后代」，题目带 nodes 字段（快照里 95% 有）
    selected = set(payload.get("selected") or [])
    scope_ids = set()
    for sid in selected:
        scope_ids.update(lib["descendants"].get(sid, [sid]))

    def keep(q):
        if scope_ids and not (scope_ids & set(q.get("nodes") or [])):
            return False
        if kinds and q.get("kind") not in kinds:
            return False
        if sources and q.get("source") not in sources:
            return False
        if years and q.get("year") not in years:
            return False
        if bands and q.get("band") not in bands:
            return False
        if keyword:
            hay = (strip_tags(q.get("promptHtml")) + " " +
                   " ".join(strip_tags(o.get("html")) for o in (q.get("options") or []))).lower()
            if keyword not in hay:
                return False
        return True

    matched = [q for q in items if keep(q)]
    total = len(matched)
    page = max(1, int(payload.get("page") or 1))
    size = min(PAGE_SIZE, max(1, int(payload.get("pageSize") or PAGE_SIZE)))
    start = (page - 1) * size
    slice_ = matched[start:start + size]

    return {
        "ok": True,
        "total": total,
        "page": page,
        "pageSize": size,
        "nodeCounts": lib["counts"],
        "releaseId": lib["meta"].get("releaseId"),
        "catalogVersion": lib["meta"].get("catalogVersion"),
        "items": slice_,
        "basket": {"counts": {}, "items": [], "limit": 60, "total": 0, "revision": 0},
        "contextRevision": CONTEXT_REVISION,
    }


def answers_for(payload):
    lib = library()
    items = payload.get("items") or []
    if len(items) > 20:
        return None            # 与线上一致：单次最多 20 条
    out = []
    for it in items:
        qid = str(it.get("questionId"))
        a = lib["answers"].get(qid)
        if a:
            out.append(a)
    return {"ok": True, "items": out, "releaseId": lib["meta"].get("releaseId"),
            "contextRevision": CONTEXT_REVISION}


class Handler(SimpleHTTPRequestHandler):
    server_version = "AnderLocalOffline/2.0"
    protocol_version = "HTTP/1.1"

    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def log_message(self, fmt, *args):
        sys.stderr.write("  %s  %s\n" % (now(), fmt % args))

    # ---------- 基础 ----------
    def _json(self, obj, status=200, headers=None):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        for k, v in (headers or {}).items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self):
        n = int(self.headers.get("Content-Length") or 0)
        if not n:
            return {}
        try:
            return json.loads(self.rfile.read(n).decode("utf-8"))
        except Exception:
            return {}

    def _session(self):
        raw = self.headers.get("Cookie") or ""
        for part in raw.split(";"):
            part = part.strip()
            if part.startswith("ander_local_session="):
                return SESSIONS.get(part.split("=", 1)[1])
        return None

    def _redirect(self, location, status=302, cookie=None):
        self.send_response(status)
        self.send_header("Location", location)
        if cookie:
            self.send_header("Set-Cookie", cookie)
        self.send_header("Content-Length", "0")
        self.end_headers()

    # ---------- 路由 ----------
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        sess = self._session()

        if path == "/api/account/session":
            return self._json(self._session_payload(sess))

        if path == "/api/questions/library/bootstrap":
            lib = library()
            meta = lib["meta"]
            return self._json({
                "ok": True,
                "releaseId": meta.get("releaseId"),
                "catalogVersion": meta.get("catalogVersion"),
                "catalog": meta.get("catalog") or {"nodes": [], "counts": {}},
                "nodeCounts": lib["counts"],
                "years": meta.get("years") or [],
                "stats": {"questions": len(lib["items"]),
                          "gaokao": sum(1 for q in lib["items"] if q.get("source") == "gaokao"),
                          "books": 5, "concepts": 183},
                "basket": {"counts": {}, "items": [], "limit": 60, "total": 0, "revision": 0},
                "preferences": {"choiceMode": "single", "source": "all", "yearWindow": 0},
                "contextRevision": CONTEXT_REVISION,
                "local": True,
            })

        if path == "/api/account/favorites":
            mid = urllib.parse.parse_qs(parsed.query).get("modelId", [""])[0]
            # 前端两道校验：外层 request() 要求 ok === true，
            # accept() 要求 status === "ready"，缺任一都会报「收藏服务暂不可用」
            return self._json({"ok": True, "modelId": mid, "status": "ready", "favorite": False,
                               "available": True, "contextRevision": CONTEXT_REVISION})

        if path == "/api/me":
            # 模型页的 session.js 会探测此接口，返回 200 会多渲染一个「内测账号」标签，
            # 所以离线版保持原状（不实现），让脚本自行静默退出。
            return self._json({"message": "not implemented in offline mirror"}, 404)

        if path.startswith("/api/questions/style/star-a-"):
            m = re.search(r"star-a-(\d+)\.png$", path)
            return self._svg_star(max(1, min(10, int(m.group(1)) if m else 3)))

        if path == "/__local_sms_preview__":
            return self._sms_preview()

        if path == "/__local_login":
            nxt = urllib.parse.parse_qs(parsed.query).get("next", ["/"])[0]
            nxt = "/" + nxt.lstrip("/") if nxt.startswith("/") else "/"
            _, cookie = self._start_session("demo@local", "本地演示")
            return self._redirect(nxt, cookie=cookie)

        if path in PROTECTED and not sess:
            return self._redirect("/account/login?next=" + urllib.parse.quote(path))

        return self._serve_static(path)

    def do_POST(self):
        path = urllib.parse.urlparse(self.path).path
        body = self._read_json()

        if path == "/api/account/login":
            return self._login(body)
        if path == "/api/account/register":
            return self._login(body, force_create=True)
        if path == "/api/account/logout":
            raw = self.headers.get("Cookie") or ""
            for part in raw.split(";"):
                part = part.strip()
                if part.startswith("ander_local_session="):
                    SESSIONS.pop(part.split("=", 1)[1], None)
            return self._json({"ok": True}, headers={"Set-Cookie": "ander_local_session=; Path=/; Max-Age=0"})

        # 手机验证码：本地不做，明确回绝，避免页面误导
        if path.startswith("/api/account/phone/"):
            return self._json({"message": "离线版不支持短信登录，请用邮箱密码登录。",
                               "code": "LOCAL_DISABLED"}, 400)

        # ---- 离线题库 ----
        if path == "/api/questions/browse":
            return self._json(browse(body))
        if path == "/api/questions/answers":
            res = answers_for(body)
            if res is None:
                return self._json({"message": "单次最多请求 20 道题的答案。",
                                   "code": "BATCH_TOO_LARGE"}, 400)
            return self._json(res)
        if path == "/api/account/favorites":
            mid = body.get("modelId") or ""
            return self._json({"ok": True, "modelId": mid, "status": "ready",
                               "favorite": bool(body.get("desired")),
                               "available": True, "contextRevision": CONTEXT_REVISION})

        # 其余写接口（收藏、试题篮、导出等）离线版不做，回一个明确结果
        return self._json({"ok": True, "local": True, "message": "离线版未启用该功能。"})

    # ---------- 登录 ----------
    def _login(self, body, force_create=False):
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""
        if not email or "@" not in email:
            return self._json({"message": "请输入有效的邮箱地址。"}, 400)
        if len(password) < 6:
            return self._json({"message": "密码至少 6 位。"}, 400)

        with _lock:
            db = load_accounts()
            users = db.setdefault("users", {})
            rec = users.get(email)
            if rec is None:
                salt, digest = hash_password(password)
                name = body.get("displayName") or email.split("@")[0] or "同学"
                users[email] = {"name": name, "salt": salt, "hash": digest,
                                "created": time.strftime("%Y-%m-%d %H:%M:%S")}
                save_accounts(db)
                created = True
            else:
                if not verify_password(password, rec["salt"], rec["hash"]):
                    return self._json({"message": "账号或密码不正确。"}, 401)
                created = False

        token, cookie = self._start_session(email, users[email]["name"])
        payload = self._session_payload(SESSIONS[token])
        payload["localAccountCreated"] = created
        return self._json(payload, headers={"Set-Cookie": cookie})

    def _session_payload(self, sess):
        authed = bool(sess)
        # 前端约定：csrfToken 必须是 64 位 hex；未登录时 contextRevision 必须为 null，
        # 否则 model-favorites.js 的 refreshSession 会判定「收藏服务尚未就绪」。
        return {
            "ok": True,
            "authenticated": authed,
            "csrfToken": (sess or {}).get("csrf") or secrets.token_hex(32),
            "deliveryMode": "offline",
            "enabled": True,
            "recoveryOpen": False,
            "registrationOpen": True,
            "entitlementsOpen": True,
            "gameTrialOpen": False,
            "contextRevision": CONTEXT_REVISION if authed else None,
            "emailAuth": {"captchaRequired": False},
            # 离线版关闭短信登录：phoneAuth.loginOpen=false 会让页面隐藏双 Tab
            "phoneAuth": {
                "captchaRequired": False,
                "loginOpen": False,
                "smsLoginOpen": False,
                "registrationOpen": False,
                "recoveryOpen": False,
                "bindingOpen": False,
            },
            "user": ({"displayName": sess["name"], "email": sess["email"], "role": "member"}
                     if authed else None),
        }

    def _start_session(self, email, name):
        token = secrets.token_urlsafe(24)
        SESSIONS[token] = {"email": email, "name": name, "csrf": secrets.token_hex(32)}
        cookie = "ander_local_session=%s; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800" % token
        return token, cookie

    # ---------- 静态文件 / 干净 URL ----------
    # 模型里的 three.module.min.js 有 1.2MB、teaching-traces.json 有 1.3MB，
    # 不压缩时本地打开也会明显卡顿。这里对文本资源做 gzip，并给强缓存，
    # 第二次打开模型就能走磁盘缓存直接秒开。
    COMPRESSIBLE = (".js", ".css", ".json", ".svg", ".html", ".htm", ".txt", ".map")
    CACHE_LONG = "public, max-age=86400"
    CACHE_HTML = "no-cache"

    def _serve_static(self, path):
        target = CLEAN.get(path)
        if target is None:
            rel = path.lstrip("/")
            if not rel:
                rel = "index.html"
            fs = os.path.join(ROOT, rel.replace("/", os.sep))
            if os.path.isdir(fs):
                fs = os.path.join(fs, "index.html")
            if not os.path.exists(fs) and os.path.exists(fs + ".html"):
                fs += ".html"
            target = os.path.relpath(fs, ROOT).replace(os.sep, "/") if os.path.exists(fs) else None

        if target is None:
            body = ("<!doctype html><meta charset=utf-8><title>404</title>"
                    "<body style='font:16px/1.8 system-ui;padding:60px;max-width:640px;margin:auto'>"
                    "<h1>404 · 本地镜像里没有这个页面</h1>"
                    "<p><code>%s</code> 尚未抓取。可回到 <a href='/'>首页</a> 或 "
                    "<a href='/models.html'>教学模型库</a>。</p>") % path
            data = body.encode("utf-8")
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return

        fs = os.path.join(ROOT, target.replace("/", os.sep))
        try:
            with open(fs, "rb") as f:
                data = f.read()
        except OSError:
            self.send_error(404, "Not Found")
            return

        ext = os.path.splitext(fs)[1].lower()
        ctype = mimetypes.guess_type(fs)[0] or "application/octet-stream"
        if ext in (".js", ".mjs"):
            ctype = "text/javascript; charset=utf-8"
        elif ext == ".css":
            ctype = "text/css; charset=utf-8"
        elif ext in (".html", ".htm"):
            ctype = "text/html; charset=utf-8"
        elif ext == ".json":
            ctype = "application/json; charset=utf-8"
        elif ext == ".svg":
            ctype = "image/svg+xml"
        elif ext in (".woff", ".woff2", ".ttf", ".otf"):
            ctype = "font/" + ext[1:]

        cache = self.CACHE_HTML if ext in (".html", ".htm") else self.CACHE_LONG
        accepts_gzip = "gzip" in (self.headers.get("Accept-Encoding") or "").lower()
        use_gzip = accepts_gzip and ext in self.COMPRESSIBLE and len(data) > 1024

        body = gzip.compress(data, 6) if use_gzip else data
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", cache)
        if ext in self.COMPRESSIBLE:
            self.send_header("Vary", "Accept-Encoding")
        if use_gzip:
            self.send_header("Content-Encoding", "gzip")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    # ---------- 星级图 ----------
    def _svg_star(self, n):
        w = n * 15
        stars = "".join(
            '<path d="M%d 2 l2.6 5.6 6 .8 -4.4 4.2 1.1 6.1 -5.3-2.9 -5.3 2.9 1.1-6.1 -4.4-4.2 6-.8z" '
            'fill="#e8a33d"/>' % (3 + i * 15) for i in range(n))
        svg = ('<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="17" viewBox="0 0 %d 17">%s</svg>'
               % (w, w, stars)).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "image/svg+xml")
        self.send_header("Content-Length", str(len(svg)))
        self.end_headers()
        self.wfile.write(svg)

    # ---------- 模拟收件箱（离线版仅作说明页） ----------
    def _sms_preview(self):
        html = """<!doctype html><meta charset=utf-8><title>离线版 · 短信已停用</title>
<style>body{font:15px/1.8 "Microsoft YaHei",system-ui;background:#f3f8f6;color:#17384a;margin:0;padding:60px 22px}
.card{max-width:620px;margin:auto;background:#fff;border:1px solid #d9e8e3;border-radius:20px;padding:34px}
h1{font-size:21px;margin:0 0 12px}</style>
<div class=card><h1>离线版不发送短信</h1>
<p>本地镜像已改为邮箱 + 密码登录，短信验证码通道关闭。</p>
<p>直接用任意邮箱和一个 ≥6 位的密码登录即可；首次使用的邮箱会自动创建本地账号。</p>
<p><a href="/account/login">去登录</a></p></div>"""
        data = html.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    lib = library()
    srv = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print("")
    print("  安德生物工作室 · 本地离线镜像")
    print("  ────────────────────────────────────────────")
    print("  首页        http://127.0.0.1:%d/" % port)
    print("  教学模型库  http://127.0.0.1:%d/models.html" % port)
    print("  题库        http://127.0.0.1:%d/question-bank.html" % port)
    print("  ────────────────────────────────────────────")
    print("  题库快照 %d 道（其中高考真题 %d 道）"
          % (len(lib["items"]), sum(1 for q in lib["items"] if q.get("source") == "gaokao")))
    print("  登录方式：邮箱 + 密码，首次使用的邮箱自动创建本地账号")
    print("  停止服务：Ctrl+C")
    print("")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\n  已停止。")
        srv.server_close()


if __name__ == "__main__":
    main()
