const createRetJson = async (answer, index) => {
  console.log(`CreateRetJson function !! \n number doc ${index} \n ${JSON.stringify(answer)}`);
  ret = {
    DocumentIssuedStatus: answer[0]["DocumentIssuedStatus"],
    DocumentDefID: answer[0]["DocumentDetails"][0][0]["DocumentID"],
    StockID: answer[0]["DocumentDetails"][0][0]["StockID"],
    DocNumber: answer[0]["DocumentDetails"][0][0]["DocNumber"],
    AccountKey: answer[0]["DocumentDetails"][0][0]["AccountKey"],
    Accountname: answer[0]["DocumentDetails"][0][0]["accountname"],
    TotalCost: answer[0]["DocumentDetails"][0][0]["Tftal"],
    Address: answer[0]["DocumentDetails"][0][0]["Address"],
    DocumentDetails: answer[0]["DocumentDetails"][0][0]["Phone"],
    DocUrl: answer[0]["urlDoc"]
  };
  return ret;
};



const sortReportData = (reportData, sortKey, Warehouse) => {
  let headersList = ['קוד מיון', 'מחסן']
  let headersValues = [sortKey, Warehouse]

  let Headers = []
  let Values = []
  headersValues.forEach((value, index) => {


    if (value) {
      pair = {
        [headersList[index]]: value
      }
      Headers.push(headersList[index])
      Values.push(value)
    }
  })


  let sortedData = []
  let updatedData = reportData
  console.log("ffffffffffffffffffffffffffff" + JSON.stringify(updatedData[0, 1, 2], null, 2))
  Headers.forEach((header, index) => {
    updatedData.forEach(row => {
     // console.log(`heder keyyyyyyy  ${header}\n eader value !!!!!!  ${Values[index]}`)
      if (row[header] == Values[index]) {
        sortedData.push(row)
        console.log(row)
      }
    })
    updatedData = sortedData
    console.log(`sorted data \n ${(JSON.stringify(sortedData))}`)
  })


  return updatedData

}

module.exports.sortReportData = sortReportData
module.exports.createRetJson = createRetJson