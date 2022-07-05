const express = require("express");
const router = express.Router();
const fs = require("fs");
const storage = require('./firebase')
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


router.post("/api/uploaddoc", async function (req, res) {

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



router.get("/api/signedFiles", async function (req, res) {
    let path = await req.body.Path
    let accounts = await ewq.body.Accounts
    try{
    let urlsList = await getUrlList(path,accounts)
    res.json({data:JSON.stringify(urlsList)}).end;
    }catch(err){

        console.log(err)
        res.json({data:'error'}).end;
    }

});


module.exports = router;