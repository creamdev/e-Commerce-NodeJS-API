const { search } = require('../services/Search')
const httpStatus = require("http-status");

const searchProduct = (req, res) => {
    search(req.params.name)
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      }).catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  };

  module.exports = {searchProduct}