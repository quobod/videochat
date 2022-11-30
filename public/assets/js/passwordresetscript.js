import { stringify, parse, stripTags } from "./utils.js";
import { log, cls, dlog, addClickHandler } from "./clientutils.js";
import { addKeyupHandler, getElement } from "./computils.js";

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
  log(`Password reset`);

  addEventListener("beforeunload", (event) => {
    log(`\n\tBefore unload\n`);
  });
}

// Comps
const emailInput = getElement("email");
const submitButton = getElement("reset-submit-button");
const divEmailError = getElement("divemailerror");
const resetForm = getElement("reset-password");

submitButton.disabled = true;

addKeyupHandler(emailInput, (e) => {
  const target = e.target;
  const value = target.value.trim();
  const sanitizedValue = stripTags(value);
  target.value = sanitizedValue;
  cls();
  dlog(`${sanitizedValue}`);

  submitButton.disabled = sanitizedValue.length > 0 ? false : true;
});

resetForm.addEventListener("submit", (e) => {
  e.preventDefault();
  validateEmail();
});

function validateEmail() {
  let xmlHttp;

  try {
    xmlHttp = new XMLHttpRequest();

    xmlHttp.open("POST", "/auth/validateuser", true);

    xmlHttp.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );

    xmlHttp.onload = () => {
      const responseText = xmlHttp.responseText;
      emailInput.value = "";

      if (responseText) {
        const responseJson = parse(responseText);
        const status = responseJson.status;

        if (status) {
          dlog(`User validated`);
          //   location.href = `/chat/profile/view/${blockerUid}`;
        } else {
          const cause = responseJson.cause;
          dlog(`${cause}`);
        }
        return;
      }
    };

    xmlHttp.send(`email=${emailInput.value}`, true);
  } catch (err) {
    tlog(err);
    return;
  }
}
