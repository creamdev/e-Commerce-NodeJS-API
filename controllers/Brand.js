const {insert ,list,getid,modify,remove}= require('../services/Brand');
const httpStatus = require("http-status")


const create = (req, res) => {
    insert(req.body,req.file.path)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    }).catch((e) => {res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      console.log(e)});
  
};
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

const update =async  (req, res) => {
  if (!req.params?.id) return res.status(404).send(`No Brand with this id: ${id}`);
  modify(req.params.id,req.body,req.file.path).then(response=>{
    res.json(response);
  });
}

const _delete = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "Id information is missing",
    });
  }
  remove(req.params.id)
    .then((deletedBrand) => {
      console.log(deletedBrand);
      if (!deletedBrand) {
        res.status(httpStatus.NOT_FOUND).send({
          message: "Brand not found",
        });
      }
      res.status(httpStatus.OK).send({
        message: "Brand deleted successfully",
      });
    })
    .catch((e) =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "There was a problem during deleting" })
    );
};

module.exports={create,index,idList,update,_delete}