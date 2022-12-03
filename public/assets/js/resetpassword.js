import { stringify, parse, stripTags } from "./utils.js";
import { log, cls, dlog } from "./clientutils.js";
import {
  addKeyupHandler,
  addOnFocusHandler,
  addClickHandler,
  getElement,
  getElements,
} from "./computils.js";

if (window) {
  cls();
  const nav = navigator;
  const platform = nav.platform;
  const lang = nav.language;
  const langs = nav.languages;
  const userAgent = nav.userAgent;
  const vendor = nav.vendor;

  log(`Platform:\t${platform}`);
  log(`Languages:\t${langs}`);
  log(`Language:\t${lang}`);
  log(`UAgent:\t${userAgent}`);
  log(`Vendor:\t${vendor}`);
  log(`--------------------------------------------------------\n\n`);
  log(`Reset password`);

  addEventListener("beforeunload", (event) => {
    log(`\n\tBefore unload\n`);
  });
}

const pwd1 = getElement("pwd1");
const pwd2 = getElement("pwd2");
const showPwds = getElement("show-pwds");
const resetSubmitButton = getElement("reset-submit-button");
const inputs = getElements(".input");

resetSubmitButton.disabled = true;

addClickHandler(showPwds, (e) => {
  const target = e.target;

  if (target.classList.contains("bi-eye-fill")) {
    target.classList.remove("bi-eye-fill");
    target.classList.add("bi-eye-slash-fill");
    pwd1.setAttribute("type", "text");
    pwd2.setAttribute("type", "text");
  } else {
    target.classList.add("bi-eye-fill");
    target.classList.remove("bi-eye-slash-fill");
    pwd1.setAttribute("type", "password");
    pwd2.setAttribute("type", "password");
  }
});

inputs.forEach((i) => {
  addKeyupHandler(i, (e) => {
    const target = e.target;
    const value = target.value;
    const sanitizedValue = stripTags(value);
    target.value = sanitizedValue;

    dlog(`Element ${target.id} key up event fired`);

    resetSubmitButton.disabled = pwd1.value == pwd2.value ? false : true;
  });
});
