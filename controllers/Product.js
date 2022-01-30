const { insert, list,getid,getProductByCategoryId, modify, remove } = require("../services/Product");
const httpStatus = require("http-status");
const redis = require("redis")

const client = redis.createClient(6379);

//check connect
client.on('connect', function () {
  console.log("Product Redis is ready");
});
// if error
client.on('error', (err) => {
  console.log(err);
});

const index = (req, res) => {
  try {
    if(client.connected){
      client.get('products', async (err, productdata) => {
        if (err) console.log(err)
        
        if (productdata) {
          const productsfromcache = JSON.parse(productdata);
          console.log('Products retrieved from the redis cache');
          return res.status(200).json(productsfromcache);
        }
        else{
          list().then((response)=>{
                const products = response;
                console.log(products)
                client.setex('products', 1400, JSON.stringify(products));
                console.log('Rediste yoktu apiden alındı sonra Redise kaydedildi.');
                return res.status(200).send(products);
              });
        }  
    });
    }else{
      list().then((response)=>{
            const products = response;
            console.log('Products retrieved from the API');
            return res.status(200).send(products);
          });
    }
} catch(err) {
    console.log(err)
    res.status(500).send({message: err.message});
}
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
      if(client.connected){
        client.del('products',function(err,res){})
      }
      res.status(httpStatus.CREATED).send(response);
    }).catch((e) => {res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      console.log(e)});   
};

const update = async  (req, res) => {
  if (!req.params?.id) return res.status(404).send(`No Product with this id: ${id}`);
  var image = null
  if(req.file!=undefined && req.file.path != undefined){
    image = req.file.path
  }else{
    image = null
  }
  modify(req.params.id,req.body,image).then(response=>{
    if(client.connected){
      client.del('products',function(err,res){})
    }
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
      if(client.connected){
        client.del('products',function(err,res){})
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
