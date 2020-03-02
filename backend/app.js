const express = require('express');
const parser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const Post = require('./models/Post');

mongoose
    .connect('mongodb+srv://mafideju:mancada60@angularnode-qkycv.mongodb.net/nodeangular?retryWrites=true&w=majority')
    .then((data) => console.log(`******Conexão Estabelecida****** => ${data}`))
    .catch((err) => console.log(`Foi encontrado um erro => ${err}`));

app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    next();
});

// ************ APIS *******************************************************
app.get('/api/posts', (req, res, next) => {
    Post.find()
        .then(posts => {
            res.status(200).json({
                message: 'Deu Certo =)',
                posts
            });
        })
        .catch(err => console.log(err));
});

app.post('/api/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Recurso adicionado com sucesso! =)',
                postId: result._id
            });
        })
        .catch(err => console.log('error', err));
});

app.put("/api/posts/:id", (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Post
        .updateOne({ _id: req.params.id }, post)
        .then(result => {
            res.status(200).json({ message: 'Atualizado com Sucesso!' });
        })
        .catch(err => console.log('error', err));
});

app.delete('/api/posts/:id', (req, res, next) => {
    Post
        .findByIdAndRemove({ _id: req.params.id })
        .then(result => {
            res.status(204).json({
                message: 'Post Deletado! =|'
            });
        })
        .catch(err => console.log(err));
});

module.exports = app;