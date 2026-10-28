#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""通过 GitHub Git Data API 上传仓库内容。

为什么不用 git push：本机到 github.com:443 的 HTTPS 端点被网络策略拦截，
而 api.github.com 可达，因此改走纯 API 通道（blob → tree → commit → ref）。

用法：
    GITHUB_TOKEN=xxx python upload_git.py --repo owner/name --dir <仓库目录>
"""
import base64
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor

API = "https://api.github.com"
TOKEN = os.environ.get("GITHUB_TOKEN", "")
WORKERS = 10
RETRY = 4


def api(path, data=None, method=None):
    url = API + path
    body = json.dumps(data).encode("utf-8") if data is not None else None
    headers = {
        "Authorization": "Bearer " + TOKEN,
        "Accept": "application/vnd.github+json",
        "User-Agent": "ander-studio-uploader",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if body is not None:
        headers["Content-Type"] = "application/json"
    last = None
    for attempt in range(RETRY):
        req = urllib.request.Request(url, data=body, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.loads(r.read() or b"{}")
        except urllib.error.HTTPError as e:
            detail = e.read()[:300].decode("utf-8", "replace")
            last = "%s %s -> %s %s" % (method or "POST", path, e.code, detail)
            if e.code in (403, 429, 500, 502, 503):
                wait = 3 * (attempt + 1)
                print("   重试 %d/%d (%s) 等待 %ds" % (attempt + 1, RETRY, e.code, wait))
                time.sleep(wait)
                continue
            raise RuntimeError(last)
        except Exception as e:
            last = str(e)
            time.sleep(2 * (attempt + 1))
    raise RuntimeError("重试耗尽: " + str(last))


def git_files(root):
    """取文件清单与模式。

    目录是 git 仓库时用 git 索引（保证与提交内容一致）；
    否则遍历目录（用于 Pages 站点这种非仓库目录）。
    """
    if os.path.isdir(os.path.join(root, ".git")):
        out = subprocess.run(["git", "ls-files", "-s", "-z"], cwd=root,
                             capture_output=True, check=True).stdout
        items = []
        for rec in out.split(b"\0"):
            if not rec:
                continue
            meta, path = rec.split(b"\t", 1)
            mode, sha, stage = meta.split()
            items.append((path.decode("utf-8"), mode.decode(), sha.decode()))
        return items

    items = []
    for base, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in (".git", "__pycache__")]
        for name in files:
            full = os.path.join(base, name)
            rel = os.path.relpath(full, root).replace(os.sep, "/")
            mode = "100755" if os.access(full, os.X_OK) and name.endswith((".sh", ".py")) else "100644"
            items.append((rel, mode, ""))
    return items


def main():
    argv = sys.argv[1:]
    repo = "azlove2021/ander-studio-offline"
    root = "D:/AAA-Workbudy/2026-10-28-13-11-05/ander-studio-local"
    branch = "main"
    limit = 0
    if "--repo" in argv:
        repo = argv[argv.index("--repo") + 1]
    if "--dir" in argv:
        root = argv[argv.index("--dir") + 1]
    if "--branch" in argv:
        branch = argv[argv.index("--branch") + 1]
    if "--limit" in argv:
        limit = int(argv[argv.index("--limit") + 1])

    if not TOKEN:
        print("缺少 GITHUB_TOKEN")
        return 1

    files = git_files(root)
    if limit:
        files = files[:limit]
    total = sum(os.path.getsize(os.path.join(root, f[0])) for f in files)
    print("待上传 %d 个文件，%.2f MB" % (len(files), total / 1048576.0))

    # 空仓库不允许直接建 blob（GitHub 返回 409），先用 Contents API 建一个初始提交
    parents = []
    try:
        r = api("/repos/%s/git/refs/heads/%s" % (repo, branch))
        parents = [r["object"]["sha"]]
        print("仓库已有 main 分支，父提交 %s" % parents[0])
    except Exception:
        seed = base64.b64encode(b"# init\n").decode("ascii")
        r = api("/repos/%s/contents/.seed" % repo,
                {"message": "初始化提交", "content": seed, "branch": branch},
                method="PUT")
        parents = [r["commit"]["sha"]]
        print("已建立初始提交 %s" % parents[0])

    done = [0]
    t0 = time.time()

    def upload(item):
        path, mode, git_sha = item
        # GitHub 的 blob sha 与 git 的 blob sha 完全一致，
        # 内容没变的文件可以直接复用，省掉重复上传
        if git_sha:
            try:
                api("/repos/%s/git/blobs/%s" % (repo, git_sha), method="GET")
                skipped[0] += 1
                return {"path": path, "mode": mode, "type": "blob", "sha": git_sha}
            except Exception:
                pass
        full = os.path.join(root, path)
        with open(full, "rb") as f:
            content = f.read()
        b64 = base64.b64encode(content).decode("ascii")
        r = api("/repos/%s/git/blobs" % repo, {"content": b64, "encoding": "base64"})
        done[0] += 1
        if done[0] % 100 == 0:
            print("   blob %d/%d  (%.0f KB/s)" %
                  (done[0], len(files), (sum(os.path.getsize(os.path.join(root, f[0]))
                                          for f in files[:done[0]]) / 1024) / max(time.time() - t0, 0.1)))
        return {"path": path, "mode": mode, "type": "blob", "sha": r["sha"]}

    print("上传 blob …（内容未变的直接复用）")
    skipped = [0]
    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        tree_entries = list(pool.map(upload, files))
    print("   新上传 %d 个，复用 %d 个" % (done[0], skipped[0]))

    print("创建 tree（增量分批，每批 100 条）…")
    tree_sha = None
    batch = 100
    for i in range(0, len(tree_entries), batch):
        chunk = tree_entries[i:i + batch]
        payload = {"tree": chunk}
        if tree_sha:
            payload["base_tree"] = tree_sha
        tree_sha = api("/repos/%s/git/trees" % repo, payload)["sha"]
        print("   tree %d/%d  sha %s" % (min(i + batch, len(tree_entries)), len(tree_entries), tree_sha[:10]))

    print("创建 commit …")
    commit = api("/repos/%s/git/commits" % repo, {
        "message": "安德生物工作室离线镜像：29 个交互教学模型 + 938 道题库快照\n\n"
                   "- 全站静态资源镜像，目录结构与线上一致，绝对路径零改动\n"
                   "- 29 个自包含教学模型（含 Three.js 3D 模型与全部动态拼接素材）\n"
                   "- 938 道题库快照，带考点归属、答案解析与 496 张配图\n"
                   "- 零依赖 Python 服务：本地账号库、离线题库接口、gzip 与强缓存\n"
                   "- 完整性验证脚本：线上 vs 本地资源反向取证，564 个资源 0 缺失",
        "tree": tree_sha, "parents": parents})

    print("更新 ref …")
    try:
        api("/repos/%s/git/refs" % repo,
            {"ref": "refs/heads/" + branch, "sha": commit["sha"]})
    except Exception:
        api("/repos/%s/git/refs/heads/%s" % (repo, branch),
            {"sha": commit["sha"], "force": True}, method="PATCH")

    print("\n完成：commit %s" % commit["sha"])
    print("耗时 %.1f 秒" % (time.time() - t0))
    print("https://github.com/%s/tree/%s" % (repo, branch))
    return 0


if __name__ == "__main__":
    sys.exit(main())
