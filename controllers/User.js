const {insert,list,loginUser,modify,remove,} = require("../services/User");
const httpStatus = require("http-status");
const uuid = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter");
const path = require("path");

const {
  passwordToHash,
  generateAccessToken,
  generateRefreshToken,
} = require("../scripts/utils/helper");

const create = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  insert(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => {
      console.log(e)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const login = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  loginUser(req.body)
    .then((user) => {
      if (!user)
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: "User not found." });

      user = {
        ...user.toObject(),
        tokens: {
          access_token: generateAccessToken(user),
          refresh_roken: generateRefreshToken(user),
        },
      };
      delete user.password;
      res.status(httpStatus.OK).send(user);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const index = (req, res) => {
  list()
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};



const resetPassword = (req, res) => {
  const new_password =
    uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`;
  modify({ email: req.body.email }, { password: passwordToHash(new_password) })
    .then((updateUser) => {
      if (!updateUser)
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ error: "There is no user." });
      eventEmitter.emit("send_email", {
        to: updateUser.email,
        subject: "Reset Password",
        html: `Your password has been reset <br/> Do not forget to change your password after logging in. <br/> Your new password: <b>${new_password}</b> `,
      });
      res.status(httpStatus.OK).send({
        message:
          "We have sent the information required for the password reset process to your e-mail address.",
      });
    })
    .catch(() =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "There was an problem during the reset password," })
    );
};

const update = (req, res) => {
  modify({ _id: req.user?._id }, req.body)
    .then((updateUser) => {
      res.status(httpStatus.OK).send(updateUser);
    })
    .catch(() =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "A problem occurred during the update process" })
    );
};

const deleteUser = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "Id information is missing",
    });
  }
  remove(req.params.id)
    .then((deletedUser) => {
      console.log(deletedUser);
      if (!deleteUser) {
        res.status(httpStatus.NOT_FOUND).send({
          message: "User not found",
        });
      }
      res.status(httpStatus.OK).send({
        message: "User deleted successfully",
      });
    })
    .catch((e) =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "There was a problem during deleting" })
    );
};

const changePassword = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  modify({ _id: req.user?._id }, req.body)
    .then((updateUser) => {
      res.status(httpStatus.OK).send(updateUser);
    })
    .catch(() =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "A problem occurred during the update process" })
    );
};

const updateProfileImage = (req, res) => {
  console.log(req.files);

  // File Control
  if (!req?.files?.profile_image) {
    return res.status(httpStatus.BAD_REQUEST).send({
      error: "You do not have enough data to perform this operation.",
    });
  }
  const extension = path.extname(req.files.profile_image.name);

  const fileName = `${req?.user?._id}${extension}`;

  // Upload File
  const folderPath = path.join(__dirname, "../", "uploads/users", fileName);
  req.files.profile_image.mv(folderPath, function (err) {
    if (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        error: err,
      });
    }
    modify({ _id: req.user?._id }, { profile_image: fileName })
      .then((updateUser) => {
        res.status(httpStatus.OK).send(updateUser);
      })
      .catch((e) =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({
            error:
              "The installation was successful but there was a problem during the update",
          })
      );
  });
};

module.exports = {
  create,
  index,
  login,
  resetPassword,
  update,
  deleteUser,
  changePassword,
  updateProfileImage
};
