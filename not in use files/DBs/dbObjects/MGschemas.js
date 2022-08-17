const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ********************************    MATRIX LOGS       ********************************//

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

const matrixesData = new Schema(
  {
    matrixID: String,
    UserID: { type: String, required: true },
    matrixesData: [String],
    counter: { type: Number, default: 0 },
    innerLog: [innerLog],
  },
  {
    timestamps: true,
  }
);

//******************************** SIGNETURE PROCESS  *********************************************/
const SigningStat = new Schema(
  {
    storedDocUrl: String,
    signDocUrl: String,
    isSigned: Boolean,
  },
  {
    timestamps: true,
  }
);

const docsData = new Schema(
  {
    DocumentIssuedStatus: String,
    ValueDate: String,
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
    SigStat: SigningStat,
  },
  { timestamps: true }
);

// ************************************* users Schema ******************************** ////

const UserData = new Schema({
  CompenyName: String,
  CompanyUTR: String,
});

const users = new Schema(
  {
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Phone: String,
    Mail: { type: String, required: true },
    PlanKey: String,
    RegisterDate: String,
    HasedUserKey: String,
    Accountname: String,
    isAdmin: { type: Boolean },
    isAuthenticated: { type: Boolean, default: false },
    otherDetails: UserData,
  },
  { timestamps: true }
);

//********************************************* PLANS **************************************/
const matrixAI = new Schema({
  isMatrix: { type: Boolean, required: true },
});
const driveAI = new Schema({
  isDriveAI: { type: Boolean, required: true },
});

const clockAI = new Schema({
  isClockAi: { type: Boolean, required: true },
});

const signAI = new Schema({
  isSignAI: { type: Boolean, required: true },
});

const plans = new Schema(
  {
    planID: String,
    MatrixAI: matrixAI,
    DriveAI: driveAI,
    ClockAI: clockAI,
    SignAI: signAI,
    Mail: { type: String, required: true },
    PlanKey: String,
    RegisterDate: String,
    HasedUserKey: String,
    Accountname: String,
    isAuthenticated: { type: Boolean, default: false },
    otherDetails: UserData,
  },
  { timestamps: true }
);

// ******************************************* Keys and enteries ***********************************//
//
const enteri = new Schema(
  {
    MetaData: metaData,
    HashedUserID: { type: String },
  },
  { timestamps: true }
);

const keys = new Schema(
  {
    ProcessID: String,
    isAdmin: { type: Boolean, required: true },
    adminID: String,
    HashedUserKey: { type: String, required: true },
    HashedUserID: { type: String, required: true },
    LogedEntries: [enteri],
  },
  { timestamps: true }
);

//************************************** Config ^*************************************//
/*          FOR NEW USERS IN TRIELS AND SUB ADMIN USER FOR PAYED PLAN                 */
/*          VIA IF <USER PLAN> != TRIEL      */
const driver = new Schema({
  isDefault: { type: Boolean, default: false },
  DocumentID: Number,
  isFirst: Boolean,
});
const docDef = new Schema({
  isDefault: { type: Boolean, default: false },
  AccountKey: String,
  isFirst: Boolean,
});
const pMtx = new Schema({
  docLimit: { isLimited: Boolean, Amount: Number },

  sumLimit: { isLimited: Boolean, Amount: Number },
  taxDocs: Boolean,
  Refund: { isAllow: Boolean, isLimited: Boolean, Amount: Number },
  Discount: { isAllow: Boolean, isLimited: Boolean, Amount: Number },
  ObligoPass: { isAllow: Boolean },
  FlagedCastumers: { isAllow: Boolean },
});
const config = new Schema(
  {
    HashedUserID: { type: String, required: true },
    DefaultDriver: driver,
    DocumentDef: docDef,
    PremissionMtx: pMtx,
  },
  { timestamps: true }
);

// **********************************************************************************/

mongoose.model;
const DocData = mongoose.model("DocDataLog", docsData);
const MtxLog = mongoose.model("MtxLog", matrixesData);
const Users = mongoose.model("Users", users);
const Plans = mongoose.model("Plans", plans);
const Keys = mongoose.model("Plans", keys);
const Config = mongoose.model("Config", config);




module.exports.DocData = DocData;
module.exports.MtxLog = MtxLog;
module.exports.Users = Users;
module.exports.Plans = Plans;
module.exports.Keys = Keys;
module.exports.Config = Config;
