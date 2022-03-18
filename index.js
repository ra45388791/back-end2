const http = require('http');
const url = require('url');
const parseFormdata = require('parse-formdata');
const cors = require('cors');
const fs = require('fs');
const express = require('express');
const { log } = require('console');
const { json } = require('express');

const app = express();

const port = process.env.PORT || 3000;


//開啟cors權限
app.use(cors());

app.get('/', async (req, res) => {
    let jsonData = await getJSON();
    res.send(jsonData);
});

app.post('/', async (req, res) => {
    let jsonData = await getJSON();
    const newArticleData = await parseFormFunc(req);
    const eventFunc = newArticleData.func;
    let eventData = newArticleData.data;

    //完整資料格式
    console.log(newArticleData);
    //推入資料
    jsonData.push(eventData);
    //寫入json
    await writeJson(jsonData);

    res.send(jsonData);
});

app.delete('/', async (req, res) => {
    let jsonData = await getJSON();
    const getData = await parseFormFunc(req);
    const eventFunc = getData.func;
    let eventData = getData.data;
    //取得id值
    console.log(eventData.id);

    jsonData.forEach((e, index) => {
        if (e.id === eventData.id) {
            jsonData.splice(index, 1);
        }
    });

    //寫入json
    await writeJson(jsonData);

    res.send(jsonData);
});

// !process.env.PORT
app.listen(port, () => {
    // console.log(port);
    console.log('監聽中-端口:' + port);
    console.log('測試自動部屬');
    // console.log(process.env.PORT);
})

//get 讀取JSON資料
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
            return
        })
    }).then((promiseRes) => {
        // 轉換成json格式

        const func = promiseRes.func;
        const data = JSON.parse(promiseRes.data);
        const jsonData = {
            func: func,
            data: data,
        }

        // console.log(jsonData);
        return jsonData;
    }).catch((err) => {
        throw err;
    })
}

//寫入json方法
function writeJson(event) {
    //轉成字串型態
    const str = JSON.stringify(event);

    //寫入
    fs.writeFile('./data/item.json', str, (err) => {
        if (err) throw (err);
        return
    })

}