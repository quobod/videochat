import { parse, stringify } from "./utils.js";
import { log, dlog } from "./clientutils.js";
import {
  updateUsersList,
  showMessage,
  showCallAlert,
  showCallResponse,
} from "./ui.js";

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
      userDetails.receiver = e.target.id.trim().split("-")[1];
      userDetails.sender = document.querySelector("#rmtid-input").value;
      userDetails.conntype = e.target.dataset.connectiontype;

      dlog(
        `Sending connection request\t Sender: ${userDetails.sender} Receiver: ${userDetails.receiver}`
      );
      socket.emit("userclicked", userDetails);
    };
    updateUsersList(
      arrUsers,
      listItemClickHandler,
      detectWebcam,
      acceptCall,
      rejectCall
    );
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
    userDetails = {};
    userDetails.userInfo = user;
    userDetails.alertType = `alert-info`;

    showCallAlert(userDetails);
  });

  socket.on("connectionrequested", (data) => {
    const { strUserDetails } = data;
    userDetails = parse(strUserDetails);
    const callDialog = document.querySelector(
      `#callrequest-${userDetails.user._id}`
    );
    const callRequestTitle = document.querySelector(
      `#callrequesttitle-${userDetails.user._id}`
    );

    dlog(
      `${userDetails.user.fname} is requesting a ${userDetails.connectionType} connection with you`
    );

    if (callDialog) {
      callDialog.classList.add("hide");
      callRequestTitle.innerHTML = `${userDetails.user.fname} wants to connect`;
    } else {
      dlog(`No such element`);
      dlog(`#callrequest-${userDetails._id}`);
    }
  });

  socket.on("connectionrequestresponse", (data) => {
    const { responseData } = data;
    const userReponseData = parse(responseData);
    const { userInfo, response } = userReponseData;

    dlog(`User ${userInfo.fname} ${response} your request`);

    if (response == "accepted") {
      userReponseData.alertType = "alert-success";
      showCallResponse(userReponseData);
    } else if (response == "rejected") {
      userReponseData.alertType = "alert-warning";
      showCallResponse(userReponseData);
    } else {
      dlog(`No response`);
    }
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

function acceptCall(senderUid, receiverUid) {
  dlog(`You accepted ${senderUid}'s connection request`);
  userDetails = {};
  userDetails.sender = senderUid;
  userDetails.receiver = receiverUid;
  socketIO.emit("callaccepted", userDetails);
}

function rejectCall(senderUid, receiverUid) {
  dlog(`You rejected ${senderUid}'s connection request`);
  userDetails = {};
  userDetails.sender = senderUid;
  userDetails.receiver = receiverUid;
  socketIO.emit("callrejected", userDetails);
}
