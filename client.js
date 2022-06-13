// var mainMatrix = [
//     ['AcountName', 'AountKey', 'CellPhone', 'bb100', 'xp100', 'ab500', 'spxp100', '     sr     '],
//     ['  yota    ', '10001', '506655699', '  2  ', null, '  1  ', '   4   ', null],
//     ['  yosh    ', '10022', '506655698', '  2  ', '  3  ', null, '   4   ', '     6     '],
//     ['  moti    ', '10401', '504654523', '  2  ', '  3  ', '  1  ', '   4   ', '     6     '],
//     ['  dana    ', '10601', '525543268', null, '  3  ', '  1  ', '   4   ', '     6     '],
//     ['  tal     ', '11201', '507635997', '  2  ', null, '  1  ', '   4   ', '     6     ']

// ]

// let postUrl = "https://script.google.com/macros/s/AKfycbw2lzuoudQ-Why3YGVzPvj-KabkhRcgEiW4VOK42gyx5ChMjoY1qzjgGAEJe7QDYGLo/exec"
let localHostUrl = "http://localhost:5000/api/calcki"

// // dynamically get the size of  the main matrix
// // every cell is either null or value 
// var changesMatrix = [
//     [null, null, null, null, null, null, null, null],
//     [null, null, null, {
//         Price: 222
//     }, null, null, null, null, null],
//     [null, null, null, null, null, null, null, null],
//     [null, null, null, null, {
//         Discount: 7
//     }, null, null, null],
//     [null, null, null, null, null, null, null, null],
//     [null, null, null, null, null, null, null, {
//         Discount: 3,
//         msg: 'לקוח לא משלם במסירה'
//     }]
// ]

// // trimed martixes 

// var trimedMainMatrix = [
//     ['   2  ', null, '  1  ', '   4   ', null],
//     ['  2  ', '  3  ', null, '   4   ', '     6     '],
//     ['  2  ', '  3  ', '  1  ', '   4   ', '     6     '],
//     [null, '  3  ', '  1  ', '   4   ', '     6     '],
//     ['  2  ', null, '  1  ', '   4   ', '     6     ']

// ]
// // dynamically get the size of  the main matrix
// // every cell is either null or value 
// var trimedChangesMatrix = [

//     [{
//         Price: 222
//     }, null, null, null, null],
//     [null, null, null, null, null],
//     [null, {
//         Discount: 7
//     }, null, null, null],
//     [null, null, null, null, null],
//     [null, null, null, null, {
//         Discount: 3,
//         msg: 'לקוח לא משלם במסירה'
//     }]
// ]



async function testButton() {
    // let localHostUrl2 = 
    // let data = {
    //     mainMtx: mainMatrix,
    //     changesMtx: changesMatrix


    // }

    let data = {
        TID: "1"
    }
    let options = {

        method: "POST",
        // mode: "no-cors",
        headers: {
            'Content-Type': "application/json",
            'Authorization': "Bearer 1111"
        },
        body: JSON.stringify(data)




        //  'payload': JSON.stringify(data)
    }

    console.log(options)
    let res = await fetch("http://localhost:5000/api/getrecords", options)
    console.log(JSON.stringify(res))
    document.getElementById('app').textContent = JSON.stringify(res)

}

//testButton();
document.getElementById("btn").addEventListener('click', testButton)