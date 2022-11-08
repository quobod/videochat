import { stringify, parse } from "./utils.js";
import { getAttribute, log, hasCam, dlog, cap, cls } from "./clientutils.js";
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

const rmtId = getElement("rmtid-input").value;
const roomName = getElement("roomname-input").value;
const connType = getElement("connectiontype-input").value;
const senderId = getElement("senderid-input").value;
const brand = getElement("navbar-brand");

if (rmtId == senderId) {
  brand.innerHTML = `Room ID: ${roomName}`;
}
