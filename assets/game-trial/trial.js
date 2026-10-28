"use strict";
(() => {
  const $ = id => document.getElementById(id), keys = ["life-ark-v2:save:1", "life-ark-v2:opening:1"];
  let session, context, cloud, latest, revision = 0, pending = null, dirty = false, durable = true, blocked = false;
  let outboxKey = "", prefix = "", copies = [], adopted = [], checkedCode = "";
  let frame, port, launch, saveTimer, renewTimer, bootTimer, stopResolve, stopping = null, inFlight = null, sequence = 0;
  let playBudget = null, pulseTimer, permitTimer, budgetBusy = null, budgetAgain = false, pulseSequence = 0;
  let mounted = false, playWanted = false, budgetStateKnown = false, warnedDay = null;
  let enterRequested = new URLSearchParams(location.search).get("enter") === "1";
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  function mayReplaceCampaign(next, saved) {
    try {
      const old = JSON.parse(saved?.entries?.[keys[0]] || "null"), chosen = JSON.parse(next?.entries?.[keys[0]] || "null");
      return typeof old?.rewardCampaign !== "string" || (chosen?.rewardCampaign === old.rewardCampaign && chosen.exploration && typeof chosen.exploration === "object" && !Array.isArray(chosen.exploration));
    } catch { return false; }
  }
  const oldCampaignMessage = "云端已进入新航程，旧航程副本不能覆盖。请选云端进度；本机原件仍保留，也可以下载备份。";
  const show = (message, error = false) => { $("notice").textContent = message; $("notice").classList.toggle("error", error); };
  const status = (message, error = false) => { show(message, error); port?.postMessage({type: "status", message}); };
  const newKey = () => { outboxKey = prefix + crypto.randomUUID(); };
  const timeText = seconds => `${Math.floor(seconds / 60)}分${String(seconds % 60).padStart(2, "0")}秒`;
  const exhaustedMessage = "今天的10分钟已用完，明日北京时间00:00恢复。你的航程与存档已保留。";
  function drawBudget(value = playBudget) {
    if (!value?.enabled) return;
    value = {...playBudget, ...value}; playBudget = value;
    $("budget-description").hidden = false;
    const label = value.unlimited ? "游戏 VIP · 游戏时间不限" : value.exhausted ? exhaustedMessage : `今日还可游玩 ${timeText(value.remainingSeconds)} · 北京时间00:00恢复`;
    $("budget-description").textContent = label;
    $("budget-clock").textContent = value.unlimited ? "游戏时间不限" : `今日剩余 ${timeText(value.remainingSeconds)}`;
    $("budget-clock").hidden = !frame;
    if (!frame) $("play").disabled = copies.length > 0 || value.exhausted;
    if (!value.unlimited && value.remainingMs > 0 && value.remainingMs <= 60000 && warnedDay !== value.dayStart && frame) {
      warnedDay = value.dayStart; status("今日游戏时间剩余不到1分钟，到时会保存进度并返回网站。");
    }
  }
  function permitEnded() {
    if (!launch?.budget || stopping || !playWanted || document.hidden) return;
    if (playBudget?.leaseUntil === playBudget?.nextResetAt) { void pulseBudget(); return; }
    void stop(true, playBudget && !playBudget.unlimited && playBudget.remainingMs <= 5000 ? exhaustedMessage : "游戏时间连接已暂停。进度会保存，重新进入后继续。");
  }
  async function pulseBudget() {
    if (!launch?.budget || !mounted || !budgetStateKnown || stopping) return;
    if (budgetBusy) { budgetAgain = true; return budgetBusy; }
    const active = launch, playing = playWanted && !document.hidden, started = performance.now();
    clearTimeout(pulseTimer);
    budgetBusy = (async () => {
      try {
        const result = await api("/api/game/pulse", {launchId: active.launchId, sequence: ++pulseSequence, playing});
        if (launch !== active || stopping) return;
        drawBudget(result.budget);
        const durationMs = Math.max(0, result.budget.leaseMs - (performance.now() - started));
        clearTimeout(permitTimer);
        // Subtract the full round trip so a delayed response cannot extend a grant.
        const stillPlaying = playing && playWanted && !document.hidden;
        port?.postMessage({type: "budget-permit", protocol: 1, durationMs: stillPlaying ? durationMs : 0});
        if (result.budget.exhausted) { queueMicrotask(() => { void stop(true, exhaustedMessage); }); return; }
        if (stillPlaying && durationMs > 0) permitTimer = setTimeout(permitEnded, durationMs);
        else if (stillPlaying && durationMs === 0) { queueMicrotask(permitEnded); return; }
        pulseTimer = setTimeout(() => { void pulseBudget(); }, playing ? 2000 : 10000);
      } catch (error) {
        if (launch === active && !stopping) queueMicrotask(() => { void stop(true, error.code ? error.message : "网络中断，游戏已暂停。进度先保留在本机，重新连接后可继续。"); });
      } finally {
        budgetBusy = null;
        if (budgetAgain) { budgetAgain = false; if (launch === active && !stopping) void pulseBudget(); }
      }
    })();
    return budgetBusy;
  }
  function validPayload(value) {
    return value?.protocol === 1 && value.entries && typeof value.entries === "object" && !Array.isArray(value.entries) && typeof value.route === "string" && value.route.length <= 100
      && Object.entries(value.entries).every(([key, raw]) => keys.includes(key) && typeof raw === "string" && raw.length <= 1000000) && JSON.stringify(value).length <= 1500000;
  }
  async function api(url, input, captured = context) {
    const response = await fetch(url, {credentials: "same-origin", cache: "no-store", method: input === undefined ? "GET" : "POST", signal: AbortSignal.timeout(15000),
      headers: {"content-type": "application/json", "x-ander-csrf": session?.csrfToken || "", "x-game-session": captured?.sessionBinding || ""},
      ...(input === undefined ? {} : {body: JSON.stringify(input)})});
    let value;
    try { value = await response.json(); } catch { throw new Error("网站暂时无法连接，请稍后重试。"); }
    if (!response.ok || value.ok === false) { const error = new Error(value.message || "操作未完成，请重试。"); error.code = value.code; throw error; }
    return value;
  }
  function persist() {
    if (!dirty || !outboxKey) return;
    try {
      localStorage.setItem(outboxKey, JSON.stringify({protocol: 1, payload: latest, baseRevision: revision, pending, releaseId: context.releaseId, updatedAt: Date.now()})); durable = true;
    } catch { durable = false; }
  }
  function cleanAcknowledgedCopies() {
    try {
      localStorage.removeItem(outboxKey);
      for (const copy of adopted) if (localStorage.getItem(copy.key) === copy.raw) localStorage.removeItem(copy.key);
      adopted = [];
    } catch { /* Failure to clean an acknowledged copy is safe; it can be compared with cloud next time. */ }
  }
  function scanCopies() {
    const results = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i); if (!key?.startsWith(prefix)) continue;
        const raw = localStorage.getItem(key); if (!raw || raw.length > 3500000) continue;
        let value; try { value = JSON.parse(raw); } catch { continue; }
        if (value.protocol !== 1 || !validPayload(value.payload) || !Number.isSafeInteger(value.baseRevision)) continue;
        if (same(value.payload, cloud.payload)) { if (localStorage.getItem(key) === raw) localStorage.removeItem(key); continue; }
        results.push({key, raw, value});
      }
    } catch { durable = false; }
    // If browser storage itself failed, do not hide the only in-memory copy.
    if (dirty && !results.some(copy => same(copy.value.payload, latest))) results.push({key: "", raw: "", value: {payload: latest, baseRevision: revision, updatedAt: Date.now()}});
    return results.sort((a, b) => b.value.updatedAt - a.value.updatedAt);
  }
  function recovery() {
    copies = scanCopies(); $("recovery").hidden = copies.length === 0; $("play").disabled = copies.length > 0 || playBudget?.exhausted === true;
    $("copies").replaceChildren();
    for (const [i, copy] of copies.entries()) {
      const option = document.createElement("option"); option.value = String(i); option.textContent = `${new Date(copy.value.updatedAt).toLocaleString("zh-CN")} · ${copy.value.payload.route}`; $("copies").append(option);
    }
    if (copies.length) $("recovery-text").textContent = `云端已有 ${cloud.revision ? "第 " + cloud.revision + " 次保存" : "一份新航程"}。以下 ${copies.length} 份进度尚未确认同步；如果另一游戏页面仍在玩，请先退出那个页面，再选择要继续的一份。`;
    return copies.length > 0;
  }
  function ready() {
    $("signin").hidden = true; $("redeem").hidden = true; $("ready").hidden = false;
    $("version").textContent = `试玩版本 · ${context.releaseId}`;
    $("save-description").textContent = cloud.revision ? `云端已有进度 · ${new Date(cloud.updatedAt).toLocaleString("zh-CN")}。进入后可继续远征。` : "新航程准备好了。进度将跟随当前网站账号保存。";
    $("play").disabled = false;
    if (context.membershipEnabled) {
      $("ready-title").textContent = "你的航程已就绪";
      $("play").textContent = "进入生命方舟 →";
      drawBudget(context.budget);
    }
  }
  async function initialize() {
    session = await api("/api/account/session");
    if (session.membershipEnabled) {
      $("game-eyebrow").textContent = "LIFE ARK / BIOLOGY EXPLORATION";
      $("game-introduction").textContent = "在方舟的远征中探索生命物质。登录后，每日体验时间和航程进度会跟随你的账号。";
      $("game-footnote").textContent = "浏览器清理数据会删除尚未同步的本机副本；已同步的云存档不受影响。";
    }
    if (!session.authenticated) {
      $("signin").hidden = false;
      if (session.membershipEnabled) {
        $("signin-description").textContent = "登录后每天可体验10分钟；游戏 VIP 不限时。进度会跟随当前账号保存。";
        $("signin-link").href = "/account/login?next=game-enter";
        show("登录后即可开启航程，普通账号也可进入。");
      } else show("本次试玩需要网站账号和试玩兑换码。");
      return;
    }
    context = await api("/api/game/context"); prefix = `ander:game-outbox:v1:${context.accountKey}:`; newKey();
    if (!context.entitled) { $("redeem").hidden = false; show(`已登录：${session.user.displayName}。请输入试玩兑换码。`); return; }
    cloud = await api("/api/game/save"); latest = cloud.payload; revision = cloud.revision; ready();
    if (!recovery()) {
      show(`已登录：${session.user.displayName}。完整生命物质体验已开放。`);
      if (enterRequested && !playBudget?.exhausted) {
        enterRequested = false;
        history.replaceState(null, "", location.pathname);
        await start();
      }
    } else {
      enterRequested = false;
      show("检测到尚未同步的进度，请先选择要继续的存档。");
    }
  }
  function receivedSnapshot(value) {
    if (!value || !Number.isSafeInteger(value.sequence) || value.sequence <= sequence || !validPayload(value.payload)) return;
    sequence = value.sequence;
    if (same(latest, value.payload)) return;
    latest = value.payload; dirty = true; persist();
    if (!blocked) status(durable ? "已保留本机副本 · 等待云同步" : "浏览器存储不可用 · 请勿关闭此页面", !durable);
    clearTimeout(saveTimer); saveTimer = setTimeout(() => { void flush(); }, 1200);
  }
  async function flush() {
    if (inFlight) return inFlight;
    if (!dirty || blocked || !launch) return !dirty;
    const active = launch;
    inFlight = (async () => {
      try {
        while (dirty && !blocked && launch === active) {
          if (!pending) pending = {expectedRevision: revision, operationId: crypto.randomUUID(), payload: latest};
          const operation = pending; persist();
          status(durable ? "本机已保留 · 正在同步云存档" : "正在同步 · 本机存储不可用", !durable);
          const result = await api("/api/game/save", {...operation, launchId: active.launchId});
          revision = result.revision; cloud = {...cloud, revision, updatedAt: result.updatedAt, payload: operation.payload};
          dirty = !same(latest, operation.payload); pending = null;
          if (dirty) persist(); else { cleanAcknowledgedCopies(); status("已同步到云存档"); }
        }
        return !dirty;
      } catch (error) {
        persist();
        status(error.code === "SAVE_CONFLICT" ? error.message : durable ? "本机副本已保留 · 云端尚未同步" : "尚未安全保存 · 请勿关闭页面", true);
        if (["SAVE_CONFLICT", "SESSION_CHANGED", "AUTH_REQUIRED", "ENTITLEMENT_REQUIRED", "RESOURCE_NOT_FOUND", "TICKET_EXPIRED", "INCOMPATIBLE_SAVE"].includes(error.code)) {
          blocked = true;
          if (!stopping) queueMicrotask(() => { void stop(false, error.message); });
        }
        return false;
      } finally { inFlight = null; }
    })();
    return inFlight;
  }
  async function checkIdentity() {
    if (!context) return true;
    const fresh = await api("/api/game/context");
    if (fresh.sessionBinding !== context.sessionBinding || !fresh.entitled) { const error = new Error("网站账号或试玩资格发生变化。已停止游戏，原账号的本机副本仍单独保留。"); error.code = "SESSION_CHANGED"; throw error; }
    context = fresh;
    if (fresh.budget) drawBudget(fresh.budget);
    return true;
  }
  async function start() {
    $("play").disabled = true;
    try {
      await checkIdentity();
      const fresh = await api("/api/game/save");
      if (dirty && fresh.revision !== revision && !same(latest, fresh.payload)) { cloud = fresh; recovery(); show("另一页面保存了新的进度，请核对后选择。", true); return; }
      cloud = fresh;
      if (dirty && !mayReplaceCampaign(latest, fresh.payload)) { recovery(); show(oldCampaignMessage, true); return; }
      if (!dirty || same(latest, fresh.payload)) { latest = fresh.payload; revision = fresh.revision; pending = null; dirty = false; }
      blocked = false; launch = await api("/api/game/launch", {});
      mounted = false; playWanted = false; budgetStateKnown = false; pulseSequence = 0; budgetAgain = false;
      if (launch.budget) playBudget = launch.budget;
      sequence = 0;
      frame = document.createElement("iframe"); frame.title = "生命方舟 · 完整分子游戏"; frame.setAttribute("sandbox", "allow-scripts allow-same-origin"); frame.setAttribute("allow", "fullscreen"); frame.referrerPolicy = "no-referrer";
      frame.src = launch.url; $("stage").append(frame); $("stage").hidden = false; $("connecting").hidden = false; document.body.classList.add("playing"); $("lobby").inert = true;
      drawBudget();
      bootTimer = setTimeout(() => { void stop(false, "游戏载入超时，请重新进入。原存档未改动。"); }, 25000);
      renewTimer = setInterval(async () => {
        try { await checkIdentity(); await api("/api/game/renew", {launchId: launch.launchId}); if (dirty) await flush(); }
        catch (error) {
          if (error.code) { blocked = true; void stop(false, error.message); }
          else status("连接中断 · 进度先留在本机", true);
        }
      }, launch.renewAfterMs);
    } catch (error) { show(error.message || "游戏连接失败，请稍后重试。", true); if (error.code === "SESSION_CHANGED" || error.code === "AUTH_REQUIRED") $("signin").hidden = false; }
    finally { if (!copies.length) $("play").disabled = playBudget?.exhausted === true; }
  }
  window.addEventListener("message", event => {
    if (!frame || !launch || port || event.source !== frame.contentWindow || event.origin !== launch.gameOrigin || event.data?.type !== "life-ark-ready" || event.data.protocol !== 1) return;
    const channel = new MessageChannel(); port = channel.port1;
    port.onmessage = event => {
      const value = event.data;
      if (value?.type === "snapshot" || value?.type === "stopped") receivedSnapshot(value);
      if (value?.type === "mounted") {
        mounted = true; clearTimeout(bootTimer); $("connecting").hidden = false; frame?.focus(); if (dirty) void flush();
        if (launch?.budget && !budgetStateKnown) bootTimer = setTimeout(() => { void stop(true, "游戏计时连接尚未就绪，请重新进入。原存档保留。"); }, 2500);
        else { $("connecting").hidden = true; if (budgetStateKnown) void pulseBudget(); }
      }
      if (launch?.budget && value?.type === "budget-activity" && value.protocol === 1 && typeof value.active === "boolean") {
        budgetStateKnown = true; playWanted = value.active;
        if (!playWanted) { clearTimeout(permitTimer); port?.postMessage({type: "budget-permit", protocol: 1, durationMs: 0}); }
        if (mounted) { clearTimeout(bootTimer); $("connecting").hidden = true; }
        void pulseBudget();
      }
      if (launch?.budget && value?.type === "budget-permit-ended" && value.protocol === 1) permitEnded();
      if (value?.type === "return") void stop(true);
      if (value?.type === "stopped") stopResolve?.();
    };
    port.start();
    frame.contentWindow.postMessage({type: "life-ark-init", protocol: 1, payload: latest,
      ...(launch.budget ? {budgetProtocol: 1, releaseId: launch.releaseId} : {})}, launch.gameOrigin, [channel.port2]);
  });
  async function stop(sync = true, message = "") {
    if (stopping) return stopping;
    stopping = (async () => {
      clearTimeout(bootTimer); clearInterval(renewTimer); clearTimeout(saveTimer);
      clearTimeout(pulseTimer); clearTimeout(permitTimer);
      if (port) await new Promise(resolve => { const timer = setTimeout(resolve, 1500); stopResolve = () => { clearTimeout(timer); resolve(); }; port.postMessage({type: "stop"}); });
      frame?.remove(); frame = null; port?.close(); port = null; stopResolve = null;
      // Stop/snapshot immediately, before waiting for a slow or failed network.
      await budgetBusy;
      if (launch?.budget) {
        try { const settled = await api("/api/game/pulse", {launchId: launch.launchId, sequence: ++pulseSequence, playing: false}); drawBudget(settled.budget); }
        catch { /* Keep the durable server reservation and preserve the final snapshot. */ }
      }
      if (sync) await flush();
      persist();
      const ended = launch; launch = null;
      if (ended) { try { await api("/api/game/end", {launchId: ended.launchId}); } catch { /* A failed end cannot reset server usage. */ } }
      $("budget-clock").hidden = true;
      $("stage").hidden = true; document.body.classList.remove("playing"); $("lobby").inert = false; $("feedback").hidden = false;
      show(message || (dirty ? durable ? "已返回网站。进度已留在当前浏览器，但还没有同步到云端，请重新连接后继续。" : "进度只保留在此页面内存中，请下载副本后再关闭页面。" : "已返回网站，进度已同步。欢迎留下这次试玩的感受。"), !!message || dirty);
      try { await checkIdentity(); cloud = await api("/api/game/save"); ready(); if (dirty) recovery(); }
      catch (error) { if (error.code) { $("ready").hidden = true; $("feedback").hidden = true; $("recovery").hidden = true; $("signin").hidden = false; show(error.message, true); } }
      $("play").disabled = !$("recovery").hidden || playBudget?.exhausted === true;
      $("notice").scrollIntoView({block: "center"});
    })().finally(() => { stopping = null; });
    return stopping;
  }
  $("play").addEventListener("click", () => { void start(); });
  $("cancel-play").addEventListener("click", () => { void stop(false); });
  $("code").addEventListener("input", () => { checkedCode = ""; $("confirmation").hidden = true; });
  $("code-form").addEventListener("submit", async event => {
    event.preventDefault(); const button = event.submitter; button.disabled = true;
    try {
      const code = $("code").value.trim(), value = await api("/api/account/entitlement-preview", {code});
      if (!value.package.resources.some(resource => resource.id === "life-ark-molecules-trial")) throw new Error("这不是生命方舟的试玩兑换码，请核对。");
      checkedCode = code; $("code-scope").textContent = `即将绑定到 ${session.user.displayName}：${value.package.title}。包含：${value.package.resources.map(r => r.title).join("、")}。`;
      $("confirmation").hidden = false; show("请核对当前账号和试玩范围，然后确认兑换。");
    } catch (error) { checkedCode = ""; $("confirmation").hidden = true; show(error.message, true); }
    finally { button.disabled = false; }
  });
  $("confirm-code").addEventListener("click", async () => {
    $("confirm-code").disabled = true;
    try { if (!checkedCode) return; await api("/api/account/entitlement-redeem", {code: checkedCode, confirmed: true}); checkedCode = ""; $("code").value = ""; await initialize(); }
    catch (error) { show(error.message, true); } finally { $("confirm-code").disabled = false; }
  });
  $("use-local").addEventListener("click", () => {
    const copy = copies[Number($("copies").value)]; if (!copy) return;
    if (!mayReplaceCampaign(copy.value.payload, cloud.payload)) { show(oldCampaignMessage, true); return; }
    latest = copy.value.payload; revision = cloud.revision; pending = null; dirty = true; blocked = false; adopted = copy.key ? [copy] : []; newKey(); persist();
    copies = []; $("recovery").hidden = true; $("play").disabled = playBudget?.exhausted === true; show("已选本机进度。进入试玩后会同步到云端；云端旧版本还会保留一份。");
  });
  $("use-cloud").addEventListener("click", () => {
    latest = cloud.payload; revision = cloud.revision; pending = null; dirty = false; blocked = false; adopted = []; newKey(); copies = []; $("recovery").hidden = true; $("play").disabled = playBudget?.exhausted === true;
    show("已选云端进度。未同步的本机副本继续保留，没有删除。");
  });
  $("download-copy").addEventListener("click", () => {
    const copy = copies[Number($("copies").value)]; if (!copy) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify({gameId: "life-ark-molecules", payload: copy.value.payload}, null, 2)], {type: "application/json"}));
    const link = document.createElement("a"); link.href = url; link.download = "life-ark-unsynced-progress.json"; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  $("feedback-form").addEventListener("submit", async event => {
    event.preventDefault(); const button = event.submitter; button.disabled = true;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try { await checkIdentity(); await api("/api/game/feedback", {...values, lastRoute: latest?.route || "title"}); show("试玩反馈已保存，谢谢你。我们会结合反馈继续修改游戏。"); }
    catch (error) { show(error.message || "反馈还未提交，请重试。", true); } finally { button.disabled = false; }
  });
  window.addEventListener("beforeunload", event => { if (frame || dirty) { persist(); event.preventDefault(); event.returnValue = ""; } });
  window.addEventListener("pageshow", event => { if (event.persisted) location.reload(); });
  async function recheck() {
    if (!context?.entitled) return;
    try { await checkIdentity(); if (launch && dirty) { await api("/api/game/renew", {launchId: launch.launchId}); await flush(); } }
    catch (error) { if (error.code) { blocked = true; void stop(false, error.message); } }
  }
  window.addEventListener("focus", recheck); window.addEventListener("online", recheck);
  window.addEventListener("offline", () => { if (frame) status("已离线 · 进度先留在本机", true); });
  document.addEventListener("visibilitychange", () => {
    if (!launch?.budget) return;
    if (document.hidden) { clearTimeout(permitTimer); port?.postMessage({type: "budget-permit", protocol: 1, durationMs: 0}); }
    void pulseBudget();
  });
  try { const channel = new BroadcastChannel("ander-account-session"); channel.onmessage = recheck; } catch { /* Focus and renewal also recheck. */ }
  initialize().catch(error => { show(error.message || "试玩入口暂时无法连接，请刷新后重试。", true); });
})();
