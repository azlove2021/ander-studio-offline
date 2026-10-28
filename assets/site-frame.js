/* One public footer, shared by the portal and account surfaces. No account requests. */
(function () {
  "use strict";
  if (document.body.hasAttribute("data-about-alias")) location.replace("/#about");
  function render(root = document) {
  const footer = root.querySelector(".site-record-footer, .account-footer, .center-footer, .foundation-footer, [data-site-footer]");
  if (footer) {
    const notes = footer.matches(".account-footer") ? [...footer.querySelectorAll("span")].map(item => item.textContent.trim()).filter(text => text && text !== "·") : [];
    footer.classList.add("site-footer");
    footer.setAttribute("aria-label", "网站信息与帮助");
    footer.innerHTML = '<span class="site-footer-brand">© 2026 安德生物工作室</span><nav aria-label="网站帮助"><a href="/#about">工作室简介</a><a href="/guide.html">使用说明</a><a href="/contact.html">联系与反馈</a><a href="/terms.html">用户协议</a><a href="/privacy.html">隐私政策</a><a href="/manage">统一管理中心</a></nav><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">粤ICP备2026104048号</a>';
    if (notes.length) { const note = document.createElement("p"); note.className = "site-footer-note"; note.textContent = notes.join(" "); footer.prepend(note); }
  }
  }
  window.AnderSiteFrame = {render};
  render();
})();
