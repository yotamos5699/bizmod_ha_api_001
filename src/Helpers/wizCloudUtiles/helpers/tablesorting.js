// this utiliti takes a sorted table and make it in to a standart document

const { json } = require("express/lib/response");

// Taking a table and returning 2 lists of : Main obj(usser) and nested objects(arrey of items)***************
// ***************************************************************************************** */

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
