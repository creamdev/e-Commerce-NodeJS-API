const { insert, list,getid, modify, remove } = require("../services/Order");
const httpStatus = require("http-status");

const index = (req, res) => {
  list()
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    }).catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const idList =(req,res)=>{
  getid(req.params.id)
  .then((response)=>{
    res.status(httpStatus.OK).send(response)
  }).catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
}

const create = (req, res) => {
    req.body.user_id = req.user._id;
     insert(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
     }).catch((e) => {res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);});
    
};

const update = (req, res) => {
  console.log(req.params.id);
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "Id information is missing",
    });
  }
  modify(req.body, req.params.id)
    .then((updatedProject) => {
      res.status(httpStatus.OK).send(updatedProject);
    })
    .catch((e) =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "There was a problem during updating" })
    );
};

const _delete = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "Id information is missing",
    });
  }
  remove(req.params.id)
    .then((deletedProject) => {
      console.log(deletedProject);
      if (!deleteProject) {
        res.status(httpStatus.NOT_FOUND).send({
          message: "Category not found",
        });
      }
      res.status(httpStatus.OK).send({
        message: "Category deleted successfully",
      });
    })
    .catch((e) =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "There was a problem during deleting" })
    );
};

module.exports = {
  create,
  index,
  idList,
  update,
  _delete
  
};
