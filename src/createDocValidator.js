const documenDef = {
  1: "חשבונית מס ",
  2: "חשבונית מס/קבלה",
  3: "חשבונית מס זיכוי",
  4: "תעודת משלוח",
  5: "החזרה",
  6: "הזמנה",
  7: "הצעת מחיר",
  8: "חשבונית מס שריון",
  9: "חשבונית סוכן",
  10: "ת.מ. סוכן",
  11: "הזמנת סוכן",
  12: "חשבונית רכש",
  13: "זיכוי רכש",
  14: "ת.מ. רכש",
  15: "החזרה רכש",
  16: "הצעת מחיר רכש",
  17: "הזמנת רכש",
};
const allowedDocs = [1, 3];

const validate = async (data, type = "default") => {
  console.log("validating input in  ", { type });

  return checkNull(data);
};

module.exports.validate = validate;

const checkNull = async (data) => {
  let checks = [];
  if (!data.matrixesData.mainMatrix || !data.matrixesData.changesMatrix)
    return {
      status: "no",
      data:
        "expected matrixesData:  \n    mainMatrix: { \n  ....... \n }, \n changesMatrix: { \n ..........}\ngot " +
        { ...data },
    };
  else {
    if (!data.matrixID) checks.push({ path: "matrixID", error: "missing" });

    let innerMatrix = data.matrixesData.mainMatrix;
    const nestedArrays = await getArrays(innerMatrix);

    nestedArrays.forEach((array) => {
      if (!Array.isArray(array.data))
        checks.push({
          path: `mainMatrix.${array.name}`,
          error: `the object is ${typeof array.data}, needs to an Array`,
        });
    });
    if (!Array.isArray(innerMatrix.ActionID)) return { status: "no", data: checks };
    const nullsInArrays = checkNullsInArras([
      [innerMatrix.itemsHeaders, "itemsHeaders"],
      [innerMatrix.itemsNames, "itemsNames"],
    ]);
    if (nullsInArrays) checks = [...checks, ...nullsInArrays];

    if (!innerMatrix.ActionID.find((value) => value == 1) && !innerMatrix.ActionID.find((value) => value == 3)) {
      checks.push({
        path: "matrixesData.mainMatrix",
        error: "no documents to make expecting 1 or more of types [1,3]",
      });
    } else {
      for (let i = 0; i <= innerMatrix.ActionID.length - 1; i++) {
        let currentID = innerMatrix.DocumentID[i];
        if (innerMatrix.ActionID[i] == 1 && !allowedDocs.find((ID) => ID == currentID)) {
          checks.push({
            path: "mainMatrix.DocumentID",
            error: `document of type ${documenDef[innerMatrix.DocumentID[i]]} on key ${
              innerMatrix.DocumentID[i]
            } in row ${i} not allowed`,
          });
        }
      }

      if (
        innerMatrix.AccountKey.length != innerMatrix.DocumentID.length ||
        innerMatrix.AccountKey.length != innerMatrix.ActionAutho.length
      )
        checks.push({
          path: "matrixesData.mainMatrix",
          error: "unequal arrays length",
        });
    }
    if (checks?.length > 0) {
      return { status: "no", data: checks };
    }
  }
};
async function getArrays(ineerMatrix) {
  return [
    {
      name: "AccountKey",
      data: ineerMatrix.AccountKey,
      type: 1,
    },
    {
      name: "ActionAutho",
      data: ineerMatrix.ActionAutho,
      type: 1,
    },
    {
      name: "ActionID",
      data: ineerMatrix.ActionID,
      type: 1,
    },
    {
      name: "DocumentID",
      data: ineerMatrix.DocumentID,
      type: 1,
    },
    {
      name: "DriverID",
      data: ineerMatrix.DriverID,
      type: 1,
    },
    {
      name: "itemsHeaders",
      data: ineerMatrix.itemsHeaders,
      type: 2,
    },
    {
      name: "itemsNames",
      data: ineerMatrix.itemsNames,
      type: 2,
    },
    {
      name: "cellsData",
      data: ineerMatrix.cellsData,
      type: 2,
    },
  ];
}

function checkNullsInArras(arrays) {
  let errors = [];
  for (let i = 0; i <= arrays.length - 1; i++) {
    if (!arrays[i][0].every((element) => element !== null)) {
      errors.push({ path: arrays[i][1], error: "array contains null" });
    }
  }
  if (errors?.length) {
    return errors;
  } else return false;
}

