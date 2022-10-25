import { parse, stringify } from "./utils.js";
import { log, dlog } from "./clientutils.js";
import { updateUsersList, showMessage } from "./ui.js";

let socketIO = null,
  userDetails = {};

export const registerSocketEvents = (socket) => {
  socketIO = socket;

  socket.on("connect", () => {
    dlog(`\n\tSuccessfully connected to socket.io server\n`);
    userDetails = {};
    userDetails.uid = document.querySelector("#rmtid-input").value;
    socket.emit("registerme", userDetails);
  });

  socket.on("updateonlineuserlist", (data) => {
    const { users } = data;
    dlog(`Received updated user list`);

    const arrUsers = [];
    const pUsers = parse(users);

    for (const u in pUsers) {
      const user = pUsers[u];
      arrUsers.push({ ...user });
    }

    const listItemClickHandler = (e) => {
      dlog(`${e.target.id} was clicked`);
      userDetails = {};
      userDetails.uid = e.target.id.trim().split("-")[1];
      socket.emit("userclicked", userDetails);
    };

    updateUsersList(arrUsers, listItemClickHandler);
  });

  socket.on("registered", (data) => {
    const { uid } = data;
    dlog(`I am registered`);

    try {
      const xmlHttp = new XMLHttpRequest();

      xmlHttp.onload = () => {
        // location.href = `/chat/profile/create/${uid}`;

        const { status, doc, hasDoc } = parse(xmlHttp.responseText);

        if (status) {
          dlog(`chat profile created`);
          userDetails = {};
          userDetails.uid = document.querySelector("#rmtid-input").value;
          userDetails.doc = doc;
          userDetails.hasDoc = hasDoc;
          socket.emit("updateuser", userDetails);
        }
      };

      xmlHttp.open("GET", `/chat/profile/create/${uid}`);

      xmlHttp.send(true);
    } catch (err) {
      dlog(err);
      return;
    }
  });

  socket.on("clickeduser", (data) => {
    const { strUser } = data;
    const user = parse(strUser);

    detectWebcam(function (hasWebcam) {
      userDetails = {};
      userDetails.userInfo = user;
      userDetails.hasWebcam = hasWebcam;

      const iconClickHandler = (e) => {
        const uid = e.target.id.trim().split("-")[1];
        const rmtid = document.querySelector("#rmtid-input").value;
        dlog(`User ${rmtid} is requesting a connection with ${uid}`);
        userDetails = {};
        userDetails.sender = rmtid;
        userDetails.receiver = uid;

        socket.emit("connectionrequest", userDetails);
      };

      showMessage(userDetails, iconClickHandler);
    });
  });
};

addEventListener("beforeunload", (event) => {
  dlog(`\n\tBefore unload\n`);
  userDetails = {};
  userDetails.uid = document.querySelector("#rmtid-input").value;
  socketIO.emit("disconnectme", userDetails);
  return;
});

function detectWebcam(callback) {
  let md = navigator.mediaDevices;
  if (!md || !md.enumerateDevices) return callback(false);
  md.enumerateDevices().then((devices) => {
    callback(devices.some((device) => "videoinput" === device.kind));
  });
}
