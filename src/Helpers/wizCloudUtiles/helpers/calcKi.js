//const constructMatrixToDbObj = async ({ matrixesData }, userID) => {
//   console.log(
//     "&&&&&&&&&&&&&&&&&& matrixes data in constructor &&&&&&&&&&&&&&&&&&&&\n",
//     matrixesData.mainMatrix
//   );

//   return {
//     Date: new Date().toLocaleString('en', { timeZone: "Asia/Jerusalem" }),
//     matrixID: matrixesData.mainMatrix.matrixID,
//     martixName: matrixesData.mainMatrix?.martixName ? matrixesData.mainMatrix.martixName : matrixesData.mainMatrix.matrixID,
//     userID: userID,
//     matrixesData: matrixesData,
//   };
// };
const constructMatrixToDbObj = async (req) => {
  return await req;
};

const constractRows = async (mainMatrix, changesMatrix) => {
  //   console.log(`################ main matrix %%%%%%%%%%%%%%%%% \n ${JSON.stringify(mainMatrix)}
  // ################ changes matrix %%%%%%%%%%%%%%%%% \n ${JSON.stringify(changesMatrix)}
  //`);
  console.log("sasfasfasfasfasfafaasf ", mainMatrix.cellsData);
  try {
    const changesCellsData = changesMatrix.cellsData;
    const changesMetaData = changesMatrix.metaData;
    const changesDocData = changesMatrix.docData;
    let constractedDocumentRows = [];
    let constructedOuterScopeData = [];
    let changesData = {};
    let row = {};
    let move = [];

    mainMatrix.AccountKey.forEach((client, clientIndex) => {
      //  console.log("sssssssssssssss", { client, clientIndex });
      let currentMetaData = changesMetaData[clientIndex];
      let currentDocData = changesDocData[clientIndex];
      if (mainMatrix.ActionAutho[clientIndex]) {
        //  console.log({ currentDocData, currentMetaData });
        // outer scope data construction
        changesData["metaData"] = currentMetaData ? currentMetaData : null;
        changesData["rout"] = mainMatrix.DriverID[clientIndex];

        // in document data construction
        row["AccountKey"] = client;
        row["DocumentID"] = mainMatrix.DocumentID[clientIndex];

        console.log({ currentDocData });
        currentDocData &&
          Object.keys(currentDocData).forEach((key) => {
            row[key] = currentDocData[key];
          });
        console.log({ row });
        mainMatrix.itemsHeaders.forEach((item, itemIndex) => {
          let currentChangesCellData = changesCellsData[clientIndex][itemIndex];

          if (mainMatrix.cellsData[clientIndex][itemIndex] > 0) {
            move.push({
              itemKey: item,
              Quantity: mainMatrix.cellsData[clientIndex][itemIndex],
            });

            if (currentChangesCellData != null) {
              Object.keys(currentChangesCellData).forEach((addedValue) => {
                move[move.length - 1][addedValue] = currentChangesCellData[addedValue];
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
    // console.log(
    //   `******* in function ********* \n ***** doc Data ***** \n ${JSON.stringify(
    //     constractedDocumentRows
    //   )} \n ***** outer Data ***** \n ${JSON.stringify(constructedOuterScopeData)}`
    // );

    console.log({ constractedDocumentRows });
    return [constractedDocumentRows, constructedOuterScopeData];
  } catch (err) {
    console.log("error !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", err);
  }
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
  console.log("**************** matrixes data ***************\n ", matrixesData);
  let [docData, outerData] = await constractRows(matrixesData.mainMatrix, matrixesData.changesMatrix);
  console.log(
    `************* doc Data ************** \n ${docData} \n *************** outer Data *************** \n ${outerData}`
  );
  let mainObj;
  try {
    mainObj = await matrixObjectConstructor(docData, outerData, matrixesData);
    console.log("************** main Obj ****************\n", JSON.stringify(mainObj.data.docData, null, 2));
  } catch (e) {
    console.log(e);
  }
  return mainObj;
};

module.exports.constructMatrixToDbObjB = constructMatrixToDbObj;
module.exports.prererMatixesData = prererMatixesData;
