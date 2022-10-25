import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    uname: {
      type: String,
      default: "",
      unique: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    showFullName: {
      type: Boolean,
      default: true,
    },
    showEmail: {
      type: Boolean,
      default: false,
    },
    blockedUsers: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

chatSchema.methods.userIsBlocked = async function (uid) {
  this.blockedUsers.forEach((id) => {
    if (id == uid) {
      return true;
    }
  });
};

chatSchema.methods.blockUser = function (uid) {
  const userIndex = this.blockedUsers.findIndex((x) => x == uid);

  if (userIndex == -1) {
    this.blockedUsers.push(uid);
  }
};

chatSchema.methods.unBlockUser = function (uid) {
  const userIndex = this.blockedUsers.findIndex((x) => x == uid);

  if (userIndex != -1) {
    this.blockedUsers = this.blockedUsers.filter((x) => x != uid);
  }
};

chatSchema.methods.createUsername = function (username) {
  try {
    this.uname = username;
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
