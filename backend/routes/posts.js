const express = require('express');

const Post = require('./../models/Post');

const router = express.Router();


router.get('', (req, res, next) => {
  Post.find()
      .then(posts => {
          res.status(200).json({
              message: 'Deu Certo =)',
              posts
          });
      })
      .catch(err => console.log(err));
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
      .then(post => {
        post ?
          res.status(200).json(post) :
          res.status(404).json({ message: 'Postagem não encontrada...' });
      })
      .catch(err => console.log(err));
});

router.post('', (req, res, next) => {
  const post = new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
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

router.put("/:id", (req, res, next) => {
  const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
  });
  Post
      .updateOne({ _id: req.params.id }, post)
      .then(result => {
          res.status(200).json({ message: 'Atualizado com Sucesso!' });
      })
      .catch(err => console.log('error', err));
});

router.delete('/:id', (req, res, next) => {
  Post
      .findByIdAndRemove({ _id: req.params.id })
      .then(result => {
          res.status(204).json({
              message: 'Post Deletado! =|'
          });
      })
      .catch(err => console.log(err));
});

module.exports = router;
