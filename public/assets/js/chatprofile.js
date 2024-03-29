import { dlog, log } from "./clientutils.js";
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
const unblockUserIcons = getElements(".unblock");
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

unblockUserIcons.forEach((icon) => {
  addClickHandler(icon, (e) => {
    const target = e.target.id.split("-")[1];
    const blocker = getElement("rmtId").value;

    dlog(`${blocker} is unblocking ${target}`);
    unblockUser(blocker, target);
  });
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

function unblockUser(blockerUid, blockeeUid) {
  let xmlHttp;

  try {
    xmlHttp = new XMLHttpRequest();

    xmlHttp.open("POST", "/chat/unblock", true);

    xmlHttp.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );

    xmlHttp.onload = () => {
      const responseText = xmlHttp.responseText;

      if (responseText) {
        // log(`\n\tResponse Text: ${stringify(responseText)}\n`);
        const responseJson = parse(responseText);
        const status = responseJson.status;

        if (status) {
          dlog(`${blockerUid} unblocked ${blockeeUid}`);
          location.href = `/chat/profile/view/${blockerUid}`;
        } else {
          dlog(`Something went wrong blocking user`);
        }
        return;
      }
    };

    xmlHttp.send(`blocker=${blockerUid}&blockee=${blockeeUid}`, true);
  } catch (err) {
    tlog(err);
    return;
  }
}
