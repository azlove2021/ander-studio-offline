/* Shared by account pages and the community. Only known local destinations. */
"use strict";
(function (root) {
  function communityReturn(value) {
    if (typeof value !== "string" || value.length > 600 || /[\\\s\u0000-\u001f]/.test(value) || !value.startsWith("/") || value.startsWith("//")) return null;
    const url = new URL(value, "https://local.invalid");
    if (url.origin !== "https://local.invalid" || url.pathname.includes("%") || url.pathname !== value.split(/[?#]/)[0]) return null;
    const account = url.pathname === "/account" && url.hash === "#community";
    const community = /^\/community(?:\/(?:resources|discussions)(?:\/[a-z0-9][a-z0-9-]{2,63})?|\/u\/[a-z0-9][a-z0-9-]{2,63})?$/.test(url.pathname) && (!url.hash || /^#reply-[a-f0-9-]{36}$/.test(url.hash)&&/^\/community\/(resources|discussions)\/.+/.test(url.pathname));
    const publish=url.pathname==="/community/publish"&&!url.hash;
    if (!account && !community && !publish) return null;
    const allowed = account ? ["communityTab"] : publish?["type","draft"]:["q", "subject", "sort", "offset", "category"];
    for (const key of url.searchParams.keys()) if (!allowed.includes(key) || url.searchParams.getAll(key).length !== 1) return null;
    if (account && url.searchParams.has("communityTab") && !["posts", "bookmarks", "notifications", "settings", "replies", "cases"].includes(url.searchParams.get("communityTab"))) return null;
    if(publish && (url.searchParams.has("type") && !["resource","discussion"].includes(url.searchParams.get("type")) || url.searchParams.has("draft") && !/^[a-z0-9][a-z0-9-]{2,63}$/.test(url.searchParams.get("draft"))))return null;
    return url.pathname + url.search + url.hash;
  }
  if (typeof module === "object" && module.exports) module.exports = {communityReturn};
  else root.AnderCommunityReturn = communityReturn;
})(typeof window === "object" ? window : globalThis);
