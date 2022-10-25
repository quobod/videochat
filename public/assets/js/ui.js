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
  const alertCloseButton = newElement("button");
  const container = newElement("div");
  const row1 = newElement("div");
  const row2 = newElement("div");
  const row1Col = newElement("div");
  const row2Col = newElement("div");
  const row1P = newElement("p");
  const webcamIcon = newElement("i");
  const messageIcon = newElement("i");

  /* Set attributes */

  // Alert attributes
  addAttribute(
    alert,
    "class",
    "alert alert-info d-flex align-items-center alert-dismissible fade show"
  );
  addAttribute(alert, "role", "alert");
  addAttribute(alert, "style", "display:inline-flex;");

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
  addAttribute(messageIcon, "class", "bi bi-chat-left-dots-fill icon");

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
  row1P.innerHTML = `<p>Request a private connection with ${userInfo.fname}</p>`;
};