//"ActionID": [
// //                 1",
// //                 1
// //             ],
// //             "AccountKey": [
// //                 "6026",
// //                 "6027"
// //             ],
// //             "DocumentID": [
// //                 1,
// //                 1
// //             ],
// //             "DriverID": [
// //                 "qewr135256edrfh",
// //                 "qewr135256edrfh"
// //             ],
// //             "ActionAutho": [
// //                 "Default",
// //                 "Default"
// //             ],
// //             "itemsHeaders": [
// //                 "HI250SA",
// //                 "SX250SA",
// //                 "AB500SA"
// //             ],
// //             "itemsNames": [
// //                 "הרנה 250 גרם",
// //                 "גת SPXP",
// //                 "אבו מיסמר גדול"
// //             ],
// //             "cellsData": [
// //                 [
// //                     3,
// //                     2,
// //                     1
// //                 ],
// //                 [
// //                     1,
// //                     0,
// //                     0
// //                 ]
// //             ]
// //         },
// //         "changesMatrix": {
// //             "matrixConfig": null,
// //             "matrixGlobalData": null,
// //             "cellsData": [
// //                 [
// //                     null,
// //                     null,
// //                     null
// //                 ],
// //                 [

// 18:"	העברה בין מחסנים - יציאה",
// 19:"	העברה בין מחסנים",
// 20:"	הוראת עבודה",
// 21:"	הוראת עבודה - בן",
// 22:"	דוח ייצור",
// 23:"	דוח ייצור - בן",
// 24:"	יתרת פתיחה
// 25:"	עדכון אחרי ספירה",
// 26:"	כניסה כללית",
// 27:"	יציאה כללית",
// 28:"	כניסה ישירה",
// 29:"	כניסה למחסן ערובה",
// 30:"	שחרור ממחסן ערובה",
// 31:"	קבלה",
// 32:"	קבלת סוכן",
// 33:"	הפקדה - מזומן",
// 34:"הוצאת שקים מקופה",
// 35:"	ח-ן יצוא",
// 36:"	הזמנת יצוא",
// 37:"	חשבונית מס ריכוז",
// 38:"	הזמנת יבוא",
// 39:"	תיק יבוא",
// 40:"	הפקדה - שקים",
// 41:"	הפקדה - אשראי",
// 43:"	העברה ישירה לבנק",
// 44:"	קבלת מטח",
// 45:"	קבלת סוכן מטח",
// 46:"	קבלת שקים חוזרים",
// 47:"	הוצאת שקים חוזרים",
// 48:"	הוצאת מזומן מקופה",
// 49:"	שחרור ממחסן ערובה-יציאה",
// 50:"	יתרת פתיחה - העברת שנה",
// 51:"	הודעות חיוב",
// 52:"	חוזי תשלום",
// 53:"	עלויות שחרור",
// 54:"	קבלת תרומה",
// 55:"	העברה בין מחסנים סוכן - יציאה",
// 56:"	העברה בין מחסנים סוכן",
// 57:"	ח-ן יצוא סוכן",
// 58:"	הזמנה - בן",
// 59:"	הזמנת עבודה",
// 60:"	חשבון עסקה - חיוב שעות",
// 61:"	חשבונית - חיוב ",
// 62:"	חשבונית מס/ק",בלה מטח
// 63:"	העברה ישירה לבנק - תרומה",
// 64:"	זיכוי אשראי",
// 65:"	חשבונית מס - קופה רושמת",
// 66:"	קבלה - קופה רושמת",
// 67:"	כרטיס עבודה",
// 68:"	יתרת פתיחה ניירות ערך",
// 69:"	רכישת ניירות ערך",
// 70:"	מכירת ניירות ערך",
// 71:"	תנועות ניירות ערך",
// 72:"	כרטיס עבודה סוכן",
// 73:"	חשבונית זיכוי סוכן",
// 74:"	החזרה סוכן",
// 75:"	חשבונית שריון סוכן",
// 76:"	חיוב ספק",
// 77:"	חשבונית שריון ספק",
// 78:"	חשבון עסקה",
// 79:"	חשבונית מס - שרות",
// 80:"	חשבונית מס/קבלה - שרות",
// 81:"	חשבונית מס סוכן - שרות",
// 82:"	חשבונית מס/קבלה סוכן - שרות",
// 83:"	חשבונית מס/קבלה - חיוב שעות",
// 84:"	חוזה שרות",
// 85:"	שרות - חיוב פנימי",
// 86:"	חשבונית מס על בסיס מזומן",
// 87:"	חשבונית מס/קבלה סוכן",
// 88:"	חשבונית עצמית",
// 89:"	הפקדה - שוברי שי",
// 90:"	חשבונית מס ריכוז- שרות",
// 91:"	חשבון עסקה ריכוז- שרות",
// 92:"	חשבון עסקה- שרות",
// 93:"	הצעת מחיר לחשבונות פוטנציאלים",
// 94:"	הצעת מחיר יצוא",
// 95:"	חשבון עסקה- סוכן",
// 96:"	הזמנת יצוא - סוכן",
// 97:"	חשבון עסקה- ביטול",
// 98:"	הזמנה ממחסן - יציאה",
// 99:"	הזמנה למחסן",
// 100:"	תעודת משלוח - יבוא",
// 101:"	ניהול תהליכי יצור",
// 102:"	הוראת עבודה מתהליך",
// 103:"	הוראת עבודה מתהליך - בן",
// 104:"	דוח ייצור מתהליך",
// 105:"	דוח ייצור בתהליך - בן",
// 106:"	הצעת מחיר- שרות",
// 107:"	הזמנת שירות",
// 108:"	הצעת מחיר- שכירות",
// 109:"	הזמנת שכירות",
// 110:"	כרטיס שכירות",
// 111:"	כרטיס שכירות סוכן",
// 112:"	חשבונית מס - שכירות",
// 113:"	חשבונית מס סוכן - שכירות",
// 114:"	חשבונית מס/קבלה - שכירות",
// 115:"	חשבונית מס/קבלה סוכן - שכירות",
// 116:"	חשבון עסקה- שכירות",
// 117:"	הזמנת שירות - סוכן",
// 118:"	הזמנת שכירות - סוכן",
// 119:"	תעודת משלוח יצוא",
// 120:"	זיכוי יצוא",
// 132:"	הצעת מחיר יבוא",
// 133:"	החזרת יצוא",
// 134:"	החזרת יצוא סוכן",
// 135:"	תעודת משלוח יצוא סוכן",
// 136:"	זיכוי יצוא סוכן",
// 140:"	הצעת מחיר יצוא לחשבונות פוטנציאלים",
// 141:"	קבלת תרומה - חנות וירטואלית",
// 142:"	קבלת תרומה מטח - חנות וירטואלית",
// 500:"	הזמנת B2B",}
// //     "matrixID"

