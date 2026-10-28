"use strict";
window.AnderRegistration = (() => {
  let enabled = false;
  let pendingAgreement = null;
  const section = () => document.querySelector("[data-registration-age]");
  function read() {
    if (!enabled) return {};
    const root = section(), age = root.querySelector("[data-age-band]"), permit = root.querySelector("[data-guardian-permit]"), agree = root.querySelector("[data-child-rules]");
    if (!age.value) {age.focus(); throw new Error("请先选择年龄范围。所有年龄均可申请注册。");}
    if (age.value !== "under14") return {ageBand:age.value};
    if (!/^[a-f0-9]{64}$/.test(permit.value.trim()) || !agree.checked) {
      throw new Error("请由监护人先联系工作室完成审核，填写一次性注册许可并阅读儿童规则。");
    }
    return {ageBand:age.value,guardianPermit:permit.value.trim(),childRulesAgreed:true};
  }
  function initialize(session) {
    const root = section(); if (!root || !session.registrationPolicy?.enabled) return;
    enabled = true; root.hidden = false;
    const age = root.querySelector("[data-age-band]"), child = root.querySelector("[data-child-registration]"), entry = document.querySelector("[data-registration-entry]");
    function update() {
      child.hidden = age.value !== "under14";
      const permit = root.querySelector("[data-guardian-permit]");
      entry.hidden = !age.value || age.value === "under14" && (!/^[a-f0-9]{64}$/.test(permit.value.trim()) || !root.querySelector("[data-child-rules]").checked);
      document.dispatchEvent(new Event("ander-registration-changed"));
    }
    root.addEventListener("input",update); root.addEventListener("change",update); update();
  }
  async function ensureAgreement(form) {
    if (form.elements.agree.checked) return true;
    if (pendingAgreement) return false;
    pendingAgreement = new Promise(resolve => {
      const dialog = document.createElement("dialog"), title = document.createElement("h2"), text = document.createElement("p");
      dialog.className = "local-captcha-dialog"; title.textContent = "发送前，请阅读并同意";
      title.id = "registration-consent-title"; dialog.setAttribute("aria-labelledby", title.id);
      text.append("我已阅读并同意 ");
      for (const [label, href] of [["用户协议", "/terms.html"], ["隐私政策", "/privacy.html"]]) {
        const link = document.createElement("a"); link.href = href; link.target = "_blank"; link.rel = "noopener"; link.textContent = label; text.append(link, " ");
      }
      const yes = document.createElement("button"), no = document.createElement("button");
      yes.type = no.type = "button"; yes.textContent = "同意并继续验证"; no.textContent = "暂不同意";
      yes.className = "primary"; no.className = "secondary";
      const finish = agreed => {if (agreed) form.elements.agree.checked = true; dialog.close(); dialog.remove(); resolve(agreed);};
      yes.onclick = () => finish(true); no.onclick = () => finish(false);
      dialog.addEventListener("cancel", e => {e.preventDefault(); finish(false);}, {once: true});
      dialog.append(title, text, yes, no); document.body.append(dialog); dialog.showModal(); no.focus();
    });
    try {return await pendingAgreement;} finally {pendingAgreement = null;}
  }
  return Object.freeze({initialize,read,ensureAgreement});
})();
