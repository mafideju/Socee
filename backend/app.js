const express = require('express');
const parser = require('body-parser');
const app = express();

app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

app.post('/api/posts', (req, res, next) => {
    console.log('REQ.BODY =>', req.body);
    res.status(201).json({
        message: 'Recurso adicionado com sucesso! =)'
    });
});

app.get('/api/posts', (req, res, next) => {
    const posts = [
        {
            id: '1',
            title: 'Server 101',
            content: 'Este é o primeiro post vindo do servidor'
        },
        {
            id: '2',
            title: 'Server 201',
            content: 'Este é o segundo post - tem uma galera - vindo do servidor'
        }
    ];
    res.status(200).json({
        message: 'Deu Certo =)',
        posts
    });
});

module.exports = app;