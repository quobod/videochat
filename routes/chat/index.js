import { Router } from "express";
import { signedIn } from "../../middleware/AuthMiddleware.js";
import {
  createProfile,
  createRoom,
  getRoomToken,
  enterRoom,
  connectRoom,
} from "../../controllers/chat/index.js";

const chat = Router();

chat.route("/profile/create/:uid").get(signedIn, createProfile);

chat.route("/room/create").post(signedIn, createRoom);

chat.route("/room/gettoken").post(signedIn, getRoomToken);

chat.route("/room/enter").get(signedIn, enterRoom);

chat.route("/room/connect").get(signedIn, connectRoom);

// chat.route("/block/:userId").post(blockUser);

// chat.route("/unblock/:userId").post(unblockUser);

// chat.route("/get/blockedlist/:blocker").post(signedIn, getBlockedList);

export default chat;
