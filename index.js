const http = require('http');
const url = require('url');
const parseFormdata = require('parse-formdata');
const cors = require('cors');
const fs = require('fs');
const express = require('express');
const { log } = require('console');

const app = express();

// const port = process.env.PORT || 3000;


//開啟cors權限
app.use(cors());

app.get('/', async (req, res) => {
    let jsonData = await getJSON();
    res.send(jsonData);
});

app.post('/', async (req, res) => {
    let jsonData = await getJSON();

    const newData = await parseFormFunc(req);
    console.log(newData);
    //推入資料
    jsonData.push(newData);
    //轉成字串型態
    let str = JSON.stringify(jsonData);

    //寫入
    fs.writeFile('./data/item.json', str, (err) => {
        if (err) throw (err);
        return
    })
    // console.log(jsonData);
    res.send(jsonData);

});

// process.env.PORT
app.listen(process.env.PORT, () => {
    // console.log(port);
    console.log('監聽中');
    console.log('測試自動部屬');
    console.log('測試自動部屬2');
    console.log('測試自動部屬3');
    // console.log(process.env.PORT);
})

//get 取得JSON資料
function getJSON() {
    return new Promise((resolve, reject) => {

        fs.readFile('./data/item.json', function (err, getData) {
            if (err) reject(err);
            //取得的資料是數字流型態 要轉成字串
            let json = JSON.parse(getData.toString());
            resolve(json);
            return;
        })

    }).then((promiseRes) => {
        return promiseRes;
    })
}

//post 取得表單內容方法
function parseFormFunc(req) {
    return new Promise((resolve, reject) => {
        parseFormdata(req, (err, data) => {
            if (err) reject(err);
            resolve(data.fields);
        })
    }).then((promiseRes) => {
        const newData = promiseRes;
        return newData;
        // console.log(newData);
    }).catch((err) => {
        throw err;
    })
}