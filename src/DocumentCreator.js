////////////////////////////////////////////////////////////basic required code
//Must to configure private data on apiConfig.js file
const wizlib = require("wizcloud-api");
const getCredential = require('./getCred')
var fs = require("fs");



async function createDoc(stock, docID, privetKey, index) {
  console.log(`creat do start don num"${index}" data:\n ${JSON.stringify(stock)}`);
  const [
    usserDbname,
    usserServerName,
    usserPrivetKey
  ] = await getCredential.getCastumersCred("1111")

  console.log(`usser db name++\n ${usserDbname} usser server name ++\n ${usserServerName} usser privet key ++\n ${usserPrivetKey}`)

  let myDBname = usserDbname;
  try {
    wizlib.init(usserPrivetKey, usserServerName);
  } catch (e) {
    console.log(e);

  }

  console.log(stock);
  var doc = {
    DocumentID: docID,
    AccountKey: stock.AccountKey,
    moves: stock.moves,
  };
  // console.log("stock.moves" + JSON.stringify(stock.moves));
  let apiRes = await wizlib.createDocument(myDBname, {
    rows: doc,
    issueStock: true,
    deleteTemp: false,
  });
  console.log(apiRes);

  // fs.writeFile("myApiRes.txt", JSON.stringify(apiRes), (err) => {
  //   if (err) throw err;
  //   console.log("See resaults in myApiRes.txt");
 // }
 // );
 return JSON.parse(apiRes)
}




async function issueDoc() {
  let apiRes = await wizlib.issueDoc(myDBname, {
    stockID: 744
  });
  console.log(apiRes);
}
async function delDocument() {
  let apiRes = await wizlib.delDocument(myDBname, {
    stockID: 768
  });
  console.log(apiRes);
}
async function showDocument() {
  let apiRes = await wizlib.showDocument(myDBname, {
    DocumentID: "1",
    stockID: 67,
  });
  console.log(apiRes);
}

module.exports.createDoc = createDoc;
module.exports.delDocument = delDocument;
module.exports.showDocument = showDocument;