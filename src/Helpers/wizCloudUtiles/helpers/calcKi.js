//const {mainMatrix, changesMatrix} = require('../../../mockData')

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

module.exports.prererMatixesData = prererMatixesData;

// const matrixes = [mainMatrix, changesMatrix]
// const trimData = [2, 4]
// //SS

// async function returnDocs(matrixesArrey,trimData){
//     let [tTop, tSide] = await trimData
//     //let tMm = await trimMatrix(matrixesArrey[0].data, tTop, tSide)
//     //let tCm = await trimMatrix(matrixesArrey[1].data, tTop, tSide)
//     let trimedMatrixes = [tMm.data,tCm.data]
//     let joinedMtx = await joinMatrixes(matrixesArrey, trimedMatrixes)
//     return joinedMtx
// }

// async function joinMatrixes(matrixesArrey, trimedData) {

//     let joinedMarixesInfo = {
//         "info": "info ya"
//     }

//      let [tMm,tCm] = trimedData

//     tCm.forEach((row, rowIndex) => {

//         let joinedRow = []
//         console.log(row)
//         let updatedCell
//         row.cellsData.forEach((CmCell, cellIndex) => {

//             let MmCell = tMm[rowIndex][cellIndex]
//             if (CmCell != null) {
//                 let Keys = Object.keys(CmCell)
//                 updatedCell = Keys.map(key => {
//                     return {
//                         [key]: CmCell[key]
//                     }
//                 })

//                 updatedCell.Quantity = MmCell
//                 joinedRow.push(MmCell)
//                 joinedRow.push(updatedCell)
//             } else joinedRow.push({
//                 Quantity: MmCell
//             })

//         })

//         CmCell.docData ? CmCell.docData : null
//         CmCell.metaData ? CmCell.metaData : null

//         joinedMatrixData.push({
//             'cellsData': joinedRow,
//             'docData': CmCell.docData,
//             'metaData': CmCell.metaData
//         })
//     })

//     const constractedMatrix = Object.create(joinedMarixesInfo, {
//         'data': joinedMatrixData
//     })

//     console.table(JSON.stringify(constractedMatrix, null, 2))

//     return constractedMatrix
// }

// async function trimMatrix(mtx, topIndex, sideIndex) {
//     let newMatrix = []
//     let record = []
//     for (let i = topIndex - 1; i < mtx.length; i++) {
//         for (let j = sideIndex - 1; j < mtx[i].length; j++) {
//             record.push[mtx[i][j]]
//         }

//         newMatrix.push(record)
//     }

//     return newMatrix

// }

// function matrixToTable(matrixesArrey, headers) {

//     let mainMatrixData = matrixesArrey[0]
//     let changesMatrixData = matrixesArrey[1]
//     let matrixesDataToProcess
//     try {
//         if (changesMatrixData) {
//             matrixesDataToProcess = joinMatrixes()
//         } else(matrixesDataToProcess = mainMatrixData)
//     } catch (err) {
//         console.log("problem assigning matrix data " + err)
//     }

//     let Headers = matrixesDataToProcess.shift()
//     let tableData = []

//     let [castumrKeyHeader, itemKeyHeader, itemAmountHeader] = headers
//     let castumeersPointer = Headers.findIndex(castumrKeyHeader)
//     let itemPointer = Headers.findIndex(itemKeyHeader)
//     let amountPointer = Headers.findIndex(itemAmountHeader)

//     mData.forEach((row, index, data) => {
//         let record = {}
//         let rowData = []
//         rowData = row
//         for (let i = 2; i < rowData.length - 2; i++) {
//             record = {
//                 [Headers[castumeersPointer]]: rowData[castumeersPointer],
//                 [Headers[itemPointer]]: headers[i],
//                 [Headers[amountPointer]]: rowData[i]

//             }
//             tableData.push(record)
//         }

//     });
//     console.log("client log " + tableData)
//     return JSON.stringify(tableData)

// }

// function matrixesInfoValidation(matrixesArrey) {
//     let matrixesMetaData = {}
//     try {
//         if (matrixesArrey[0].ID == matrixesArrey[1].mainMatrixID) {
//             matrixesMetaData['MartixID'] = matrixesArrey[0].ID
//             matrixesMetaData['DocumentID'] = matrixesArrey[0].DocumentID
//             matrixesMetaData['matrixConfig'] = matrixesArrey[1].matrixConfig
//             matrixesMetaData['matrixGlobalData'] = matrixesArrey[1].matrixGlobalData

//             return matrixesMetaData
//         } else return "id not matching"
//     } catch (err) {
//         console.log(err)
//     }
// }
