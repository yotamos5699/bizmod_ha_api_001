/********** Client side data validation ********** 

* אם יש כפילות במס לקוח






*/

let mainMatrix = {
  "matrixesData": {
    "matrixID": "asdajhjkhasd!@#$xdfhasdg$%4fgjf%^&#$@FHGJ",
    "DefaultDocID": 1,
    "DocumentID": [1, 1, 1, null, 1, null]
  },
    "data": [
      ["AcountName", "AountKey", "CellPhone", "bb100", "xp100", "ab500", "spxp100", "sr"],
      ["yota", "10001", "506655699", "2", null, "1", "4", null],
      ["yosh", "10022", "506655698", "2", "3", null, "4", "6"],
      ["moti", "10401", "504654523", "2", "3", "1", "4", "6"],
      ["dana", "10601", "525543268", null, "3", "1", "4", "6"],
      ["tal", "11201", "507635997", "2", null, "1", "4", "6"]
    ]
  }


let changesMatrix = {
  "matrixConfig": {
    "submitTstemp": "12/11/2022",
    "managerID": "2312411241",
    "totalSells": 12312312,
    "mainMatrixId": "asdajhjkhasd!@#$xdfhasdg$%4fgjf%^&#$@FHGJ"
  },
  "matrixGlobalData": {
    "Details": "LONG TIME ON DE",
    "problemsLog": {
      "moneyMissing": 1312,
      "castumers": "asdasdasda"
    }

  },
  "data": [{
      "cellsData": [null, null, null, null, null, null, null, null],
      "docData": null
    },
    {
      "cellsData": [null, null, null, {
        "cellData": {
          "itemRow": {
            "Price": 222
          }
        }
      }, null, null, null, null, null],
      "docData": {
        "Details": "לתשלום עד ה 3.4.23"
      }
    },

    {
      "cellsData": [null, null, null, null, null, null, null, null],
      "docData": null
    },

    {
      "cellsData": [null, null, null, null, {
        "cellData": {
          "itemRow": {
            "DiscountPrc": 7,
            "Details": "מחיר מיוחד לגייז"
          }
        }
      }, null, null, null],
      "docData": null
    },
    {
      "cellsData": [null, null, null, null, null, null, null, null],
      "docData": {
        "DiscountPrc": 12
      }
    },
    {
      "cellsData": [null, null, null, null, null, null, null, {
        "cellData": {
          "itemRow": {
            "DiscountPrc": 3
          },

        }
      }],
      "metaData": {
        "Details": "לקוח לא משלם במסירה"
      },
      "docData": null

    }
  ]
}

module.exports.mainMatrix = mainMatrix
module.exports.changesMatrix = changesMatrix