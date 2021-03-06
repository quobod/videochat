import * as elements from "./connectedpeersscriptelements.js";
import {
  removeChildren,
  newElement,
  addHandler,
  addAttribute,
  appendChild,
  getElement,
  addClickHandler,
  cap,
  dlog,
  stringify,
} from "../utils.js";
import { chatType } from "../constants.js";
import {
  requestChat,
  userIsBlocked,
  addUserToBlockedList,
  removeUserFromBlockedList,
  checkIsBlocked,
} from "./wss.js";

// Exported functions

export const updatePersonalCode = (id) => (elements.personalCode.value = id);

export const updateUserList = (data) => {
  if (elements.peersList) {
    const userList = elements.peersList;
    const personalCode = elements.personalCode.value;
    const rmtId = elements.rmtIdInput.value;
    let dynamicUserActions = document.querySelector("#dynamic-user-actions");

    const accordionItem = newElement("div");
    const accordionButton = newElement("button");
    const accordionCollapse = newElement("div");
    const accordionBody = newElement("div");
    const accordionHeader = newElement("h2");
    const accordionHeaderPara = newElement("p");
    const menuIcon = newElement("i");

    // Card components
    const card = newElement("div");
    const cardHeader = newElement("div");
    const cardHeaderContainer = newElement("div");
    const cardHeaderRow = newElement("div");
    const cardHeaderLefCol = newElement("div");
    const cardHeaderRightCol = newElement("div");
    const cardBody = newElement("div");
    const cardTitle = newElement("div");
    const cardFooter = newElement("div");

    // Card controls
    const divControls = newElement("div");
    const imgPlaceholder = newElement("i");
    const videoIcon = newElement("i");
    const phoneIcon = newElement("i");
    const paraPeerName = newElement("p");

    // Dynamic menu items
    const blockUserAnchor = newElement("a");
    const blockUserListItem = newElement("li");
    const blockUserInput = newElement("input");
    const blockUserInputPanel = newElement("div");
    const blockUserCheckbox = newElement("input");
    const blockUserCheckboxPanel = newElement("div");
    const blockUserComponentParent = newElement("div");
    appendChild(dynamicUserActions, blockUserComponentParent);

    removeChildren(userList);

    data.forEach((item, index) => {
      if (
        !item.hide &&
        item.rmtId != rmtId &&
        !checkIsBlocked(rmtId, item.blockedUsers)
      ) {
        // console.log(`\n\tItem: ${JSON.stringify(item)}\n\n`);
        // if (!item.hide) {

        // Append menu items
        appendChild(blockUserCheckboxPanel, blockUserCheckbox);
        appendChild(blockUserInputPanel, blockUserInput);
        appendChild(blockUserComponentParent, blockUserCheckboxPanel);
        appendChild(blockUserComponentParent, blockUserInputPanel);
        // Menu items attributes
        addAttribute(blockUserInputPanel, "class", "col auto");
        addAttribute(blockUserCheckboxPanel, "class", "col auto");

        addAttribute(blockUserCheckbox, "type", "checkbox");
        addAttribute(blockUserCheckbox, "id", `${item.rmtId}`);
        addAttribute(blockUserCheckbox, "class", "form-check-input");

        addAttribute(blockUserInput, "type", "text");
        addAttribute(blockUserInput, "class", "form-control");
        addAttribute(blockUserInput, "readonly", "");
        addAttribute(
          blockUserInput,
          "value",
          `Block ${item.uname || item.fname}`
        );
        addAttribute(blockUserComponentParent, "class", "row p-1");

        userIsBlocked({ blocker: rmtId, blockee: item.rmtId }, (data) => {
          const { blocked } = data;

          dlog(`Blocked: ${blocked}`);

          if (blocked) {
            blockUserCheckbox.checked = true;
          }
        });

        /*
          Append components
        */

        // Accordion
        appendChild(userList, accordionItem);
        appendChild(accordionItem, accordionHeader);
        appendChild(accordionHeader, accordionButton);
        appendChild(accordionButton, accordionHeaderPara);
        appendChild(accordionItem, accordionCollapse);
        appendChild(accordionCollapse, accordionBody);
        appendChild(accordionBody, card);

        // Card
        appendChild(card, cardHeader);
        appendChild(card, cardBody);
        appendChild(card, cardFooter);
        appendChild(cardFooter, divControls);
        appendChild(cardHeader, cardHeaderRow);
        // appendChild(cardHeaderContainer, cardHeaderRow);
        appendChild(cardHeaderRow, cardHeaderLefCol);
        appendChild(cardHeaderRow, cardHeaderRightCol);
        appendChild(cardHeaderLefCol, paraPeerName);
        appendChild(cardHeaderRightCol, menuIcon);

        // Controls
        appendChild(divControls, videoIcon);
        appendChild(divControls, phoneIcon);

        /*
          Attributes
        */

        // addAttribute(cardHeaderContainer, "class", "container-fluid");
        addAttribute(cardHeaderRow, "class", "row");
        addAttribute(cardHeaderLefCol, "class", "col auto px-2");
        addAttribute(cardHeaderRightCol, "class", "col-1 px-1 right-align");

        // Accordion
        addAttribute(accordionItem, "class", `accordion-item`);

        addAttribute(accordionHeader, "class", "accordion-header");
        addAttribute(accordionHeader, "id", `${index}`);
        addAttribute(accordionButton, "class", "accordion-button");
        addAttribute(accordionButton, "type", "button");
        addAttribute(accordionButton, "data-bs-toggle", "collapse");
        addAttribute(accordionButton, "data-bs-target", `#item-${index}`);
        addAttribute(accordionButton, "aria-expanded", "false");
        addAttribute(accordionButton, "aria-controls", `item-${index}`);
        addAttribute(accordionCollapse, "id", `item-${index}`);
        addAttribute(
          accordionCollapse,
          "class",
          "accordion-collapse callapse show"
        );
        addAttribute(accordionCollapse, "aria-labelledby", `item-${index}`);
        addAttribute(accordionCollapse, "data-bs-parent", `#peer-list`);
        addAttribute(accordionBody, "class", "accordion-body");

        // Card
        addAttribute(card, "class", "card");
        addAttribute(cardHeader, "class", "card-header");
        addAttribute(cardBody, "class", "card-body");
        addAttribute(cardFooter, "class", "card-footer");
        addAttribute(
          menuIcon,
          "class",
          "bi bi-three-dots menu-item text-secondary"
        );
        addAttribute(menuIcon, "data-bs-toggle", "modal");
        addAttribute(menuIcon, "data-bs-target", "#peer-item-menu");
        addAttribute(menuIcon, "style", "font-size:1.5rem;font-weight:bolder;");
        addAttribute(menuIcon, "id", `${item.rmtId}`);

        // Controls
        addAttribute(divControls, "class", "row");
        addAttribute(
          videoIcon,
          "class",
          "bi bi-webcam-fill fs-5 col auto px-2 call"
        );
        addAttribute(videoIcon, "id", `${item.rmtId}`);
        addAttribute(
          phoneIcon,
          "class",
          "bi bi-telephone-fill fs-5 col auto px-2 call"
        );
        addAttribute(phoneIcon, "id", `${item.rmtId}`);

        // Click Handlers
        addHandler(blockUserCheckbox, "change", (e) => {
          const blockee = e.target.id;
          const blocker = rmtId;
          const isChecked = e.target.checked;
          removeChildren(dynamicUserActions);

          dlog(`Check box value: ${isChecked}`);

          if (isChecked) {
            addUserToBlockedList({ blocker, blockee });
          } else {
            removeUserFromBlockedList({ blocker, blockee });
          }
        });

        // Accordion Header
        if (item.showFullName) {
          accordionHeaderPara.innerHTML = `<b>${cap(item.fname)}</b>`;
          paraPeerName.innerHTML = `<b>${cap(item.fname)} ${cap(
            item.lname
          )}</b>`;
        } else {
          addClickHandler(menuIcon, (e) => {
            const id = e.target.id;
            if (userIsBlocked(rmtId, item.blockedUsers)) {
              blockUserCheckbox.checked = true;
              dlog(`${rmtId} is blocked by ${item.rmtId}`);
            }
          });
        }

        // if (item.rmtId != rmtId) {
        if (item.hasCamera) {
          appendChild(divControls, videoIcon);
          appendChild(divControls, phoneIcon);

          addClickHandler(videoIcon, (e) => {
            console.log(`\n\tRequesting video chat\n`);
            const data = {
              sender: personalCode,
              receiver: e.target.id,
              requestType: chatType.VIDEO_CHAT,
            };
            requestChat(data);
          });

          addClickHandler(phoneIcon, (e) => {
            const data = {
              sender: personalCode,
              receiver: e.target.id,
              requestType: chatType.VOICE_CHAT,
            };
            requestChat(data);
          });
        } else {
          appendChild(divControls);
          appendChild(divControls, phoneIcon);

          addClickHandler(phoneIcon, (e) => {
            const data = {
              sender: personalCode,
              receiver: e.target.id,
              requestType: chatType.TEXT_CHAT,
            };
            requestChat(data);
          });
        }
      }
    });
  }
};

