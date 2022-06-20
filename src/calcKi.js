function joinMatrixes(matrixesArrey, trimData) {
    let [tTop, tSide] = trimData
    let joinedMarixesInfo = matrixesInfoValidation(matrixesArrey)
    console.log("matrixes in function ssss" + JSON.stringify(matrixesArrey, null, 2))
    let joinedMatrixData = []
    let tMm = trimMatrix(matrixesArrey[0].data, tTop, tSide)
    let tCm = trimMatrix(matrixesArrey[1].data, tTop, tSide)
    //Logger.log(trimedChangesMatrix)
    tCm.forEach((row, rowIndex) => {
        Logger.log("ROW NUM " + rowIndex + `row data\n` + JSON.stringify(row))
        let joinedRow = []
        let docData = row.docData[0] != null ? row.docData : [null]
        row.cellsData.forEach((CmCell, cellIndex) => {
            let MmCell = tMm[rowIndex][cellIndex]
            CmCell != null ? joinedRow.push({
                    Data: CmCell,
                    Quantity: MmCell
                }) :
                joinedRow.push(MmCell)

        })

        joinedMatrixData.push({
            'cellsData': joinedRow,
            'docData': docData
        })
    })


    const constractedMatrix = Object.create(joinedMarixesInfo, {
        'data': joinedMatrixData
    })

    console.table(JSON.stringify(constractedMatrix, null, 2))
    //console.log(`matrixes legth test ++++ \n ${constractedMatrix.data.length == matrixesArrey[0].data.length == matrixesArrey[1].data.length}`)


    return constractedMatrix
}





function trimMatrix(mtx, topIndex, sideIndex) {
    let newMatrix = []
    let record = []
    for (let i = topIndex - 1; i < mtx.length; i++) {
        for (let j = sideIndex - 1; j < mtx[i].length; j++) {
            record.push[mtx[i][j]]
        }


        newMatrix.push(record)
    }

    return newMatrix

}


function matrixToTable(matrixesArrey, headers) {



    let mainMatrixData = matrixesArrey[0]
    let changesMatrixData = matrixesArrey[1]
    let matrixesDataToProcess
    try {
        if (changesMatrixData) {
            matrixesDataToProcess = joinMatrixes()
        } else(matrixesDataToProcess = mainMatrixData)
    } catch (err) {
        console.log("problem assigning matrix data " + err)
    }



    let Headers = matrixesDataToProcess.shift()
    let tableData = []



    let [castumrKeyHeader, itemKeyHeader, itemAmountHeader] = headers
    let castumeersPointer = Headers.findIndex(castumrKeyHeader)
    let itemPointer = Headers.findIndex(itemKeyHeader)
    let amountPointer = Headers.findIndex(itemAmountHeader)

    mData.forEach((row, index, data) => {
        let record = {}
        let rowData = []
        rowData = row
        for (let i = 2; i < rowData.length - 2; i++) {
            record = {
                [Headers[castumeersPointer]]: rowData[castumeersPointer],
                [Headers[itemPointer]]: headers[i],
                [Headers[amountPointer]]: rowData[i]

            }
            tableData.push(record)
        }

    });
    console.log("client log " + tableData)
    return JSON.stringify(tableData)

}


function matrixesInfoValidation(matrixesArrey) {
    let matrixesMetaData = {}
    try {
        if (matrixesArrey[0].ID == matrixesArrey[1].mainMatrixID) {
            matrixesMetaData['MartixID'] = matrixesArrey[0].ID
            matrixesMetaData['DocumentID'] = matrixesArrey[0].DocumentID
            matrixesMetaData['matrixConfig'] = matrixesArrey[1].matrixConfig
            matrixesMetaData['matrixGlobalData'] = matrixesArrey[1].matrixGlobalData

            return matrixesMetaData
        } else return "id not matching"
    } catch (err) {
        console.log(err)
    }
}

module.exports.joinMatrixes = joinMatrixes;