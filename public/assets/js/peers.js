import { stringify, parse } from "./utils.js";
import {
  getAttribute,
  log,
  hasCam,
  dlog,
  cap,
  cls,
  tlog,
} from "./clientutils.js";
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
// import { Twilio } from "../../../node_modules/twilio-video/dist/twilio-video";

const rmtId = getElement("rmtid-input").value;
const roomName = getElement("roomname-input").value;
const connType = getElement("connectiontype-input").value;
const senderId = getElement("senderid-input").value;
const brand = getElement("navbar-brand");
const token = getElement("token-input").value;

const initRoom = async () => {
  if (rmtId == senderId) {
    brand.innerHTML = `Room ID: ${roomName}`;
    let room = null;

    if (Twilio) {
      try {
        if (connType.trim().toLowerCase() === "video") {
          room = await Twilio.Video.connect(token, {
            room: roomName,
            audio: { name: "microphone" },
            video: { name: "camera" },
            networkQuality: {
              local: 3, // LocalParticipant's Network Quality verbosity [1 - 3]
              remote: 3, // RemoteParticipants' Network Quality verbosity [0 - 3]
            },
          });
        } else {
          room = await Twilio.Video.connect(token, {
            room: roomName,
            audio: { name: "microphone" },
            video: false,
            networkQuality: {
              local: 3, // LocalParticipant's Network Quality verbosity [1 - 3]
              remote: 3, // RemoteParticipants' Network Quality verbosity [0 - 3]
            },
          });
        }
      } catch (err) {
        dlog(err);
        return null;
      }
    } else {
      dlog(`No Twilio`);
    }

    return room;
  }
};

const connectedPeers = initRoom();

if (null != connectedPeers) {
  connectedPeers
    .then((room) => {
      log(room);

      // Handle local participant
      // Handle each remote participant
      // Handle remote participant connect event
      // Handle all participants disconnected event
      // Handle disconnection with page events
    })
    .catch((err) => {
      log(`\n\ninitRoom method caused an error`);
      tlog(err);
      log(`\n\n`);
      return;
    });
} else {
  log(`connected peers is null`);
}
