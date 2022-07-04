

const {mainMatrix, changesMatrix} = require('./mockData')



const matrixes = [mainMatrix, changesMatrix]
const trimData = [2, 4]
//SS


async function returnDocs(matrixesArrey,trimData){
    let [tTop, tSide] = await trimData
    //let tMm = await trimMatrix(matrixesArrey[0].data, tTop, tSide)
    //let tCm = await trimMatrix(matrixesArrey[1].data, tTop, tSide)
    let trimedMatrixes = [tMm.data,tCm.data]
    let joinedMtx = await joinMatrixes(matrixesArrey, trimedMatrixes)
    return joinedMtx
}




async function joinMatrixes(matrixesArrey, trimedData) {
  
    //let joinedMarixesInfo = matrixesInfoValidation(matrixesArrey)
    let joinedMarixesInfo = {
        "info": "info ya"
    }

    // console.log("matrixes in function ssss" + JSON.stringify(matrixesArrey, null, 2))
    // let joinedMatrixData = []

    // console.log(`matrix 1111111 ${JSON.stringify(matrixesArrey[1].data)}`)
    
    
     let [tMm,tCm] = trimedData
    
    
    tCm.forEach((row, rowIndex) => {
        // Logger.log("ROW NUM " + rowIndex + `row data\n` + JSON.stringify(row))
        let joinedRow = []
        console.log(row)
        let updatedCell
        row.cellsData.forEach((CmCell, cellIndex) => {

            let MmCell = tMm[rowIndex][cellIndex]
            if (CmCell != null) {
                let Keys = Object.keys(CmCell)
                updatedCell = Keys.map(key => {
                    return {
                        [key]: CmCell[key]
                    }
                })

                updatedCell.Quantity = MmCell
                joinedRow.push(MmCell)
                joinedRow.push(updatedCell)
            } else joinedRow.push({
                Quantity: MmCell
            })

        })


        CmCell.docData ? CmCell.docData : null
        CmCell.metaData ? CmCell.metaData : null

        joinedMatrixData.push({
            'cellsData': joinedRow,
            'docData': CmCell.docData,
            'metaData': CmCell.metaData
        })
    })


    const constractedMatrix = Object.create(joinedMarixesInfo, {
        'data': joinedMatrixData
    })

    console.table(JSON.stringify(constractedMatrix, null, 2))
    //console.log(`matrixes legth test ++++ \n ${constractedMatrix.data.length == matrixesArrey[0].data.length == matrixesArrey[1].data.length}`)


    return constractedMatrix
}

//let res = joinMatrixes(matrixes, trimData)
//console.log(`RES ****** \n ${JSON.stringify(res)}`)



async function trimMatrix(mtx, topIndex, sideIndex) {
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