export const createChatRequestCallout = (
  userDetails,
  handleChatAccept,
  handleChatReject,
  handleChatRequestNoResponse
) => {
  const { sender, requestType } = userDetails;
  const messageCallout = newElement("div");
  const messageBody = newElement("div");
  const controlsDiv = newElement("div");
  const acceptButtonParent = newElement("div");
  const rejectButtonParent = newElement("div");
  const messageHeader = newElement("h5");
  const message = newElement("p");
  const closeButton = newElement("button");
  const rejectButton = newElement("button");
  const acceptButton = newElement("button");
  const span = newElement("span");

  // Attributes
  addAttribute(
    messageCallout,
    "class",
    "alert alert-info alert-dismissable fade show"
  );
  // addAttribute(messageCallout, "data-closable", "");
  addAttribute(closeButton, "class", "btn-close close-button");
  addAttribute(closeButton, "data-bs-dismiss", "alert");
  addAttribute(closeButton, "type", "button");
  addAttribute(closeButton, "aria-label", "Close");
  addAttribute(span, "aria-hidden", "true");
  addAttribute(controlsDiv, "class", "row");
  addAttribute(acceptButtonParent, "class", "col auto");
  addAttribute(rejectButtonParent, "class", "col auto");
  addAttribute(rejectButton, "class", "btn btn-danger");
  addAttribute(acceptButton, "class", "btn btn-success");
  // addAttribute(rejectButton, "style", "width:45%; margin-right:5px;");
  // addAttribute(acceptButton, "style", "width:45%;margin-left:5px;");
  addAttribute(message, "style", "font-size:1.5rem;font-weight:bolder;");

  // Inner HTML
  rejectButton.innerHTML = "Reject";
  acceptButton.innerHTML = "Accept";
  span.innerHTML = `&times;`;
  message.innerHTML = `${cap(sender.fname)} ${cap(
    sender.lname
  )} wants to ${requestType} with you`;

  // Append elements
  appendChild(messageCallout, message);
  appendChild(messageCallout, controlsDiv);
  appendChild(controlsDiv, rejectButtonParent);
  appendChild(controlsDiv, acceptButtonParent);
  appendChild(rejectButtonParent, rejectButton);
  appendChild(acceptButtonParent, acceptButton);
  appendChild(messageCallout, closeButton);
  appendChild(closeButton, span);

  // Register click event
  addClickHandler(closeButton, (e) => {
    messageCallout.remove();
    handleChatRequestNoResponse();
  });
  addClickHandler(rejectButton, handleChatReject);
  addClickHandler(acceptButton, handleChatAccept);

  return messageCallout;
};

