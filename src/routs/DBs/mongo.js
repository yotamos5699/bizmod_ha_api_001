const express = require("express");
const MGrouter = express.Router();
const Helper = require("../../Helpers/generalUtils/Helper");
const mongoose = require("mongoose");
const { MtxLog, DocData } = require("./dbObjects/MGschemas");
const bodyParser = require("body-parser");
const uri =
  "mongodb+srv://yotamos:linux6926@cluster0.zj6wiy3.mongodb.net/mtxlog?retryWrites=true&w=majority";
const MGoptions = { useNewUrlParser: true, useUnifiedTopology: true };
MGrouter.use(express.json());
MGrouter.use(bodyParser.urlencoded({ extended: true }));
MGrouter.use(bodyParser.json());
mongoose
  .connect(uri, MGoptions)
  .then((res) => console.log("conected to mongo...."))
  .catch((e) => console.log(e));

// MGrouter.get("/api/geturls", async function (req, res) {
//   let fileName = "castumersInvoiceUrls";
//   console.log(req.headers);

//   let data = fs.readFileSync(
//     path.resolve(__dirname, `./${fileName}.json`),
//     (err) => {
//       if (err) throw err;
//       console.log(err, "See resaults in myApiRes.txt");
//     }
//   );
//   data = JSON.parse(data);
//   console.log(JSON.stringify(data.data));

//   res.send(JSON.stringify(data, null, 2)).end();
// });

MGrouter.post("/api/loadmatrixes", async (req, res) => {
  MtxLog.find()
    .then((result) => {
      console.log(result);
      res.send({ status: "yes", data: result });
    })
    .catch((e) => {
      console.log(e);
      res.send({ status: "no", data: e });
    });
});

MGrouter.post("/api/saveMatrix", async function (req, res) {
  let body = await req.body;
  const { matrixID, UserID, matrixesData } = body;
  
  let reqMtxData = new MtxLog({
    matrixID: JSON.stringify(matrixID),
    UserID: JSON.stringify(UserID),
    matrixesData: JSON.stringify(matrixesData),
  });

  console.log("costracted data ", reqMtxData);
  reqMtxData
    .save()
    .then((result) => {
      console.log(result);
      res.send({ status: "yes", data: result });
    })
    .catch((e) => {
      console.log(e);
      res.send({ status: "no", data: e });
    });
});

module.exports = MGrouter;
