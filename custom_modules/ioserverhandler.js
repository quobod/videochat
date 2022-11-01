import { customAlphabet } from "nanoid";
import { log, cls, stringify, parse } from "./index.js";
import User from "../models/UserModel.js";
import Chat from "../models/ChatProfile.js";
import UM from "./usermanager.js";

const userManager = new UM();
const connectedUsers = [];

export default (io) => {
  io.on("connection", (socket) => {
    log(`New client connection detected - ID: ${socket.id}`);

    socket.on("registerme", (data) => {
      const { uid } = data;
      const user = userManager.getUser(uid);
      addCUser(uid);

      if (!user) {
        User.findOne({ _id: `${uid}` }, (err, doc) => {
          if (err) {
            log(`-----------------------------------`);
            log(err);
            log(`-----------------------------------\n`);
            return;
          }

          if (doc) {
            const regUser = Object.assign({
              ...{
                fname: doc.fname,
                lname: doc.lname,
                email: doc.email,
                _id: doc._id,
                ...doc.member,
              },
              ...{ sid: socket.id },
            });

            const addedUser = userManager.addUser(regUser);

            if (addedUser) {
              log(`User ${regUser.fname} successfully registered`);
              io.to(socket.id).emit("registered", { uid: uid });
              io.emit("updateonlineuserlist", {
                users: stringify(userManager.getUsers()),
              });
            }
          }
        }).populate("member");
      }
    });

    socket.on("updateuser", (data) => {
      const { uid, doc, hasDoc } = data;

      const user = userManager.getUser(uid);

      if (user) {
        log(`Updating user ${user.fname}`);
        if (hasDoc) {
          const userDoc = parse(doc);

          user.uname = userDoc.uname;
          user.isVisible = userDoc.isVisible;
          user.showFullName = userDoc.showFullName;
          user.blockedUsers = userDoc.blockedUsers;

          io.emit("updateonlineuserlist", {
            users: stringify(userManager.getUsers()),
          });
        } else {
          Chat.findOne({ user: uid }, (err, chat) => {
            if (err) {
              log(`--------------------------------------`);
              log(err);
              log(`---------------------------------------\n`);
              return;
            } else {
              if (chat) {
                user.uname = chat.uname;
                user.isVisible = chat.isVisible;
                user.showFullName = chat.showFullName;
                user.blockedUsers = chat.blockedUsers;

                io.emit("updateonlineuserlist", {
                  users: stringify(userManager.getUsers()),
                });
              }
            }
          }).populate("user");
        }
      }
    });

    socket.on("userclicked", (data) => {
      const { sender, receiver, conntype } = data;
      log(`${sender} requesting connection with ${receiver}`);
      const userSender = userManager.getUser(sender);
      const userReceiver = userManager.getUser(receiver);
      const connectionType =
        conntype.trim().toLowerCase() == "webcam" ? "webcam" : "message";

      if (userSender && userReceiver) {
        log(
          `${userSender.fname} is requesting a connection ${conntype} with ${userReceiver.fname}`
        );
        io.to(userSender.sid).emit("clickeduser", {
          strUser: stringify(userReceiver),
        });

        const strUserDetails = stringify({ user: userSender, connectionType });

        io.to(userReceiver.sid).emit("connectionrequested", {
          strUserDetails,
        });
      }
    });

    socket.on("connectionrequest", (data) => {
      const { sender, receiver } = data;

      const userSender = userManager.getUser(sender);
      const userReceiver = userManager.getUser(receiver);
      const strUserSender = stringify({
        fname: userSender.fname,
        sid: userSender.sid,
      });

      if (userSender && userReceiver) {
        log(
          `${userSender.fname} is requesting a connection with ${userReceiver.fname}`
        );

        log(
          `Sender's SID: ${userSender.sid}\tReceiver's SID: ${userReceiver.sid}`
        );

        io.to(userReceiver.sid).emit("connectionrequested", {
          strSender: strUserSender,
        });
      }
    });

    socket.on("callaccepted", (data) => {
      const { sender, receiver } = data;
      const userSender = userManager.getUser(sender);
      const userReceiver = userManager.getUser(receiver);
      const roomName = randomNameGenerator();

      if (userSender && userReceiver) {
        log(
          `${userReceiver.fname} accepted ${userSender.fname}'s connection request`
        );

        const response = "accepted";
        const strSenderResponseData = stringify({
          userInfo: userReceiver,
          response,
          roomName,
        });

        io.to(userSender.sid).emit("connectionrequestresponse", {
          responseData: strSenderResponseData,
        });
      }
    });

    socket.on("callrejected", (data) => {
      const { sender, receiver } = data;
      const userSender = userManager.getUser(sender);
      const userReceiver = userManager.getUser(receiver);

      if (userSender && userReceiver) {
        log(
          `${userReceiver.fname} rejected ${userSender.fname}'s connection request`
        );

        const response = "rejected";
        const strResponseData = stringify({
          userInfo: userReceiver,
          response,
        });

        io.to(userSender.sid).emit("connectionrequestresponse", {
          responseData: strResponseData,
        });
      }
    });

    socket.on("disconnectme", (data) => {
      const { uid } = data;
      const removedUser = userManager.removeUser(uid);
      if (removedUser) {
        log(`User removed successfully: ${uid}`);
        io.emit("updateonlineuserlist", {
          users: stringify(userManager.getUsers()),
        });
      }
    });
  });
};

function addCUser(uid) {
  const index = connectedUsers.findIndex((x) => (x = uid));

  if (index == -1) {
    connectedUsers.push(uid);
  }
}

function randomNameGenerator() {
  const randomGenerator = customAlphabet("abcdefghijklmnopqrstuvwxyz", 13);
  return randomGenerator();
}
