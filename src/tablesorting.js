// this utiliti takes a sorted table and make it in to a standart document

const { json } = require("express/lib/response");

// var googleSheetOutPut = [
//   { AccountKey: 6304, ItemKey: "XP100SA", Quantity: 4 },
//   { AccountKey: 6304, ItemKey: "SP250SA", Quantity: 5 },
//   { AccountKey: 6304, ItemKey: "BH200SA", Quantity: 7 },
//   { AccountKey: 6305, ItemKey: "BB100SA", Quantity: 2 },
//   { AccountKey: 6305, ItemKey: "HI250SA", Quantity: 3 },
//   { AccountKey: 6306, ItemKey: "XP100SA", Quantity: 8 },
//   { AccountKey: 6306, ItemKey: "BB100SA", Quantity: 8 },
// ];
// var stock = [
//   { AccountKey: 111, ItemKey: 22, Quantity: 5, pname: "toy" },
//   { AccountKey: 111, ItemKey: 11, Quantity: 2, pname: "boy" },
//   { AccountKey: 222, ItemKey: 22, Quantity: 3, pname: "toy" },
//   { AccountKey: 222, ItemKey: 22, Quantity: 1, pname: "toy" },
//   { AccountKey: 222, ItemKey: 22, Quantity: 7, pname: "toy" },
//   { AccountKey: 333, ItemKey: 22, Quantity: 2, pname: "toy" },
//   { AccountKey: 333, ItemKey: 22, Quantity: 6, pname: "toy" },
//   { AccountKey: 333, ItemKey: 22, Quantity: 9, pname: "toy" },
// ];

// var jsonres = [
//   { AccountKey: 111, ItemKey: 22, Quantity: 5, pname: "toy" },
//   { AccountKey: 111, ItemKey: 11, Quantity: 2, pname: "boy" },
//   { AccountKey: 222, ItemKey: 22, Quantity: 3, pname: "toy" },
//   { AccountKey: 222, ItemKey: 22, Quantity: 1, pname: "toy" },
//   { AccountKey: 222, ItemKey: 22, Quantity: 7, pname: "toy" },
//   { AccountKey: 333, ItemKey: 22, Quantity: 2, pname: "toy" },
//   { AccountKey: 333, ItemKey: 22, Quantity: 6, pname: "toy" },
//   { AccountKey: 333, ItemKey: 22, Quantity: 9, pname: "toy" },
// ];

// Taking a table and returning linkes listd of : Main obj and nested objects***************
//***************************************************************************************** */



function sortTableToLinkedLists(jsonres) {
  console.log(JSON.stringify(jsonres, null, 2));
  var courentUsser = jsonres[0].AccountKey;
  var ussersArrey = [];
  ussersArrey.push(courentUsser);
  var productArrey = [];
  var invoiceProduct = [];

  for (let i = 0; i < jsonres.length; i++) {
    if (jsonres[i].AccountKey != courentUsser) {
      //init new castumer invoice
      courentUsser = jsonres[i].AccountKey;
      // pushing the list of products to prev invoice
      productArrey.push(invoiceProduct);
      //starting new product list and setting new castumer
      invoiceProduct = [];
      invoiceProduct.push([jsonres[i].ItemKey, jsonres[i].Quantity, jsonres[i].Price && jsonres[i].Price ]);
      ussersArrey.push(courentUsser);
    } else {
      invoiceProduct.push([jsonres[i].ItemKey, jsonres[i].Quantity, jsonres[i].Price && jsonres[i].Price]);
    }
    console.log(invoiceProduct);
  }
  productArrey.push(invoiceProduct);
  return [ussersArrey, productArrey];
  //console.log(productArrey, ussersArrey);
}

// Taking main and secendry obj and returnins a Arrey of nested json Objects ***********************
//************************************************************************************************* */
function jsonArreyFromTable(ussersArrey, productArrey) {
  let jsonArrey = [];
  for (let i = 0; i < productArrey.length; i++) {
    // console.log(productArrey[i]);
    let productsMoves = productArrey[i].map((product) => {
     if(product[2]){
      return{
        ItemKey: product[0],
        Quantity: product[1],
        Price: product[2] 
     }}else{
      return{
        ItemKey: product[0],
        Quantity: product[1]

      }
     }
    });
    //  console.log(productsMoves);

    let stock = {
      AccountKey: ussersArrey[i].toString(),
      moves: productsMoves,
    };
    let formatedJsonResult = JSON.stringify(stock);
    jsonArrey.push(formatedJsonResult);
    console.log(jsonArrey.length);
    console.log(JSON.stringify(jsonArrey));
  }
  return jsonArrey;
}

async function jsonToInvoice(jsonRes) {
  const [castumeers, products] = sortTableToLinkedLists(jsonRes);
  const jsonArrey = jsonArreyFromTable(castumeers, products);
  //s
  console.log(jsonArrey.length);
  console.log(typeof jsonArrey);
  return jsonArrey;
}

//jsonToInvoice(googleSheetOutPut);
//jsonToInvoice(stock);
module.exports.jsonToInvoice = jsonToInvoice;
