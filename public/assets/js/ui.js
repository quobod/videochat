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
} from "./computils.js";

export const updateUsersList = async (userList, eventHandler) => {
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
      addClickHandler(item, eventHandler);
    }
  }
};
