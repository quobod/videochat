import { stringify, parse } from "./utils.js";
import { getAttribute, log, hasCam, dlog } from "./clientutils.js";
import {
  getElement,
  newElement,
  removeChildren,
  appendChild,
  addClickHandler,
  addHandler,
  addAttribute,
  countChildren,
  removeChild,
} from "./computils.js";

export const updateUsersList = async (userList, listItemClickHandler) => {
  const listParent = document.querySelector("#users-parent");
  const currentUser = document.querySelector("#rmtid-input").value;

  removeChildren(listParent);

  for (const u in userList) {
    const uObj = userList[u];

    if (uObj._id != currentUser) {
      const cardTitle = newElement("h6");
      const item = newElement("li");

      // Set attributes
      addAttribute(cardTitle, "style", "text-align:center;");
      addAttribute(cardTitle, "id", `h6-${uObj._id}`);
      addAttribute(item, "class", "list-group-item flex-fill");
      addAttribute(item, "id", `li-${uObj._id}`);

      // Append elements
      appendChild(listParent, item);
      appendChild(item, cardTitle);

      // Set text
      cardTitle.innerHTML = `<p id="p-${uObj._id}" style="font-size:small;margin:0;padding:3px;"><strong id="s-${uObj._id}">${uObj.fname}</strong></p>`;

      // Register click handler for the item element
      addClickHandler(item, listItemClickHandler);
    }
  }
};

export const showMessage = (userDetails) => {
  const { userInfo, hasWebcam } = userDetails;
  const messageParent = document.querySelector("#message-container");
  const alert = newElement("div");
  const title = newElement("h5");
  const body = newElement("p");
  const group = newElement("div");
  const camIcon = newElement("i");
  const messageIcon = newElement("i");
  const closeButton = newElement("button");

  removeChildren(messageParent);

  // Set attributes
  addAttribute(
    alert,
    "class",
    "alert alert-info d-flex align-items-center alert-dismissible fade show"
  );
  addAttribute(alert, "role", "alert");
  addAttribute(alert, "style", "display:inline-flex;");
  addAttribute(title, "class", "alert-heading");
  addAttribute(body, "class", "mb-0");
  addAttribute(group, "class", "input-group");
  addAttribute(camIcon, "class", "bi bi-webcam-fill");
  addAttribute(messageIcon, "class", "bi bi-chat-left-dots-fill");
  addAttribute(closeButton, "class", "btn-close");
  addAttribute(closeButton, "type", "button");
  addAttribute(closeButton, "data-bs-dismiss", "alert");
  addAttribute(closeButton, "aria-label", "Close");

  // Append elements
  appendChild(messageParent, alert);
  appendChild(alert, title);
  appendChild(alert, body);
  appendChild(alert, group);
  appendChild(alert, closeButton);

  if (hasWebcam) {
    appendChild(group, camIcon);
  } else {
    appendChild(group, messageIcon);
  }

  title.innerHTML = `<p>${userInfo.fname}</p>`;
};
