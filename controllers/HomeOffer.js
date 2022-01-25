const { insert, list, remove } = require("../services/HomeOffer");
const httpStatus = require("http-status");
const { v4: uuidv4} = require('uuid');

const index = (req, res) => {
  list()
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    }).catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const create = (req, res) => {
  insert(req.file.path)
  .then((response) => {
    res.status(httpStatus.CREATED).send(response);
  }).catch((e) => {res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    console.log(e)});   
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
  _delete

};
