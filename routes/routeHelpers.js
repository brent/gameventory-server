"use strict";

const handleResponse = function(res, data) {
  res.status(200).json(data);
};

const errorHandler = function(err, req, res, next) {
  console.log(err);
  const status = err.statusCode || 500;
  res.status(status).send({
    'error': err,
  });
}

module.exports = {
  handleResponse,
  errorHandler,
};
