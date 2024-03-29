import { Router } from "express";
import { signedIn } from "../../middleware/AuthMiddleware.js";
import {
  createProfile,
  viewProfile,
  createRoom,
  getRoomToken,
  enterRoom,
  connectRoom,
  updateProfile,
  blockUser,
  unblockUser,
} from "../../controllers/chat/index.js";

const chat = Router();

chat.route("/profile/create/:uid").get(signedIn, createProfile);

chat.route("/profile/view/:uid").get(signedIn, viewProfile);

chat.route("/profile/update").post(signedIn, updateProfile);

chat.route("/room/create").post(signedIn, createRoom);

chat.route("/room/gettoken").post(signedIn, getRoomToken);

chat.route("/room/enter").get(signedIn, enterRoom);

chat.route("/room/connect").get(signedIn, connectRoom);

chat.route("/block").post(signedIn, blockUser);

chat.route("/unblock").post(signedIn, unblockUser);

// chat.route("/get/blockedlist/:blocker").post(signedIn, getBlockedList);

export default chat;
