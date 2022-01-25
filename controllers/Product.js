const { insert, list,getid,getProductByCategoryId, modify, remove } = require("../services/Product");
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
const getByCategoryId=(req,res)=>{
  getProductByCategoryId(req.params.id)
  .then((response)=>{
    res.status(httpStatus.OK).send(response)
  }).catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
}

const create = (req, res) => {
    insert(req.body,req.file.path)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    }).catch((e) => {res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      console.log(e)});   
};

// const update = (req, res) => {
//   if (!req.params?.id) {
//     return res.status(httpStatus.BAD_REQUEST).send({
//       message: "Id information is missing",
//     });
//   }
//   modify(req.body,req.file.path, req.params.id)
//     .then((updatedProduct) => {
//       res.status(httpStatus.OK).send(updatedProduct);
//     })
//     .catch((e) =>
//       res
//         .status(httpStatus.INTERNAL_SERVER_ERROR)
//         .send({ error: "There was a problem during updating" })
//     );
// };

const update = async  (req, res) => {
  if (!req.params?.id) return res.status(404).send(`No Product with this id: ${id}`);
  var image = null
  if(req.file!=undefined && req.file.path != undefined){
    image = req.file.path
  }else{
    image = null
  }
  modify(req.params.id,req.body,image).then(response=>{
    res.json(response);
  }).catch(error =>{
    console.log(error)
  });
}


const _delete = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "Id information is missing",
    });
  }
  remove(req.params.id)
    .then((deletedProduct) => {
      console.log(deletedProduct);
      if (!deletedProduct) {
        res.status(httpStatus.NOT_FOUND).send({
          message: "Product not found",
        });
      }
      res.status(httpStatus.OK).send({
        message: "Product deleted successfully",
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
  _delete,
  getByCategoryId
};
