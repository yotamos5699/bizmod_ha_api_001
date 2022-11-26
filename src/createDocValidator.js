const validate = async (data, type = "default") => {
  console.log("validating input in  ", { type });

  return checkNull(data);
};

module.exports.validate = validate;

const checkNull = (data) => {
  let checks = [];
  if (!data.matrixesData.mainMatrix || !data.matrixesData.changesMatrix)
    return {
      status: "no",
      data:
        "expected matrixesData:  \n    mainMatrix: { \n  ....... \n }, \n changesMatrix: { \n ..........}\ngot " +
        { ...data },
    };

  if (!data.matrixID) checks.push({ path: "matrixID", error: "missing" });
  if (!data.matrixesData.mainMatrix) {
    checks.push({ path: "matrixesData.mainMatrix", error: "missing" });
  } else {
    let innerMatrix = data.matrixesData.mainMatrix;
    if (
      !innerMatrix.ActionID.find((value) => value == 1) &&
      !innerMatrix.ActionID.find((value) => value == 3)
    )
      checks.push({
        path: "matrixesData.mainMatrix",
        error: "no documents to make expecting 1 or more of types [1,3]",
      });
    if (
      (innerMatrix.AccountKey.length != innerMatrix.DocumentID.length) !=
      innerMatrix.ActionAutho.length
    )
      checks.push({
        path: "matrixesData.mainMatrix",
        error: "unequal arrays length",
      });
  }
  if (checks?.length > 0) {
    return { status: "no", data: checks };
  }
};

//     "matrixID"

//     "matrixesData": {
//         "mainMatrix": {
//             "matrixID": "9321b6eb28c9c3b035bef8984863b2dd887d98d9ad89ea4c9112d3021da3da19",
//             "ActionID": [
//                 1,
//                 1
//             ],
//             "AccountKey": [
//                 "6026",
//                 "6027"
//             ],
//             "DocumentID": [
//                 1,
//                 1
//             ],
//             "DriverID": [
//                 "qewr135256edrfh",
//                 "qewr135256edrfh"
//             ],
//             "ActionAutho": [
//                 "Default",
//                 "Default"
//             ],
//             "itemsHeaders": [
//                 "HI250SA",
//                 "SX250SA",
//                 "AB500SA"
//             ],
//             "itemsNames": [
//                 "הרנה 250 גרם",
//                 "גת SPXP",
//                 "אבו מיסמר גדול"
//             ],
//             "cellsData": [
//                 [
//                     3,
//                     2,
//                     1
//                 ],
//                 [
//                     1,
//                     0,
//                     0
//                 ]
//             ]
//         },
//         "changesMatrix": {
//             "matrixConfig": null,
//             "matrixGlobalData": null,
//             "cellsData": [
//                 [
//                     null,
//                     null,
//                     null
//                 ],
//                 [
//                     null,
//                     null,
//                     null
//                 ]

//             ],
//             "docData": [
//                 null,
//                 null
//             ],
//             "metaData": [
//                 null,
//                 null
//             ]
//         }
//     },
//     "Date": "11/24/2022, 10:01:09 AM",
//     "isBI": true,
//     "isInitiated": true
// }
// if(!data.)

// }
