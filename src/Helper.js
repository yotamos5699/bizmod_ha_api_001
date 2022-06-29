const fs = require('fs')
const path = require("path");
const createRetJson = async (answer, index , Action) => {
  console.log(
    `CreateRetJson function !! \n number doc ${index} \n ${JSON.stringify(
      answer
    )}`
  );
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
    DocUrl: answer[0]["urlDoc"],
    Action: Action
  };
  return ret;
};




const updateJsonFILE = async (fileName, newData) => {
  //fileName = 'castumersInvoiceUrls'

  //newData = dd

  let data = fs.readFileSync(path.resolve(__dirname, `./${fileName}.json`), (err) => {
    if (err) throw err;

    console.log(err, "See resaults in myApiRes.txt");
  })
  console.log(data)
  data = await JSON.parse(data)
  console.log(data)

  newData.forEach((row, index) => {
    console.log("row  " + row + "index " + index)
    data.data.push(row)
  })

  console.log(typeof data)
  console.log(data)

  fs.writeFileSync(path.resolve(__dirname, `./${fileName}.json`), JSON.stringify(data), (err) => {
    if (err) throw err;
    console.log(err, "See resaults in myApiRes.txt");
  });
  return data

}
// const sortReportData = (reportData, sortKey) => {

//  // let sortByValues = []
//   let Keys = Object.keys(sortKey)
//   let Values = Object.values(sortKey)
//   //Values.forEach((value, index) => {


//   //   if (value) {
//   //     pair = {
//   //       [Keys[index]]: value
//   //     }
//   //     Headers.push(headersList[index])
//   //     Values.push(value)
//   //   }
//   // })


//   let sortedData = []
//   let updatedData = reportData
//   console.log("ffffffffffffffffffffffffffff" + JSON.stringify(updatedData[0, 1, 2], null, 2))
//   Keys.forEach((key, index) => {
//     updatedData.forEach(row => {
//      // console.log(`heder keyyyyyyy  ${header}\n eader value !!!!!!  ${Values[index]}`)
//       if (row[key] == Values[index]) {
//         sortedData.push(row)
//         console.log(row)
//       }
//     })
//     updatedData = sortedData
//     console.log(`sorted data \n ${(JSON.stringify(sortedData))}`)
//   })


//   return updatedData

// }



const sortReportData = (reportData, sortKey) => {
  let Keys = Object.keys(sortKey)
  let Values = Object.values(sortKey)
 // console.log(`KEYS ${Keys} \n VALUES ${Values}`)
  let newSortedData
  let updatedData = reportData
  //console.log(`data to sort....\n ${JSON.stringify(updatedData[0, 1, 2], null, 2)}`)
  Keys.forEach((key, index) => {
    newSortedData = []
    updatedData.forEach(row => {
      // console.log(`header keyyyyyyy  ${key}\n header value !!!!!!  ${Values[index]}`)
      if (row[key] == Values[index]) {
        newSortedData.push(row)
        // console.log(row)
      }
    })
    updatedData = newSortedData
    console.log(`sorted data \n ${(JSON.stringify(newSortedData))}`)
  })

  if (!updatedData) return {
    status: "no rows to return"
  }
  return updatedData
}
module.exports.updateJsonFILE = updateJsonFILE
module.exports.sortReportData = sortReportData
module.exports.createRetJson = createRetJson