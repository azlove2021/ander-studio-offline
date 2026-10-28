"use strict";
window.AnderEmailChange={initialize({root=document,signal,session,request,show,bindForm}){
  const $=s=>root.querySelector(s),form=$("[data-email-change-form]");if(!form||!session.emailAuth?.changeOpen)return;
  $("[data-email-change-closed]").hidden=true;$("[data-email-settings]").hidden=false;form.querySelector("fieldset").disabled=false;
  const changing=session.user.emailVerified,send=$("[data-email-change-send]"),next=$("[data-email-change-next]");
  $("[data-email-old-step]").hidden=!changing;$("[data-email-previous]").textContent=session.user.emailMasked;form.elements.oldCode.disabled=!changing;
  let oldId="",newId="",target="",generation=0,busy=false;const holds=new Map(),canonical=()=>form.elements.email.value.trim().toLowerCase();
  const reset=()=>{generation++;oldId="";newId="";target="";form.elements.code.value="";form.elements.oldCode.value="";};
  form.elements.email.addEventListener("input",reset);form.elements.currentPassword.addEventListener("input",reset);
  const remaining=key=>Math.max(0,Math.ceil(((holds.get(key)||0)-Date.now())/1000));
  function update(){for(const [b,key,label]of[[send,changing?"old":canonical(),changing?"获取原邮箱验证码":"获取新邮箱验证码"],[next,canonical(),"验证原邮箱并获取新验证码"]]){const seconds=remaining(key);b.textContent=seconds?`${seconds} 秒后重发`:label;b.disabled=busy||seconds>0||(b===next&&!oldId);}}
  async function code(isNew){
    if(busy||!form.elements.email.reportValidity()||(!isNew&&!form.elements.currentPassword.reportValidity()))return;
    if(isNew&&(!oldId||!/^\d{6}$/.test(form.elements.oldCode.value))){show("请填写原邮箱收到的 6 位验证码。",true);return;}
    const email=canonical(),phase=changing?(isNew?"change-new":"change-old"):"change-bind",key=phase==="change-old"?"old":email,gen=generation;
    if(remaining(key))return;const input={purpose:phase,email,...(isNew?{oldChallengeId:oldId,oldCode:form.elements.oldCode.value}:{currentPassword:form.elements.currentPassword.value})};
    busy=true;newId="";if(!isNew)oldId="";update();let attempted=false;
    try{
      if(!window.AnderCaptcha)throw new Error("人机验证尚未加载，本次未发送邮件。");
      input.captcha=await window.AnderCaptcha.verify({request,channel:"email",purpose:phase,email,current:()=>generation===gen&&canonical()===email});
      attempted=true;const result=await request("/api/account/email/change-code",input);holds.set(key,Date.now()+result.retryAfter*1000);
      if(generation===gen&&canonical()===email){target=email;if(phase==="change-old")oldId=result.challengeId;else{newId=result.challengeId;oldId="";}show(result.message);}
    }catch(e){if(e.retryAfter>0)holds.set(key,Date.now()+e.retryAfter*1000);if(attempted&&e.code==="MAIL_SEND_FAILED"){oldId="";holds.set(key,Date.now()+60000);}show(e.message.replaceAll("短信","邮件"),true);}
    finally{busy=false;update();}
  }
  send.onclick=()=>code(false);next.onclick=()=>code(true);const timer=setInterval(update,500); signal?.addEventListener("abort",()=>clearInterval(timer),{once:true});update();
  bindForm("[data-email-change-form]",async values=>{
    if(busy||!newId||canonical()!==target)throw new Error("请先完成当前邮箱的验证步骤。");
    const result=await request("/api/account/email/change",{email:target,code:values.code,challengeId:newId});form.reset();reset();
    location.assign(result.next+"&notice="+(result.notificationState==="accepted"?"accepted":"failed"));
  });
}};
