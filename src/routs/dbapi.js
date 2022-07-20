const express = require("express");
const router = express.Router();
const fs = require("fs");
const storage = require('./firebase')
const path = require("path");
const Helper = require('../Helper')
const {
    ref,
    uploadBytes,
    listAll
} = require('firebase/storage')

router.use(express.json());


const uploadFile = async (fileName, file, AccountKey) => {
    const imageRef = ref(storage, `signeddocs/${AccountKey}/signed_${fileName}`)
    try {
        uploadBytes(imageRef, file).then(res => {
            console.log(JSON.stringify(res))
        })
    } catch (err) {
        console.dir(err)
    }
}


const getUrlList = async (Path, Accounts) => {
    let result
    if (!Accounts) {
        let dir = ref(storage, Path)
        listAll(dir).then(list => {
            result = list
        })
    } else {
        let Urls = []
        Accounts.forEach(element => {
            listAll(`${Path}${element}`).then(list => {
                Urls.push(list)
            })

        });
        result = Urls
    }

    return result
}


router.post("/api/savesignedFiles", async function (req, res) {

    let fileName = await req.body.fileName
    let file = await req.body.file
    let account = await req.body.AccountKey
    try {
        uploadFile(fileName, file, account).then(
            console.log("file uploaded...")
        )
    } catch (err) {
        console.log('error on uploading file')
        return res.send('error').end;
    }
    return res.send('file uploaded').end
});

router.post("/api/saveMatrix", async function (req, res) {
    let reqBody = await req.body
    let fileData = await Helper.readJsonFILE("mtrixDbJson")
    let data = await Helper.updateJsonFileData(reqBody, fileData)



    let updatedFileDataLOG = await Helper.writeToJsonFile("mtrixDbJson", JSON.stringify(data, null, 2))
    let backUpFileDataLOG = await Helper.writeToJsonFile("mtrixDbJsonback", JSON.stringify(data, null, 2))
    console.log(`**************************** Write files error log **********************\n 
             ***************** old file Log *****************\n${updatedFileDataLOG}\n
             ***************** backup file Log **************\n${backUpFileDataLOG}`)




    return res.send('file uploaded').end
});

app.get("/api/loadMatrix", async function (req, res) {
    let fileName = "mtrixDbJson";
    let backUpFileData = "no backup file exists"
    let oldFileData = await Helper.readJsonFILE("mtrixDbJson")
    if (fs.existsSync(path.resolve(__dirname, `mtrixDbJsonback.json`))) {
       backUpFileData = await Helper.readJsonFILE("mtrixDbJsonback")
    }

    console.log(`*************************** Url DB Files error log **********************\n 
    ***************** old file data *****************\n${JSON.stringify(oldFileData,null,2)}\n
    ***************** backup file data **************\n${JSON.stringify(backUpFileData,null,2)}`)

    try {
        if (backUpFileData) {
            if (oldFileData.length < backUpFileData.length) {
                fs.unlinkSync(path.resolve(__dirname, `mtrixDbJson.json`))
                fs.rename(path.resolve(__dirname, `mtrixDbJsonback.json`), path.resolve(__dirname, `castumersInvoiceUrls.json`))
            } else {
                fs.unlinkSync(path.resolve(__dirname, `mtrixDbJsonback.json`))
            }
        }
    } catch (err) {
        console.log(err)
    }

    let data = fs.readFileSync(
        path.resolve(__dirname, `./${fileName}.json`),
        (err) => {
            if (err) throw err;
            console.log(err, "See resaults in myApiRes.txt");
        }
    );
    data = JSON.parse(data);
    console.log(JSON.stringify(data, null, 2));

    res.send(JSON.stringify({
        "data": data
    }, null, 2)).end();
});




router.get("/api/loadsignedFiles", async function (req, res) {
    let path = await req.body.Path
    let accounts = await ewq.body.Accounts
    try {
        let urlsList = await getUrlList(path, accounts)
        res.json({
            data: JSON.stringify(urlsList)
        }).end;
    } catch (err) {

        console.log(err)
        res.json({
            data: 'error'
        }).end;
    }

});


module.exports = router;