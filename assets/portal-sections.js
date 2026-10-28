/* Load the existing question scripts on entry, in their original order.
   Production rewrites the inert template with its existing HTML adapter. */
(() => {
  "use strict";
  const template = document.querySelector("template[data-question-scripts]");
  const root = document.querySelector("[data-question-setup]");
  if (!template || !root) return;
  let task = null, next = 0, complete = false;
  const scripts = [...template.content.querySelectorAll("script[src]")];
  function load(source) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = source.getAttribute("src");
      script.async = false;
      script.onload = () => { script.onload = script.onerror = null; resolve(); };
      script.onerror = () => {
        script.onload = script.onerror = null;
        script.remove();
        reject(new Error("题库页面资源未下载完成"));
      };
      document.head.append(script);
    });
  }
  async function ensureQuestions() {
    if (complete) return;
    if (task) return task;
    root.innerHTML = '<section class="qp-panel" role="status"><h2>正在准备题目训练…</h2><p>首次进入需要加载题库页面，你也可以先浏览其他栏目。</p></section>';
    root.setAttribute("aria-busy", "true");
    task = (async () => {
      try {
        for (; next < scripts.length; next += 1) await load(scripts[next]);
        complete = true;
      } catch (_) {
        root.innerHTML = '<section class="qp-panel" role="status"><h2>题目训练页面暂未加载完成</h2><p>请检查网络后重试。其他栏目仍可浏览，不会清除已有练习。</p><button class="qp-button qp-primary" type="button" data-question-scripts-retry>重新加载题库页面</button></section>';
      } finally {
        root.removeAttribute("aria-busy");
        task = null;
      }
    })();
    return task;
  }
  root.addEventListener("click", event => {
    if (event.target.closest("[data-question-scripts-retry]")) void ensureQuestions();
  });
  window.addEventListener("ander:portal-section", event => {
    if (event.detail === "exams") void ensureQuestions();
  });
})();
