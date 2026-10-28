(async () => {
  if (window.top === window.self && !window.AnderAccountActivity && !document.querySelector('script[src*="/accounts/activity.js"]')) {
    const activity = document.createElement("script"); activity.src="/assets/accounts/activity.js?v=experience-r1";activity.defer=true;document.head.append(activity);
  }
  try {
    const response = await fetch("/api/me", { credentials: "same-origin" });
    if (!response.ok) return;
    const session = await response.json();
    const isTeacher = session.capabilities?.contentEditor === true;
    const canManageQingniao = session.capabilities?.qingniaoAdmin === true;
    const canManageStudents = session.capabilities?.studentAdmin === true;
    const canManageContent = session.capabilities?.contentAdmin === true;

    if (!document.querySelector("[data-session-style]")) {
      const style = document.createElement("style");
      style.dataset.sessionStyle = "true";
      style.textContent = `
        .internal-session-bar {
          position: fixed;
          top: 14px;
          right: 14px;
          z-index: 10000;
          display: inline-flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          max-width: min(560px, calc(100vw - 28px));
          padding: 8px 10px 8px 12px;
          border: 1px solid rgba(94, 126, 169, 0.18);
          border-radius: 20px;
          color: #17324d;
          background: rgba(255, 255, 255, 0.86);
          box-shadow: 0 14px 32px rgba(38, 61, 88, 0.08);
          backdrop-filter: blur(14px);
          font: 800 14px/1.2 "Microsoft YaHei", Arial, sans-serif;
        }
        .internal-session-bar span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .internal-session-bar button {
          border: 1px solid rgba(94, 126, 169, 0.18);
          border-radius: 14px;
          padding: 7px 10px;
          color: #1f91aa;
          background: rgba(137, 228, 245, 0.16);
          font: inherit;
          cursor: pointer;
        }
        .internal-session-bar button:hover {
          background: rgba(137, 228, 245, 0.26);
        }
        @media (max-width: 760px) {
          .internal-session-bar {
            top: auto;
            right: 10px;
            bottom: 10px;
            max-width: calc(100vw - 20px);
          }
        }
      `;
      document.head.appendChild(style);
    }

    const bar = document.createElement("div");
    bar.className = "internal-session-bar";
    bar.innerHTML = `
      <span data-session-name></span>
      ${isTeacher ? '<button type="button" data-session-link="/project-map.html">教师端</button>' : ""}
      ${isTeacher ? '<button type="button" data-session-link="/site-editor.html">编辑后台</button>' : ""}
      ${session.capabilities?.legacyUserAdmin === true ? '<button type="button" data-session-link="/user-admin.html">用户管理</button>' : ""}
      ${isTeacher || canManageStudents || canManageContent || canManageQingniao ? '<button type="button" data-session-link="/manage">统一管理中心</button>' : ""}
      <button type="button" data-session-action="logout">退出</button>
    `;
    bar.querySelector("[data-session-name]").textContent = session.displayName || session.username || "内测账号";

    bar.addEventListener("click", async (event) => {
      const linkButton = event.target.closest("[data-session-link]");
      if (linkButton) {
        window.location.href = linkButton.dataset.sessionLink;
        return;
      }
      if (event.target.closest("[data-session-action='logout']")) {
        await fetch("/api/logout", { method: "POST", credentials: "same-origin" });
        window.location.href = "/login";
      }
    });

    document.body.appendChild(bar);
  } catch (error) {
    // The static preview server does not expose login APIs; in that mode this helper stays silent.
  }
})();
