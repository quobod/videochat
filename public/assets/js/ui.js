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
  detectWebcam,
  acceptCall,
  rejectCall
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
      const col3 = newElement("div");
      const callRequestContainer = newElement("div");
      const callRequestTitleRow = newElement("div");
      const callRequestTitleCol = newElement("div");
      const callRequestAcceptRow = newElement("div");
      const callRequestRejecttRow = newElement("div");
      const callRequestAcceptCol = newElement("div");
      const callRequestRejectCol = newElement("div");
      const acceptButton = newElement("button");
      const rejectButton = newElement("button");
      const callRequestTitle = newElement("small");
      const icon = newElement("i");

      // Set attributes

      addAttribute(
        callRequestContainer,
        "class",
        "container-fluid connecton-request-container"
      );
      addAttribute(callRequestContainer, "id", `callrequest-${uObj._id}`);
      addAttribute(callRequestAcceptRow, "class", "row");
      addAttribute(callRequestRejecttRow, "class", "row");
      addAttribute(callRequestTitleRow, "class", "row");
      addAttribute(callRequestAcceptCol, "class", "col-5");
      addAttribute(callRequestRejectCol, "class", "col-5");
      addAttribute(callRequestTitleCol, "class", "col-12");
      addAttribute(acceptButton, "type", "button");
      addAttribute(acceptButton, "class", "btn btn-success btn-sm");
      addAttribute(rejectButton, "type", "button");
      addAttribute(rejectButton, "class", "btn btn-danger btn-sm");

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
      addAttribute(col1, "class", "col-4");
      addAttribute(col2, "class", "col-4");
      addAttribute(col3, "class", "col-4");

      addAttribute(callRequestTitle, "id", `callrequesttitle-${uObj._id}`);

      // Append elements

      appendChild(callRequestContainer, callRequestTitleRow);
      appendChild(callRequestTitleRow, callRequestTitleCol);
      appendChild(callRequestTitleCol, callRequestTitle);
      appendChild(callRequestContainer, callRequestAcceptRow);
      appendChild(callRequestContainer, callRequestRejecttRow);
      appendChild(callRequestAcceptRow, callRequestAcceptCol);
      appendChild(callRequestRejecttRow, callRequestRejectCol);
      appendChild(callRequestAcceptCol, acceptButton);
      appendChild(callRequestRejectCol, rejectButton);

      appendChild(listParent, item);
      appendChild(item, container);
      appendChild(item, callRequestContainer);
      appendChild(container, row);
      appendChild(row, col1);
      appendChild(row, col2);
      appendChild(row, col3);
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
      acceptButton.innerHTML = `<strong>Accept</strong>`;
      rejectButton.innerHTML = `<strong>Reject</strong>`;

      // Register click handler for the item element
      addClickHandler(icon, listItemClickHandler);
      addClickHandler(acceptButton, () => {
        acceptCall(uObj._id, document.querySelector("#rmtid-input").value);
      });
      addClickHandler(rejectButton, () => {
        rejectCall(uObj._id, document.querySelector("#rmtid-input").value);
      });
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
