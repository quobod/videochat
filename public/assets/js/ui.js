import { stringify, parse } from "./utils.js";
import { getAttribute, log, hasCam, dlog, cap } from "./clientutils.js";
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

export const updateUsersList = async (
  userList,
  listItemClickHandler,
  detectWebcam
) => {
  const listParent = document.querySelector("#users-parent");
  const currentUser = document.querySelector("#rmtid-input").value;

  removeChildren(listParent);

  for (const u in userList) {
    const uObj = userList[u];

    if (uObj._id != currentUser) {
      const userName = newElement("h6");
      const item = newElement("li");
      const container = newElement("div");
      const row = newElement("div");
      const col1 = newElement("div");
      const col2 = newElement("div");
      const icon = newElement("i");

      // Set attributes

      addAttribute(userName, "style", "text-align:center;");
      addAttribute(userName, "id", `h6-${uObj._id}`);
      addAttribute(item, "class", "list-group-item flex-fill");
      addAttribute(item, "id", `li-${uObj._id}`);
      addAttribute(item, "data-toggle", "tooltip");
      addAttribute(item, "data-placement", "right");
      addAttribute(item, "data-html", "true");
      addAttribute(item, "title", `${uObj.fname}`);

      addAttribute(icon, "class", "bi");
      addAttribute(icon, "id", `icon-${uObj._id}`);

      addAttribute(container, "class", "container-fluid");
      addAttribute(row, "class", "row");
      addAttribute(col1, "class", "col-6");
      addAttribute(col2, "class", "col-6");

      // Append elements
      appendChild(listParent, item);
      appendChild(item, container);
      appendChild(container, row);
      appendChild(row, col1);
      appendChild(row, col2);
      appendChild(col1, userName);
      appendChild(col2, icon);

      detectWebcam((webcam) => {
        if (webcam) {
          icon.classList.add("bi-webcam-fill");
          addAttribute(icon, "data-connectiontype", "webcam");
        } else {
          icon.classList.add("bi-chat-dots-fill");
          addAttribute(icon, "data-connectiontype", "nowebcam");
        }
      });

      // Set text
      userName.innerHTML = `<p id="p-${uObj._id}" style="font-size:small;margin:0;padding:3px;"><strong id="s-${uObj._id}">${uObj.fname}</strong></p>`;

      // Register click handler for the item element
      addClickHandler(icon, listItemClickHandler);
    }
  }
};

export const showMessage = (userDetails, iconClickHandler) => {
  const { userInfo, hasWebcam, messageBody, alertType } = userDetails;
  const messageParent = document.querySelector("#message-container");
  const alert = newElement("div");
  const alertCloseButton = newElement("button");
  const container = newElement("div");
  const row1 = newElement("div");
  const row2 = newElement("div");
  const row1Col = newElement("div");
  const row2Col = newElement("div");
  const row1P = newElement("p");
  const webcamIcon = newElement("i");
  const messageIcon = newElement("i");

  removeChildren(messageParent);

  /* Set attributes */

  // Alert attributes
  addAttribute(
    alert,
    "class",
    `alert ${alertType} d-flex align-items-center alert-dismissible fade show`
  );
  addAttribute(alert, "role", "alert");
  addAttribute(alert, "style", "display:inline-flex;");
  addAttribute(alert, "id", "alert");

  // Alert close button attributes
  addAttribute(alertCloseButton, "class", "btn-close");
  addAttribute(alertCloseButton, "type", "button");
  addAttribute(alertCloseButton, "data-bs-dismiss", "alert");
  addAttribute(alertCloseButton, "aria-label", "Close");

  // Container, rows and columns attributes
  addAttribute(container, "class", "container-fluid m-0 p-0");
  addAttribute(container, "style", "margin:0;padding:0;");
  addAttribute(row1, "class", "row m-0 p-0");
  addAttribute(row2, "class", "row m-0 p-0");
  addAttribute(row1Col, "class", "col-12 m-0 p-0");
  addAttribute(row2Col, "class", "col-12 m-0 p-0");

  // Icon attributes
  addAttribute(webcamIcon, "class", "bi bi-webcam-fill icon");
  addAttribute(webcamIcon, "id", `wc-${userInfo._id}`);
  addAttribute(messageIcon, "class", "bi bi-chat-left-dots-fill icon");
  addAttribute(messageIcon, "id", `mi-${userInfo._id}`);

  /* Append elements */

  // Append to view
  appendChild(messageParent, alert);

  // Append to alert
  appendChild(alert, container);
  appendChild(alert, alertCloseButton);

  // Append to container, rows and columns
  appendChild(container, row1);
  appendChild(container, row2);
  appendChild(row1, row1Col);
  appendChild(row2, row2Col);

  // Append elements
  appendChild(row1, row1P);

  // Detect user's webcam
  if (hasWebcam) {
    appendChild(row2Col, webcamIcon);
  } else {
    appendChild(row2Col, messageIcon);
  }

  // Set alert's title
  row1P.innerHTML = `${messageBody}`;

  addClickHandler(webcamIcon, iconClickHandler);
  addClickHandler(messageIcon, iconClickHandler);
};

export const showCallAlert = (userDetails) => {
  const { userInfo, alertType } = userDetails;
  const messageParent = document.querySelector("#message-container");
  const alert = newElement("div");
  const alertCloseButton = newElement("button");
  const strong = newElement("strong");

  /* Set attributes */

  // Alert attributes
  addAttribute(
    alert,
    "class",
    `alert ${alertType} d-flex align-items-center alert-dismissible fade show`
  );
  addAttribute(alert, "role", "alert");
  addAttribute(alert, "style", "display:inline-flex;");
  addAttribute(alert, "id", "alert");

  // Alert close button attributes
  addAttribute(alertCloseButton, "class", "btn-close");
  addAttribute(alertCloseButton, "type", "button");
  addAttribute(alertCloseButton, "data-bs-dismiss", "alert");
  addAttribute(alertCloseButton, "aria-label", "Close");

  // Alert title
  strong.innerHTML = `... Calling ${cap(userInfo.fname)}`;

  /* Append elements */

  // Append to view
  appendChild(messageParent, alert);

  // Append to alert
  appendChild(alert, strong);
  appendChild(alert, alertCloseButton);

  setTimeout(() => {
    alert.remove();
  }, [4000]);
};
