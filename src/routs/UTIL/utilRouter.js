
const express = require("express");
const UTrouter = express.Router();
const getCred = require('../../Helpers/wizCloudUtiles/helpers/getCred')


UTrouter.get("/api/generatekey", (req, res) => {
    console.log(req.headers);
    let response = getCred.generateKey();
    res.end(JSON.stringify({  response }));
  });

  module.exports = UTrouter;
