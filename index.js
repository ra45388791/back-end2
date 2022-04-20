/* eslint-disable no-unused-vars */
const {MongoClient} = require('mongodb'); // 資料庫
const express = require('express');
const cors = require('cors');
const {get} = require('express/lib/response');
// const http = require('http');
// const url = require('url');
// const parseFormdata = require('parse-formdata');
// const fs = require('fs');

const app = express();

// 資料庫api
const url = 'mongodb://user123:orange7380@cluster0-shard-00-00.ndp9d.mongodb.net:27017,cluster0-shard-00-01.ndp9d.mongodb.net:27017,cluster0-shard-00-02.ndp9d.mongodb.net:27017/testDataBase?ssl=true&replicaSet=atlas-ifvg1s-shard-0&authSource=admin&retryWrites=true&w=majority';
const client = new MongoClient(url);

const port = process.env.PORT || 5000;
// 開啟cors權限
app.use(cors(), express.json());


app.get('/', async (req, res) => {
    const getData = await getAllDataBase();


    res.send(getData);
});

app.post('/', async (req, res) => {
    const articleData = req.body;
    const eventFunc = articleData.func; // axios 指定的方法
    const eventData = articleData.data; // axios 中的資料。


    if (eventFunc === 'addArticle') {
        // 把取得的文章寫入 mongoDB
        const getData = await addNewArticle(eventData);
        // 回傳全部的article資料
        res.send(getData);
    }
});

app.patch('/', async (req, res) => {
    const articleData = req.body;
    const eventFunc = articleData.func; // axios 指定的方法
    const eventData = articleData.data; // axios 中的資料。

    console.log(eventFunc);
    console.log(eventData);

    if (eventFunc === 'reviseArticle') {
        // 修改內文
        const getData = await editArticle('reviseArticle', eventData);

        res.send(getData);
    } else if (eventFunc === 'chengeState') {
        // 更新清單資料
        const getData = await editArticle('chengeState', eventData);

        res.send(getData);
    }
});

app.delete('/', async (req, res) => {
    const articleData = req.body;
    const idValue = articleData.data._id;

    const getData = await deleteArticle(idValue);

    res.send(getData);
});

// !process.env.PORT
app.listen(port, () => {
    console.log('監聽中-端口:' + port);
    console.log('測試自動部屬');
    // console.log(process.env.PORT);
});

/**
 * @return {json}
 */
async function getAllDataBase () {
    try {
        // 開啟連結
        await client.connect();
        // 選擇資料庫
        const db = client.db('testDataBase');
        // 選擇資料表
        const movies = db.collection('indexDB');

        const getAllData = await movies.find().toArray(); // 找到 title = Back to the Future 的資料

        return getAllData;
    } catch (err) {
        console.error(err);
    } finally {
        await client.close(); // !關閉連線
    }
}

/**
 *
 * @param {*} article
 */
async function addNewArticle (article) {
    try {
        // 開啟連結
        await client.connect();
        // 選擇資料庫
        const db = client.db('testDataBase');
        // 選擇資料表
        const movies = db.collection('indexDB');

        await movies.insertOne(article); // 新增 { title: 'Back to the Future' }這包資料

        const getAllData = await movies.find().toArray(); // 找到所有資料
        return getAllData;
    } catch (err) {
        console.error(err);
    } finally {
        await client.close(); // !關閉連線
    }
}

/**
 *
 * @param {*} article
 * @return {array}
 */
async function editArticle (className, article) {
    let setArticle = '';
    if (className === 'reviseArticle') { // 修改內文
        setArticle = {
            title: article.title,
            content: article.content,
            date: article.date,
        };
    } else if (className === 'chengeState') { // 修改文章狀態
        setArticle = {
            state: article.state,
            stateImg: article.stateImg,
        };
    }

    try {
        // 開啟連結
        await client.connect();
        // 選擇資料庫
        const db = client.db('testDataBase');
        // 選擇資料表
        const movies = db.collection('indexDB');
        await movies.updateOne({'_id': article._id}, { // 新增 { title: 'Back to the Future' }這包資料
            $set: setArticle, // 設定內容
        });

        const getAllData = await movies.find().toArray(); // 找到所有資料
        return getAllData;
    } catch (err) {
        console.error(err);
    } finally {
        await client.close(); // !關閉連線
    }
}


/**
 *
 * @param {*} article
 */
async function deleteArticle (idValue) {
    console.log(idValue);
    try {
        // 開啟連結
        await client.connect();
        // 選擇資料庫
        const db = client.db('testDataBase');
        // 選擇資料表
        const movies = db.collection('indexDB');

        await movies.deleteMany({'_id': idValue}); // 刪除

        const getAllData = await movies.find().toArray(); // 找到所有資料
        return getAllData;
    } catch (err) {
        console.error(err);
    } finally {
        await client.close(); // !關閉連線
    }
}

