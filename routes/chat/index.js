import { Router } from "express";
import { signedIn } from "../../middleware/AuthMiddleware.js";
import {
  enterRoom,
  createProfile,
  createRoomToken,
  joinAsPeer,
} from "../../controllers/chat/index.js";

const chat = Router();

chat.route("/room").get(signedIn, enterRoom);

chat.route("/profile/create/:uid").get(signedIn, createProfile);

chat.route("/room/create").post(signedIn, createRoomToken);

chat.route("/room/join").get(signedIn, joinAsPeer);

// chat.route("/block/:userId").post(blockUser);

// chat.route("/unblock/:userId").post(unblockUser);

// chat.route("/get/blockedlist/:blocker").post(signedIn, getBlockedList);

export default chat;
