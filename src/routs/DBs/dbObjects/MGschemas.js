const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// **************    MATRIX LOGS       ******************//

const innerLog = new Schema(
  {
    innerID: Schema.Types.ObjectId,
    timeStemp: { type: Date, default: Date.now },
    UserID: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
//docID: Schema.Types.ObjectId,
const matrixesData = new Schema(
  {
    matrixID: String,
    UserID: { type: String, required: true },
    matrixesData: [String],
    counter: { type: Number, default: 0 },
    innerLog: [innerLog ],
  },
  {
    timestamps: true,
  }
);

//*************** SIGNETURE PROCESS  *********************************************/

const docsData = new Schema(
  {
    DocumentIssuedStatus: String,
    DocumentDefID: Number,
    StockID: Number,
    DocNumber: Number,
    AccountKey: String,
    Accountname: String,
    TotalCost: Number,
    Address: String,
    DocumentDetails: String,
    DocUrl: String,
    Action: Number,
    isSigned: { type: Boolean, default: false },
  },
  { timestamps: true }
);
mongoose.model;
const DocData = mongoose.model("DocDataLog", docsData);
const MtxLog = mongoose.model("MtxLog", matrixesData);
module.exports.MtxLog = MtxLog;
module.exports.DocData = DocData;
