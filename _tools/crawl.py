# -*- coding: utf-8 -*-
"""Mirror lilinbio.com static assets into a local tree that keeps the
original absolute URL layout (/assets/...), so no path rewriting is needed.
Pure stdlib, no deps.
"""
import os, re, sys, time, urllib.parse, urllib.request

ORIGIN = "https://www.lilinbio.com"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")

SEEDS = [
    "/", "/account/login", "/account/register", "/account/recover",
    "/about.html", "/contact.html", "/guide.html", "/terms.html", "/privacy.html",
    "/question-bank.html", "/manage", "/community",
]

seen, failed, saved = set(), [], []


def local_path(url_path):
    p = urllib.parse.urlparse(url_path).path
    if p.endswith("/"):
        p += "index.html"
    if not p.startswith("/"):
        p = "/" + p
    # dynamic routes -> .html file so a static server can serve them
    if "." not in os.path.basename(p):
        p += ".html"
    return os.path.join(ROOT, p.lstrip("/").replace("/", os.sep))


def fetch(url_path):
    if url_path in seen:
        return None
    seen.add(url_path)
    url = ORIGIN + urllib.parse.quote(url_path, safe="/?=&%:@!$'()*+,;~")
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
            ctype = r.headers.get("Content-Type", "")
            final = r.geturl()
    except Exception as e:
        failed.append((url_path, repr(e)))
        return None
    # server may redirect (e.g. question-bank -> login); keep the bytes as-is
    dst = local_path(url_path)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    with open(dst, "wb") as f:
        f.write(data)
    saved.append((url_path, len(data), ctype, final))
    print(f"  {len(data):>8}  {url_path}")
    return data, ctype


def refs_from_html(text):
    out = []
    for m in re.finditer(r'(?:href|src|poster)\s*=\s*["\']([^"\']+)["\']', text, re.I):
        out.append(m.group(1))
    for m in re.finditer(r'url\(\s*["\']?([^"\')]+)["\']?\s*\)', text, re.I):
        out.append(m.group(1))
    return out


def refs_from_css(text, css_path):
    out = []
    for m in re.finditer(r'url\(\s*["\']?([^"\')]+)["\']?\s*\)', text, re.I):
        u = m.group(1)
        if u.startswith(("data:", "http:", "https:", "//")):
            continue
        if u.startswith("/"):
            out.append(u)
        else:
            base = os.path.dirname(css_path)
            out.append(os.path.normpath(os.path.join(base, u)).replace(os.sep, "/"))
    return out


def normalize(u, from_path):
    if not u or u.startswith(("data:", "mailto:", "tel:", "javascript:", "#", "//")):
        return None
    if u.startswith("http://") or u.startswith("https://"):
        if ORIGIN not in u:
            return None
        u = u[len(ORIGIN):] or "/"
    if not u.startswith("/"):
        base = os.path.dirname(from_path)
        u = os.path.normpath(os.path.join(base, u)).replace(os.sep, "/")
    return u.split("#")[0]


def main():
    queue = list(SEEDS)
    while queue:
        cur = queue.pop(0)
        res = fetch(cur)
        if not res:
            continue
        data, ctype = res
        low = ctype.lower()
        if "html" in low or cur in ("/",) or cur.endswith(".html"):
            try:
                text = data.decode("utf-8", "replace")
            except Exception:
                continue
            kids = refs_from_html(text)
        elif "css" in low:
            text = data.decode("utf-8", "replace")
            kids = refs_from_css(text, cur)
        else:
            continue
        for k in kids:
            n = normalize(k, cur)
            if n and n not in seen:
                queue.append(n)

    print("\n=== saved %d, failed %d ===" % (len(saved), len(failed)))
    for p, e in failed:
        print("  FAIL", p, e)


if __name__ == "__main__":
    main()
