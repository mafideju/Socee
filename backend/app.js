const express = require('express');
const path = require('path');
const parser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const PostRouter = require('./routes/posts');

mongoose
    .connect('mongodb+srv://mafideju:mancada60@angularnode-qkycv.mongodb.net/nodeangular?retryWrites=true&w=majority')
    .then((data) => console.log(`******Conexão Estabelecida****** => ${data}`))
    .catch((err) => console.log(`=( Foi encontrado um erro => ${err}`));

app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    next();
});

app.use('/api/posts', PostRouter);

module.exports = app;
