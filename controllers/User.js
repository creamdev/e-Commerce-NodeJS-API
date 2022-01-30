const {insert,list,loginUser,modify,remove,newPassword} = require("../services/User");
const httpStatus = require("http-status");
const uuid = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter");
const path = require("path");
const redis = require("redis")

const client = redis.createClient(6379);

//check connect
client.on('connect', function () {
  console.log("Users Redis is ready");
});
// if error
client.on('error', (err) => {
  console.log(err);
});

const {
  passwordToHash,
  generateAccessToken,
  generateRefreshToken,
} = require("../scripts/utils/helper");

const create = (req, res) => {
  try{
    req.body.password = passwordToHash(req.body.password);
    insert(req.body).then((response)=>{
      if(client.connected){
        client.del('users',function(err,res){})
      }
      res.status(httpStatus.CREATED).send(response);
    })
  }catch{
    console.log(err)
    res.status(500).send({message: err.message});
  }


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
  try {
    if(client.connected){
      client.get('users', async (err, usersdata) => {
        if (err) console.log(err)
        
        if (usersdata) {
          const usersfromcache = JSON.parse(usersdata);
          console.log('Users retrieved from the redis cache');
          return res.status(200).json(usersfromcache);
        }
        else{
          list().then((response)=>{
                const users = response;
                console.log(users)
                client.setex('users', 1400, JSON.stringify(users));
                console.log('Rediste yoktu apiden alındı sonra Redise kaydedildi.');
                return res.status(200).send(users);
              });
        }  
    });
    }else{
      list().then((response)=>{
            const users = response;
            console.log('Users retrieved from the API');
            return res.status(200).send(users);
          });
    }
} catch(err) {
    console.log(err)
    res.status(500).send({message: err.message});
}
};

const resetPassword = (req, res) => {
  const new_password =
    uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`;
  modify({ email: req.body.email })
    .then((updateUser) => {
      if (!updateUser)
        return res.status(httpStatus.NOT_FOUND).send({ error: "There is no user." });
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
      if(client.connected){
        client.del('users',function(err,res){})
      }
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
      if (!deletedUser) {
        res.status(httpStatus.NOT_FOUND).send({
          message: "User not found",
        });
      }
      if(client.connected){
        client.del('users',function(err,res){})
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
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "A problem occurred during the update process" })
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

const _newPassword =async (req,res)=>{
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "Id information is missing",
    });
  }
  if (!req.params?.token) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "Token information is missing",
    });
  }
  req.body.password = passwordToHash(req.body.password);
  newPassword(req.params?.id,req.params?.token,req.body.password).then((response)=>{
    if(response.statusCode==400){
      res.status(httpStatus.BAD_REQUEST).send(response.message);
    }
    else{
      res.status(httpStatus.OK).send(response.message);
    }
  }).catch((e)=>{
    console.log(e)
    res.send("An error occured");
  })
}




module.exports = {
  create,
  index,
  login,
  resetPassword,
  update,
  deleteUser,
  changePassword,
  updateProfileImage,
  _newPassword
};
