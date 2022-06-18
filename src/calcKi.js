// matrix 2 table function 

// (row.Action == 'לעדכן מלאי') {
//     stockUpdateArrey.push(record)
//     statArrey[arr[index].ID] = 'עודכן מלאי'



// update una docs
// push calcki 2d utilities functions
// upload docDef table explain the method to tal

// var mainMatrix = {
//     matrixID: 'asdajhjkhasd!@#$xdfhasdg$%4fgjf%^&#$@FHGJ',
//     DocumentID: "1",
//     data: [
//         ['AcountName', 'AountKey', 'CellPhone', 'bb100', 'xp100', 'ab500', 'spxp100', 'sr'],
//         ['yota', '10001', '506655699', '2', null, '1', '4', null],
//         ['yosh', '10022', '506655698', '2', '3', null, '4', '6'],
//         ['moti', '10401', '504654523', '2', '3', '1', '4', '6'],
//         ['dana', '10601', '525543268', null, '3', '1', '4', '6'],
//         ['tal', '11201', '507635997', '2', null, '1', '4', '6']
//     ]
// }




// // {
// //     docData: {
// //         itemRow: [DiscountPrc: 3.0, ],
// //         document: {
// //             Details: 'לתשלום עד 3.8']
// //     }
// //     metaData: [msg: 'לקוח לא משלם במסירה']
// // }
// // }

// // dynamically get the size of  the main matrix


// // every cell is either null or value


// var changesMatrix = {
//     matrixConfig: {
//         submitTstemp: "12/11/2022",
//         managerID: '2312411241',
//         totalSells: 12312312,
//         mainMatrixId: 'asdajhjkhasd!@#$xdfhasdg$%4fgjf%^&#$@FHGJ'
//     },
//     matrixGlobalData: {
//         Details: 'LONG TIME ON DE',
//         problemsLog: {
//             moneyMissing: 1312,
//             castumers: "asdasdasda"
//         }

//     },
//     data: [{
//             cellsData: [null, null, null, null, null, null, null, null],
//             docData: [null]
//         },
//         {
//             cellsData: [null, null, null, {
//                 cellData: {
//                     itemRow: [{
//                         Price: 222
//                     }]
//                 }
//             }, null, null, null, null, null],
//             docData: [{
//                 Details: "לתשלום עד ה 3.4.23"
//             }]
//         },

//         {
//             cellsData: [null, null, null, null, null, null, null, null],
//             docData: [null]
//         },

//         {
//             cellsData: [null, null, null, null, {
//                 cellData: {
//                     itemRow: [{
//                         DiscountPrc: 7
//                     }, {
//                         Details: 'מחיר מיוחד לגייז'
//                     }]
//                 }
//             }, null, null, null],
//             docData: [null]
//         },

//         {
//             cellsData: [null, null, null, null, null, null, null, null],
//             docData: [{
//                 DiscountPrc: 12
//             }]
//         },
//         {
//             cellsData: [null, null, null, null, null, null, null, {
//                 cellData: {
//                     itemRow: [{
//                         DiscountPrc: 3
//                     }],
//                     metaData: [{
//                         Details: 'לקוח לא משלם במסירה'
//                     }]
//                 }
//             }],
//             docData: [null]

//         }
//     ]
// }




function joinMatrixes(matrixesArrey, trimData) {
    let [tTop, tSide] = trimData
    let joinedMarixesInfo = matrixesInfoValidation(matrixesArrey)

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
    console.log(`matrixes legth test ++++ \n ${constractedMatrix.data.length == matrixesArrey[0].data.length == matrixesArrey[1].data.length}`)


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