export const chatRequestStatus = (data) => {
  const { receiver } = data;
  const callout = newElement("div");
  const h5 = newElement("h5");
  const closeButton = newElement("button");
  const span = newElement("span");

  // Add Attributes
  addAttribute(callout, "class", "alert alert-info small");
  // addAttribute(callout, "data-closable", "");
  addAttribute(closeButton, "class", "btn-close close-button");
  addAttribute(closeButton, "data-bs-dismiss", "alert");
  addAttribute(closeButton, "type", "button");
  addAttribute(closeButton, "aria-label", "Close");
  addAttribute(span, "aria-hidden", "true");

  // innerHTML
  h5.innerHTML = `<b>Calling ${cap(receiver.fname)} ${cap(receiver.lname)}</b>`;
  span.innerHTML = `&times;`;

  // Append elements
  appendChild(callout, h5);
  appendChild(callout, closeButton);
  appendChild(closeButton, span);

  // Register click event
  addClickHandler(closeButton, (e) => callout.remove());

  return callout;
};

export const handleChatRequestResponse = (data) => {
  const { response, receiver } = data;
  const callout = newElement("div");
  const h5 = newElement("h5");
  const closeButton = newElement("button");
  const span = newElement("span");
  let responseMessage;

  // Add Attributes
  addAttribute(callout, "class", "alert alert-info small");
  addAttribute(callout, "data-closable", "");
  addAttribute(closeButton, "class", "btn-close close-button");
  addAttribute(closeButton, "data-bs-dismiss", "alert");
  addAttribute(closeButton, "type", "button");
  addAttribute(closeButton, "aria-label", "Close");
  addAttribute(span, "aria-hidden", "true");

  switch (response.toLowerCase().trim()) {
    case "rejected":
      responseMessage = `${receiver.fname} rejected your call`;
      break;

    default:
      responseMessage = `${receiver.fname} is not available at this time`;
  }

  // innerHTML
  h5.innerHTML = `<b>${responseMessage}</b>`;
  span.innerHTML = `&times;`;

  // Append elements
  appendChild(callout, h5);
  appendChild(callout, closeButton);
  appendChild(closeButton, span);

  // Register click event
  addClickHandler(closeButton, (e) => callout.remove());

  return callout;
};

// Helpers
