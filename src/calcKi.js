// matrix 2 table function 

// (row.Action == 'לעדכן מלאי') {
//     stockUpdateArrey.push(record)
//     statArrey[arr[index].ID] = 'עודכן מלאי'


function joinMatrixes(mm, cm) {
    let joinedMatrix = []
    let tMm = trimMatrix(mm, 2, 4)
    let tCm = trimMatrix(cm, 2, 4)
    //Logger.log(trimedChangesMatrix)
    tCm.forEach((row, rowIndex) => {
        Logger.log("ROW NUM " + rowIndex + `row data\n` + JSON.stringify(row))
        let joinedRow = []
        row.forEach((CmCell, cellIndex) => {
            let MmCell = tMm[rowIndex][cellIndex]
            CmCell != null ? joinedRow.push({
                    Data: CmCell,
                    Quantity: MmCell
                }) :
                joinedRow.push(MmCell)

        })
        joinedMatrix.push(joinedRow)
    })


    console.table(JSON.stringify(joinedMatrix))
    console.log(joinedMatrix.length)

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

    return

}


function matrixToTable(matrixData, headers) {

    let mData = []
    mData = matrixData
    let Headers = mData.shift()
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