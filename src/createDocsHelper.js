const setApprovedDataAndErrorLog = async (allData, matrixesData) => {
  let errorMatrix = [];
  let data = await allData.filter((row, idx) => {
    if (matrixesData.matrixesData.mainMatrix.ActionID[idx] == 1) {
      console.log("IN TRUE", { row });
      errorMatrix.push({
        RowPosition: idx,
        DocumentID: matrixesData.matrixesData.mainMatrix.DocumentID[idx],
        AccountKey: matrixesData.matrixesData.mainMatrix.AccountKey[idx],
        forProduce: true,
        errors: null,
      });
      return row;
    } else {
      console.log("IN FALSE", { row });
      errorMatrix.push({
        RowPosition: idx,
        DocumentID: matrixesData.matrixesData.mainMatrix.DocumentID[idx],
        AccountKey: matrixesData.matrixesData.mainMatrix.AccountKey[idx],
        forProduce: false,
        errors: [{ number: 1001, content: "invalide document type" }],
      });
    }
  });

  return { data: data, errorMatrix: errorMatrix };
};

const updateErrorMatrix = (errorMatrix, matrixesData, error, j) => {
  return errorMatrix.map((row) => {
    if (row.AccoutKey == matrixesData.matrixesData.mainMatrix.AccountKey[j]) {
      return { ...row, errors: row.errors.push(error) };
    } else return row;
  });
};

const gotErrors = (errorMatrix) => {
  let gotErrors = false;
  if (errorMatrix?.length) {
    for (let i = 0; i <= errorMatrix.length - 1; i++) {
      if (errorMatrix[i].errors) {
        gotErrors = true;
      }
    }
  }
  return gotErrors;
};

const joinErrorMatrixWithObjsectErrors = (errorMatrix, objectErrors) => {
  if (!objectErrors || !Array.isArray(objectErrors)) return [...errorMatrix];
  else
    return errorMatrix.map((error) => {
      let relatedError = objectErrors.filter((err) => err.RowPosition == error.RowPosition)[0];
      if (relatedError)
        return { ...error, errors: Array.isArray(error?.errors) ? error.errors.push(relatedError) : [relatedError] };
      else return { ...error };
    });
};

module.exports.joinErrorMatrixWithObjsectErrors = joinErrorMatrixWithObjsectErrors;
module.exports.gotErrors = gotErrors;
module.exports.updateErrorMatrix = updateErrorMatrix;
module.exports.setApprovedDataAndErrorLog = setApprovedDataAndErrorLog;
