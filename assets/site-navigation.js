/* The studio sidebar belongs to the document. Views own only their content and
   request lifecycle; changing a view never replaces the sidebar or its images. */
(() => {
  "use strict";
  if (window.AnderSiteNavigation) return;
  const shell = document.querySelector(".studio-shell"), sidebar = shell?.querySelector(".studio-sidebar");
  if (!shell || !sidebar) return;
  const controllers = new Map(), views = new Map(), reloadRequired = new Set(), loaded = new Set([...document.scripts].map(s => s.src).filter(Boolean));
  const portalSections = new Set(["models", "exams", "ark", "products", "about"]);
  const sharedScripts = /\/(?:studio-theme|site-frame|site-navigation|accounts\/(?:widget|activity)|learning-community\/frame)\.js$/;
  const sharedStyles = /\/(?:styles|homepage-navigation|homepage-sidebar|portal-design|site-frame|site-navigation|studio-themes|learning-community\/frame|accounts\/widget)\.css$/;
  let active, activeUrl = new URL(location.href), generation = 0, index = Number(history.state?.studioIndex) || 0, restoring = false, busy = false;
  // Community owns session revalidation and content cleanup. Its public shell
  // stays in this document so changing sections does not reload the sidebar.
  const communityRoute = /^\/community(?:\/publish|\/(?:resources|discussions)(?:\/[a-z0-9][a-z0-9-]{2,63})?|\/u\/[a-z0-9][a-z0-9-]{2,63})?$/;
  const known = url => url.origin === location.origin && (url.pathname === "/" || url.pathname === "/index.html" ? "portal" :
    url.pathname === "/account" ? "account" : communityRoute.test(url.pathname) ? "community" : null);
  const group = known(activeUrl);
  if (!group) return;
  const initial = shell.querySelector(":scope > .studio-main");
  if (!initial) return;
  const status = document.createElement("div"); status.className = "site-navigation-status"; status.setAttribute("role", "status"); status.hidden = true; document.body.append(status);
  function attributes(node) {return Object.fromEntries([...node.attributes].filter(a => a.name !== "class").map(a => [a.name, a.value]));}
  function view(node, source) {
    return {node, classes: source.body.className, body: attributes(source.body), shellClasses: source.querySelector(".studio-shell").className,
      styles: [...source.querySelectorAll('link[rel="stylesheet"]')].map(l => l.href), extras: []};
  }
  views.set(group, view(initial, document)); active = group; initial.dataset.siteView = group;
  for (const node of [...shell.children]) if (node !== initial && node !== sidebar) views.get(group).extras.push(node);
  const initialStyles = new Map([...document.querySelectorAll('link[rel="stylesheet"]')].map(l => [l.href, l]));
  const styles = initialStyles;
  // Legacy portal markup uses CSS variables on decorative elements. Preserve those
  // values through the CSSOM, without enabling inline scripts/styles in the CSP.
  function applyStudioStyles(root = document) {
    root.querySelectorAll("[data-studio-style]").forEach(element => {
      for (const pair of element.dataset.studioStyle.split(";")) {
        const colon = pair.indexOf(":"), key = pair.slice(0, colon).trim(), value = pair.slice(colon + 1).trim();
        if (/^--[a-z][a-z0-9-]*$/.test(key) && /^[\d.\-\s%/a-z]+$/i.test(value)) element.style.setProperty(key, value);
      }
    });
  }
  function takeStyles(root) {
    return [...root.querySelectorAll("[style]")].map(element => {
      const values = [...element.style].map(key => [key, element.style.getPropertyValue(key), element.style.getPropertyPriority(key)]);
      element.removeAttribute("style"); return [element, values];
    });
  }
  function restoreStyles(items) {for (const [element, values] of items) for (const [key, value, priority] of values) element.style.setProperty(key, value, priority);}
  function resolveAssets(root, base) {
    for (const element of root.querySelectorAll("[src],[href],[action],[data-src]")) for (const attr of ["src", "href", "action", "data-src"]) {
      const value = element.getAttribute(attr); if (value && !value.startsWith("#")) element.setAttribute(attr, new URL(value, base).href);
    }
    for (const element of root.querySelectorAll("[srcset]")) {
      const value = element.getAttribute("srcset");
      if (!value.trim().startsWith("data:")) element.setAttribute("srcset", value.split(",").map(candidate => {
        const [src, ...descriptor] = candidate.trim().split(/\s+/);
        return [new URL(src, base).href, ...descriptor].join(" ");
      }).join(", "));
    }
  }
  function setContent(target, markup) {const template = document.createElement("template"); template.innerHTML = markup; resolveAssets(template.content, location.origin + "/"); const inline = takeStyles(template.content); target.replaceChildren(template.content); restoreStyles(inline);}
  function mark() {
    const section = active === "portal" ? (portalSections.has(location.hash.slice(1)) ? location.hash.slice(1) : "models") : active === "community" ? "community" : "account";
    shell.dataset.portalCurrent = section;
    const content = views.get(active)?.node;
    if (content) {content.id ||= "studio-" + active + "-content"; const skip = document.querySelector(".lc-skip"); if (skip) skip.href = "#" + content.id;}
    sidebar.querySelectorAll("[data-portal-section], [data-learning-community-entry]").forEach(a => {
      const selected = (a.hasAttribute("data-learning-community-entry") ? "community" : a.dataset.portalSection) === section;
      a.classList.toggle("is-active", selected); selected ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current");
      if (a.tagName === "BUTTON") a.setAttribute("aria-pressed", String(selected));
    });
    sidebar.querySelectorAll('.account-entry a').forEach(a => {if (active === "account") a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");});
    window.AnderStudioTheme?.mount();
  }
  function applyView(name) {
    const current = views.get(name);
    document.body.className = current.classes;
    for (const attr of [...document.body.attributes]) if (attr.name.startsWith("data-account")) document.body.removeAttribute(attr.name);
    for (const [key, value] of Object.entries(current.body)) document.body.setAttribute(key, value);
    shell.className = current.shellClasses;
    for (const [key, item] of views) {item.node.hidden = key !== name; item.extras.forEach(node => node.hidden = key !== name);}
    for (const [href, link] of styles) {
      link.disabled = !sharedStyles.test(new URL(href).pathname) && !current.styles.includes(href);
      link.media = "all";
    }
    mark(); window.AnderSiteFrame?.render(current.node);
  }
  function remember() {history.replaceState({...history.state, studioIndex: index, studioScroll: scrollY}, ""); activeUrl = new URL(location.href);}
  function failure(error) {status.textContent = error instanceof TypeError ? "网络暂时无法连接，请稍后再试。当前页面已保留。" : error.message || "页面暂时无法加载，请稍后再试。当前页面已保留。"; status.hidden = false;}
  async function addStyle(href) {
    if (styles.has(href)) return;
    // Shared shell styles keep their original cascade position across view versions.
    const pathname = new URL(href).pathname;
    const existing = sharedStyles.test(pathname) && [...document.querySelectorAll('link[rel="stylesheet"]')].find(link => new URL(link.href).pathname === pathname);
    if (existing) {styles.set(existing.href, existing); return;}
    const link = document.createElement("link"); link.rel = "stylesheet"; link.href = href; link.media = "not all"; styles.set(href, link);
    await new Promise((resolve, reject) => {link.onload = resolve; link.onerror = () => {styles.delete(href); link.remove(); reject(new Error("页面样式未能加载，请重试。"));}; document.head.append(link);});
  }
  async function addScript(src) {
    if (loaded.has(src)) return;
    const script = document.createElement("script"); script.src = src; script.async = false;
    await new Promise((resolve, reject) => {script.onload = () => {loaded.add(src); resolve();}; script.onerror = () => {script.remove(); reject(new Error("页面功能未能加载，请重试。"));}; document.head.append(script);});
  }
  async function prepare(name, url, run) {
    if (reloadRequired.has(name)) {location.assign(url.href); return null;}
    if (views.has(name)) return views.get(name);
    const response = await fetch(url.pathname + url.search, {credentials: "same-origin", cache: "no-store", redirect: "follow"});
    if (run !== generation) return null;
    if (response.redirected) {location.assign(response.url); return null;}
    if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) throw new Error("页面暂时无法打开，请稍后重试。当前页面已保留。");
    const source = new DOMParser().parseFromString(await response.text(), "text/html"), sourceShell = source.querySelector(".studio-shell"), node = sourceShell?.querySelector(":scope > .studio-main");
    if (run !== generation) return null;
    // With community closed, /account deliberately renders a standalone page.
    // It still owns authentication and its lifecycle: use normal navigation,
    // rather than mistaking the missing optional shell for a stale release.
    if (!node && name === "account" && source.body.matches('[data-account-page="profile"]') && source.querySelector("main.profile-layout")) {
      location.assign(url.href); return null;
    }
    // The server's closed-community page intentionally has no shared shell.
    if (!node && name === "community" && source.querySelector('link[href^="/assets/community-closed.css"]') && source.querySelector('nav[aria-label="继续学习"]')) {
      location.assign(url.href); return null;
    }
    if (!node) throw new Error("页面版本已变化，请刷新后重试。");
    // Resolve the original document's assets before its content joins another URL.
    resolveAssets(source, response.url);
    // The portal's lazy question loader sits outside its shell in the original
    // HTML. Carry its inert template with the view before loading that loader.
    if (name === "portal") {
      const questions = source.querySelector("template[data-question-scripts]");
      if (questions) {resolveAssets(questions.content, response.url); node.append(questions);}
    }
    const item = view(node, source); item.node.dataset.siteView = name; item.node.hidden = true;
    const inline = takeStyles(sourceShell);
    const scripts = [...source.querySelectorAll("script[src]")].filter(s => !s.closest("template")).map(s => s.src);
    for (const src of [...scripts, ...item.styles]) if (new URL(src).origin !== location.origin) throw new Error("页面依赖需要完整刷新后加载。");
    await Promise.all(item.styles.map(addStyle));
    if (run !== generation) return null;
    for (const [key, value] of Object.entries(attributes(sourceShell))) if (!shell.hasAttribute(key)) shell.setAttribute(key, value);
    for (const extra of [...sourceShell.children]) if (extra !== node && !extra.matches(".studio-sidebar")) {extra.hidden = true; item.extras.push(extra); shell.append(extra);}
    node.querySelectorAll("script").forEach(s => s.remove()); shell.append(node); restoreStyles(inline); views.set(name, item);
    try {for (const src of scripts) if (!sharedScripts.test(new URL(src).pathname)) await addScript(src);}
    catch (error) {reloadRequired.add(name); views.delete(name); node.remove(); item.extras.forEach(extra => extra.remove()); throw error;}
    return item;
  }
  async function go(value, {pop = false, state = null, replace = false} = {}) {
    const url = new URL(value, location.href), name = known(url);
    if (!name) {location.assign(url.href); return;}
    if (busy) {generation++; pending = [url, {pop, state, replace}]; return;}
    if (!pop && url.href === location.href) return;
    if (!pop) activeUrl = new URL(location.href);
    const previousUrl = activeUrl.href, previousIndex = index;
    if (controllers.get(active)?.confirmLeave?.() === false) {
      if (pop) {restoring = true; history.go(previousIndex - (state?.studioIndex ?? previousIndex - 1));} return;
    }
    const run = ++generation; busy = true; status.hidden = true; shell.setAttribute("aria-busy", "true");
    try {
      const item = await prepare(name, url, run); if (!item || run !== generation) return;
      if (!controllers.has(name)) {reloadRequired.add(name); throw new Error("页面尚未准备完成，请重新打开此页面。");}
      if (!pop) {remember(); index = replace ? index : index + 1; history[replace ? "replaceState" : "pushState"]({studioIndex: index, studioScroll: 0}, "", url);}
      else index = state?.studioIndex ?? index;
      if (active !== name) {
        controllers.get(active)?.deactivate?.();
        // Account HTML is public structure, but its mounted view contains private data.
        // Drop it entirely so returning always mounts a fresh, revalidated account view.
        if (active === "account") {const old = views.get(active); old.node.remove(); old.extras.forEach(n => n.remove()); views.delete(active);}
      }
      active = name; activeUrl = new URL(location.href); applyView(name);
      await controllers.get(name).activate?.(item.node);
      if (run !== generation) return;
      mark();
      const reply = !pop && /^#reply-[a-f0-9-]{36}$/.test(url.hash) && document.getElementById(url.hash.slice(1));
      if (reply) reply.scrollIntoView({block:"center"}); else window.scrollTo({top: pop ? state?.studioScroll || 0 : 0, behavior: "instant"});
      if (!pop) {const main = item.node.querySelector("#community-main") || item.node; main.setAttribute("tabindex", "-1"); main.focus({preventScroll: true});}
      window.dispatchEvent(new CustomEvent("ander:site-view", {detail: name}));
    } catch (error) {
      if (pop && activeUrl.href !== location.href) {restoring = true; history.go(previousIndex - (state?.studioIndex ?? previousIndex - 1));}
      else if (activeUrl.href !== location.href) history.replaceState({...history.state, studioIndex: previousIndex}, "", previousUrl);
      applyView(active); failure(error);
    } finally {busy = false; shell.removeAttribute("aria-busy"); if (pending) {const next = pending; pending = null; void go(...next);}}
  }
  let pending = null;
  window.AnderSiteNavigation = {go, mark, setContent, applyStudioStyles, active: name => active === name,
    portal(setSection, close) {this.register("portal", {activate() {setSection(location.hash.slice(1) || "models");}, deactivate() {close(); window.dispatchEvent(new CustomEvent("ander:portal-section", {detail:"community"}));}});},
    register(name, controller) {controllers.set(name, controller); if (active === name && !busy) {applyView(name); Promise.resolve(controller.activate?.(views.get(name).node)).catch(failure);}},
    refresh() {return controllers.get(active)?.activate?.(views.get(active).node);}, root: name => views.get(name)?.node};
  history.replaceState({...history.state, studioIndex: index, studioScroll: scrollY}, ""); history.scrollRestoration = "manual";
  document.addEventListener("click", event => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const button = event.target.closest("[data-portal-section]");
    if (button && sidebar.contains(button)) {event.preventDefault(); event.stopImmediatePropagation(); const url = new URL("/", location.origin); if (active === "portal") url.search = location.search; url.hash = button.dataset.portalSection; void go(url); return;}
    const anchor = event.target.closest("a[href]"); if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
    const url = new URL(anchor.href); if (!known(url) || anchor.getAttribute("href")?.startsWith("#")) return;
    // Publishing access has its own same-page dialog, handled by the community UI.
    if (url.pathname === "/community/publish" && !url.searchParams.has("draft") && window.AnderCommunityUI) return;
    event.preventDefault(); void go(url);
  }, true);
  window.addEventListener("popstate", event => {if (restoring) {restoring = false; return;} if (known(new URL(location.href))) void go(location.href, {pop: true, state: event.state}); else location.reload();});
  let scrollTimer;
  window.addEventListener("scroll", () => {clearTimeout(scrollTimer); scrollTimer = setTimeout(() => {if (!busy) remember();}, 100);}, {passive: true});
  window.addEventListener("hashchange", () => {if (!busy) {activeUrl = new URL(location.href); mark();}});
  mark();
})();
