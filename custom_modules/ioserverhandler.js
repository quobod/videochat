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
      const { uid } = data;
      log(`User with ID: ${uid} was clicked`);

      const user = userManager.getUser(uid);

      if (user) {
        io.to(socket.id).emit("clickeduser", { strUser: stringify(user) });
      }
    });

    socket.on("connectionrequest", (data) => {
      const { sender, receiver } = data;
      log(`User ${sender} is request a connection with user ${receiver}`);
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
