/* eslint-disable no-unused-vars */
const http = require('http');
const url = require('url');
const parseFormdata = require('parse-formdata');
const cors = require('cors');
const fs = require('fs');
const express = require('express');

const app = express();

const port = process.env.PORT || 5000;


// 開啟cors權限
app.use(cors(), express.json());

app.get('/', async (req, res) => {
    const jsonData = await getJSON();
    res.send(jsonData);
});

app.post('/', async (req, res) => {
    const jsonData = await getJSON(); // 取得JSON資料
    const articleData = req.body;
    // const newArticleData = await parseFormFunc(req); // formData表單解析
    const eventFunc = articleData.func; // axios 指定的方法
    const eventData = articleData.data; // axios 中的資料。


    if (eventFunc === 'addArticle') {
        // 加入清單方法

        // 推入資料
        jsonData.push(eventData);
        // 寫入json
        await writeJson(jsonData);
        res.send(jsonData);
    } else if (eventFunc === 'reviseArticle') {
        // 修改內文
        jsonData.forEach((e) => {
            if (e.id === eventData.id) {
                e.title = eventData.title;
                e.content = eventData.content;
                e.date = eventData.date;
            }
        });
        await writeJson(jsonData);
        res.send(jsonData);
    } else if (eventFunc === 'chengeState') {
        // 更新清單資料
        jsonData.forEach((e) => {
            if (e.id === eventData.id) {
                e.state = eventData.state;
                e.stateImg = eventData.stateImg;
            }
        });
        await writeJson(jsonData);
        res.send(jsonData);
    }
});

app.delete('/', async (req, res) => {
    const jsonData = await getJSON();
    const articleData = req.body;
    // const eventFunc = articleData.func;
    const eventData = articleData.data;
    // 取得id值
    console.log(eventData.id);

    jsonData.forEach((e, index) => {
        if (e.id === eventData.id) {
            jsonData.splice(index, 1);
        }
    });

    // 寫入json
    await writeJson(jsonData);

    res.send(jsonData);
});

// !process.env.PORT
app.listen(port, () => {
    // console.log(port);
    console.log('監聽中-端口:' + port);
    console.log('測試自動部屬');
    // console.log(process.env.PORT);
});


/**
 * get 讀取JSON資料
 * @return {json}
 */
function getJSON () {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/item.json', function (err, getData) {
            if (err) reject(err);
            // 取得的資料是數字流型態 要轉成字串
            const json = JSON.parse(getData.toString());
            resolve(json);
            return;
        });
    }).then((promiseRes) => {
        return promiseRes;
    });
}

/**
 * post 取得表單內容方法
 * @param {object} req
 * @return {object}
 */
// function parseFormFunc(req) {
//     return new Promise((resolve, reject) => {
//         parseFormdata(req, (err, data) => {
//             if (err) reject(err);
//             console.log(data.fields);
//             resolve(data.fields);
//             return;
//         });
//     }).then((promiseRes) => {
//         // 轉換成json格式

//         const func = promiseRes.func;
//         // const data = JSON.parse(promiseRes.data);
//         const data = JSON.stringify(promiseRes.data);
//         const jsonData = {
//             func: func, // 指定操作方法
//             data: data, // 資料
//         };

//         // console.log(jsonData);
//         return jsonData;
//     }).catch((err) => {
//         throw err;
//     });
// }

/**
 * post 寫入JSON方法
 * @param {json} event
 * @return {undefined}
 */
function writeJson (event) {
    // 轉成字串型態
    const str = JSON.stringify(event);

    // 寫入
    fs.writeFile('./data/item.json', str, (err) => {
        if (err) throw (err);
        return;
    });
}


