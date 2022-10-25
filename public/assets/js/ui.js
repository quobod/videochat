import { stringify, parse } from "./utils.js";
import { getAttribute, log, hasCam } from "./clientutils.js";
import {
  getElement,
  newElement,
  removeChildren,
  appendChild,
  addClickHandler,
  addHandler,
  addAttribute,
} from "./computils.js";

export const updateUsersList = async (userList) => {
  const listParent = document.querySelector("#users-parent");

  removeChildren(listParent);

  for (const u in userList) {
    const uObj = userList[u];
    const card = newElement("div");
    const cardBody = newElement("dvi");
    const cardTitle = newElement("h5");
    const item = newElement("li");

    // Set attributes
    addAttribute(card, "class", "card");
    addAttribute(card, "id", `card-${uObj._id}`);
    addAttribute(cardBody, "class", "card-body");
    addAttribute(cardTitle, "class", "card-title");
    addAttribute(item, "class", "list-group-item");

    // Append elements
    appendChild(listParent, item);
    appendChild(item, card);
    appendChild(card, cardBody);
    appendChild(cardBody, cardTitle);

    // Set text
    cardTitle.innerHTML = `<strong>${uObj.fname}</strong>`;
  }
};