// //     "matrixesData":" {
// //         "mainMatrix":" {
// //             "matrixID": "9321b6eb28c9c3b035bef8984863b2dd887d98d9ad89ea4c9112d3021da3da19"",
// //             "ActionID": [
// //                 1",
// //                 1
// //             ],
// //             "AccountKey": [
// //                 "6026",
// //                 "6027"
// //             ],
// //             "DocumentID": [
// //                 1,
// //                 1
// //             ],
// //             "DriverID": [
// //                 "qewr135256edrfh",
// //                 "qewr135256edrfh"
// //             ],
// //             "ActionAutho": [
// //                 "Default",
// //                 "Default"
// //             ],
// //             "itemsHeaders": [
// //                 "HI250SA",
// //                 "SX250SA",
// //                 "AB500SA"
// //             ],
// //             "itemsNames": [
// //                 "הרנה 250 גרם",
// //                 "גת SPXP",
// //                 "אבו מיסמר גדול"
// //             ],
// //             "cellsData": [
// //                 [
// //                     3,
// //                     2,
// //                     1
// //                 ],
// //                 [
// //                     1,
// //                     0,
// //                     0
// //                 ]
// //             ]
// //         },
// //         "changesMatrix": {
// //             "matrixConfig": null,
// //             "matrixGlobalData": null,
// //             "cellsData": [
// //                 [
// //                     null,
// //                     null,
// //                     null
// //                 ],
// //                 [
// //                     null,
// //                     null,
// //                     null
// //                 ]

// //             ],
// //             "docData": [
// //                 null,
// //                 null
// //             ],
// //             "metaData": [
// //                 null,
// //                 null
// //             ]
// //         }
// //     },
// //     "Date": "11/24/2022, 10:01:09 AM",
// //     "isBI": true,
// //     "isInitiated": true
// // }
// // if(!data.)

// // }
