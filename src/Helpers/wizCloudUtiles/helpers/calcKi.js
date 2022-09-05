//const {mainMatrix, changesMatrix} = require('../../../mockData')
// {
//   Date: '2022-09-05T12:49:41.284Z',
//   matrixID: '126aattttt634',
//   martixName: '126aattttt634',
//   userID: '62fd0ceeedbc87baf3979757',
//   matrixesData: '{"mainMatrix":{"matrixID":"126aattttt634","ActionID":321,"AccountKey":["6259","6304"],"DocumentID":[1,1],"DriverID":["6259","62594"],"ActionAutho":["Default","Default"],"itemsHeaders":["HI250SA","HI250SA","BB100SA","XP100SA"],"cellsData":[[0,2,4,6],[3,5,1,7]]},"changesMatrix":{"matrixConfig":null,"matrixGlobalData":null,"cellsData":[[null,{"DiscountPrc":3},null,null],[null,null,null,null]],"docData":[{"Remarks":"לתשלום עד ה 3.4.23","Address":"מנחם בגין 169"},{"Details":"בדיקה ל DETAILES"}],"metaData":[{"Details":"לקוח לא משלם במסירה"},null]}}',
//   counter: 0,
//   _id: '6315f0653ae43a29edc09c46',
//   innerLog: [],
//   createdAt: '2022-09-05T12:49:41.535Z',
//   updatedAt: '2022-09-05T12:49:41.535Z',
//   __v: 0
// }
const constructMatrixToDbObj = async ({ matrixesData }, userID, martixName) => {
  console.log(
    "&&&&&&&&&&&&&&&&&& matrixes data in constructor &&&&&&&&&&&&&&&&&&&&\n",
    matrixesData.mainMatrix
  );

  return {
    Date: new Date(),
    matrixID: matrixesData.mainMatrix.matrixID,
    martixName: martixName ? martixName : matrixesData.mainMatrix.matrixID,
    userID: userID,
    matrixesData: matrixesData,
  };
};

const constractRows = async (mainMatrix, changesMatrix) => {
  console.log(`################ main matrix %%%%%%%%%%%%%%%%% \n ${mainMatrix}
################ changes matrix %%%%%%%%%%%%%%%%% \n ${changesMatrix}

`);
  const changesCellsData = changesMatrix.cellsData;
  const changesMetaData = changesMatrix.metaData;
  const changesDocData = changesMatrix.docData;
  let constractedDocumentRows = [];
  let constructedOuterScopeData = [];
  let changesData = {};
  let row = {};
  let move = [];

  mainMatrix.AccountKey.forEach((client, clientIndex) => {
    let currentMetaData = changesMetaData[clientIndex];
    let currentDocData = changesDocData[clientIndex];
    if (mainMatrix.ActionAutho[clientIndex]) {
      // outer scope data construction
      changesData["metaData"] = currentMetaData ? currentMetaData : null;
      changesData["rout"] = mainMatrix.DriverID[clientIndex];

      // in document data construction
      row["AccountKey"] = client;
      row["DocumentID"] = mainMatrix.DocumentID[clientIndex];
      currentDocData &&
        Object.keys(currentDocData).forEach((key) => {
          row[key] = currentDocData[key];
        });

      mainMatrix.itemsHeaders.forEach((item, itemIndex) => {
        let currentChangesCellData = changesCellsData[clientIndex][itemIndex];

        if (mainMatrix.cellsData[clientIndex][itemIndex] > 0) {
          move.push({
            itemKey: item,
            Quantity: mainMatrix.cellsData[clientIndex][itemIndex],
          });

          if (currentChangesCellData != null) {
            Object.keys(currentChangesCellData).forEach((addedValue) => {
              move[move.length - 1][addedValue] =
                currentChangesCellData[addedValue];
            });
          }
        }
      });
      constractedDocumentRows.push(row);
      constractedDocumentRows[clientIndex].moves = move;
      constructedOuterScopeData.push(changesData);
      move = [];
      row = {};
      changesData = {};
    }
  });
  console.log(
    `******* in function ********* \n ***** doc Data ***** \n ${JSON.stringify(
      constractedDocumentRows
    )} \n ***** outer Data ***** \n ${JSON.stringify(
      constructedOuterScopeData
    )}`
  );
  return [constractedDocumentRows, constructedOuterScopeData];
};

const matrixObjectConstructor = async (docData, outerData, matrixesData) => {
  const mainMatrixObject = {
    matrixID: matrixesData.mainMatrix.matrixID,
    ActionID: matrixesData.mainMatrix.ActionID,
    matrixConfig: matrixesData.changesMatrix.matrixConfig,
    matrixGlobalData: matrixesData.changesMatrix.matrixGlobalData, //
    ActionAutho: ["Default", "Default"],
    data: {
      docData: docData,
      outerData: outerData,
    },
  };
  return mainMatrixObject;
};

const prererMatixesData = async ({ matrixesData }) => {
  console.log("**************** prepere matrixes data ***************");
  console.log(
    "**************** matrixes data ***************\n ",
    matrixesData
  );
  let [docData, outerData] = await constractRows(
    matrixesData.mainMatrix,
    matrixesData.changesMatrix
  );
  console.log(
    `************* doc Data ************** \n ${docData} \n *************** outer Data *************** \n ${outerData}`
  );
  let mainObj;
  try {
    mainObj = await matrixObjectConstructor(docData, outerData, matrixesData);
    console.log(
      "************** main Obj ****************\n",
      JSON.stringify(mainObj.data.docData, null, 2)
    );
  } catch (e) {
    console.log(e);
  }
  return mainObj;
};

module.exports.constructMatrixToDbObjB = constructMatrixToDbObj;
module.exports.prererMatixesData = prererMatixesData;
