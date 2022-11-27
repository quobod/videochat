import { log } from "./clientutils.js";
import { stringify, parse, stripTags } from "./utils.js";
import {
  getElement,
  getElements,
  addOnChangeHandler,
  addClickHandler,
  addKeyupHandler,
} from "./computils.js";

const submitButton = getElement("submit-button");
const unameError = getElement("uname-error");
const uNameInput = getElement("uName");
const displayNameInput = getElement("displayName");
const isVisibleInput = getElement("isVisible");
const publicInput = getElement("public");
const originalUsername = uNameInput.value.trim();
const usernames = getElements(".username");
const unames = [];

usernames.forEach((u) => {
  // const username = u.innerHTML.split("-")[1];
  const username = u.innerHTML;
  unames.push(username);
});

submitButton.disabled = true;

addKeyupHandler(uNameInput, (e) => {
  const target = e.target;
  target.value = target.value.trim();

  log(`Key Up event fired`);
  log(`Element ${target.id} value: ${target.value}\n\n`);

  checkUsername();
});

addOnChangeHandler(displayNameInput, (e) => {
  const target = e.target;

  log(`Change event fired`);
  log(`Element ${target.id} value: ${target.value}\n\n`);

  checkUsername();
});

addOnChangeHandler(isVisibleInput, (e) => {
  const target = e.target;

  log(`Change event fired`);
  log(`Element ${target.id} value: ${target.value}\n\n`);

  checkUsername();
});

addOnChangeHandler(publicInput, (e) => {
  const target = e.target;

  log(`Change event fired`);
  log(`Element ${target.id} value: ${target.value}\n\n`);

  checkUsername();
});

function nameTaken(str) {
  const index = unames.findIndex((x) => x == str);
  return index != -1;
}

function checkUsername() {
  if (
    uNameInput.value != originalUsername &&
    nameTaken(uNameInput.value.trim())
  ) {
    submitButton.disabled = true;
    unameError.classList.remove("d-none");
    unameError.innerHTML = `<strong>${uNameInput.value}</strong> is taken`;
  } else {
    submitButton.disabled = false;

    if (!unameError.classList.contains("d-none")) {
      unameError.classList.add("d-none");
    }
  }
}
