import asyncHandler from "express-async-handler";
import bunyan from "bunyan";
import { body, check, validationResult } from "express-validator";
import twilio from "twilio";
import { customAlphabet } from "nanoid";
import Chat from "../../models/ChatProfile.js";
import {
  cap,
  stringify,
  dlog,
  tlog,
  log,
  size,
} from "../../custom_modules/index.js";

const logger = bunyan.createLogger({ name: "Chat Controller" });
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 13);
const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
let nameOfRoom, token;

const findOrCreateRoom = async (roomName) => {
  let twilioClient;

  try {
    twilioClient = twilio(process.env.API_KEY, process.env.APP_SECRET, {
      accountSid: process.env.ACCT_SID,
    });
    // see if the room exists already. If it doesn't, this will throw
    // error 20404.
    await twilioClient.video.rooms(roomName).fetch();
  } catch (error) {
    // the room was not found, so create it
    if (error.code == 20404) {
      await twilioClient.video.rooms.create({
        uniqueName: roomName,
        type: "go",
      });
    } else {
      // let other errors bubble up
      throw error;
    }
  }
};

const getAccessToken = (roomName) => {
  // create an access token
  const token = new AccessToken(
    process.env.ACCT_SID,
    process.env.API_KEY,
    process.env.APP_SECRET,
    // generate a random unique identity for this participant
    { identity: nanoid() }
  );
  // create a video grant for this specific room
  const videoGrant = new VideoGrant({
    room: roomName,
  });

  // add the video grant
  token.addGrant(videoGrant);
  // serialize the token and return it
  return token.toJwt();
};

//  @desc           Create room and token
//  @route          POST /user/room/create
//  @access         Private
export const createRoomToken = asyncHandler(async (req, res) => {
  logger.info(`POST: /user/room/create`);
  const user = req.user.withoutPassword();

  const { chatType, roomName } = req.body;

  dlog(
    `Creating room token\n\t\tChat Type: ${chatType} Room Name: ${roomName}`
  );

  try {
    // find or create a room with the given roomName
    findOrCreateRoom(roomName);
    nameOfRoom = roomName;

    // generate an Access Token for a participant in this room
    token = getAccessToken(roomName);

    if (token) {
      dlog(`Created Token`);
      return res.json({ token: token, status: true, chatType: chatType });
    } else {
      dlog(`Token Failure`);
      return res.json({ status: false, cause: `Failed to create token` });
    }
  } catch (err) {
    dlog(`joinRoom error\n\t\t${stringify(err)}`);
    return res.json({
      status: false,
      cause: `Server Error`,
      detail: `user controller.createRoom method.`,
      err,
    });
  }
});

//  @desc           Video Chat
//  @route          GET /user/room/join
//  @access         Private
export const joinAsPeer = asyncHandler(async (req, res) => {
  logger.info(`GET: /user/room/join`);
  const user = req.user.withoutPassword();

  const { roomName, chatType } = req.query;

  dlog(`Joining room data: ${stringify(req.query)}`);

  const accessToken = getAccessToken(roomName);

  if (accessToken) {
    dlog(`Joining ${roomName} with token`);
    let videoChat;

    switch (chatType.toLowerCase().trim()) {
      case "video_chat":
        videoChat = true;
        break;

      default:
        videoChat = false;
    }

    res.render("user/_room", {
      hasToken: token ? true : false,
      token: `${accessToken}`,
      roomName: nameOfRoom,
      videoChat: videoChat,
      chatType: `${chatType.toLowerCase()}`,
      user: user,
      rmtId: user._id,
      room: true,
    });
  }
});

//  @desc           Chat Room
//  @route          GET /chat/room
//  @access         Private
export const enterRoom = asyncHandler(async (req, res) => {
  logger.info(`GET: /chat/room`);

  try {
    dlog(`${req.user.fname} entered chat room`);

    res.render("chat/room", {
      title: "Room",
      uid: req.user.withoutPassword()._id,
      enteredroom: true,
      signedin: true,
    });
  } catch (err) {
    tlog(err);
    res.status(200).json({ status: JSON.stringify(err) });
  }
});

//  @desc           Blocked Users
//  @route          POST /user/get/blockedlist
//  @access         Private
export const getBlockedList = asyncHandler(async (req, res) => {
  logger.info(`POST: /user/get/blockedlist/<parameter>`);

  const { blocker } = req.params;
  const { blockee } = req.body;

  dlog(`Blocker ${blocker}\nBockee ${blockee}`);

  // res.json({ status: true, blocker });

  User.findById(blocker, (err, doc) => {
    if (err) {
      return res.json({ status: false, cause: err });
    }
    return res.json({
      status: true,
      blockedUsers: doc.blockedUsers,
      blocker,
      blockee,
    });
  });
});

//  @desc           Add user ID to blocked list
//  @route          POST /users/block/:contactId
//  @access         Private
export const blockUser = asyncHandler(async (req, res) => {
  logger.info(`POST: /user/block/contactId`);

  const { userId } = req.params;
  const { rmtId } = req.body;

  // dlog(`${rmtId} adding ${userId} to blocked list`);

  User.findByIdAndUpdate(rmtId, { $push: { blockedUsers: `${userId}` } })
    .then((doc) => {
      dlog(`${stringify(doc)}`);
      res.status(200).json({
        blocked: true,
        blockee: userId,
        blocker: rmtId,
        updatedList: doc.blockedUsers,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(200).json({ blocked: false, cause: err });
    });
});

//  @desc           Remove user ID from blocked list
//  @route          POST /users/unblock/:contactId
//  @access         Private
export const unblockUser = asyncHandler(async (req, res) => {
  logger.info(`POST: /user/unblock/contactId`);

  const { userId } = req.params;
  const { rmtId } = req.body;

  dlog(`${rmtId} removing ${userId} from blocked list`);

  User.findByIdAndUpdate(rmtId, { $pop: { blockedUsers: `${userId}` } })
    .then((doc) => {
      dlog(`${stringify(doc)}`);
      res.status(200).json({
        blocked: true,
        blockee: userId,
        blocker: rmtId,
        updatedList: doc.blockedUsers,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(200).json({ blocked: false, cause: err });
    });
});

//  @desc           Create user chat profile
//  @route          GET /chat/profile/create
//  @access         Private
export const createProfile = asyncHandler(async (req, res) => {
  logger.info(`GET: /chat/profle/create`);

  const { uid } = req.params;

  dlog(`Route Parameter: ${uid}\n`);

  Chat.findOne({ user: `${uid}` }, (err, doc) => {
    if (err) {
      console.log(`------------------------------------`);
      console.log(err);
      console.log(`------------------------------------\n`);
      res.json({ status: false });
    }

    if (!doc) {
      Chat.create({ user: `${uid}`, uname: `uname-${uid}` });
      res.json({ status: true, hasDoc: false, doc: stringify(doc) });
    } else {
      res.json({ status: true, hasDoc: true, doc: stringify(doc) });
    }
  }).populate("user");
});
