const express = require('express');
const multer = require('multer');
const Post = require('./../models/Post');

const router = express.Router();

const MIME_TYPE_ENUM = {
      'image/png': 'png',
      'image/jpeg': 'jpeg',
      'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_ENUM[file.mimetype];
    let error = new Error("Invalid Mime Type");
    if (isValid) {
      error = null
    };
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_ENUM[file.mimetype];
    cb(null, `${name}-${Date.now()}.${ext}`);
  }
});

router.get('', (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const page = +req.query.page;

  console.log('pageSize, page', pageSize, page)

  if (pageSize && page) {
    Post.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
  }

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

router.post('', multer({storage: storage}).single('image') , (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}`;
  const post = new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      imagePath: `${url}/images/${req.file.filename}`
  });
  post
      .save()
      .then(result => {
          res.status(201).json({
              message: 'Recurso adicionado com sucesso! =)',
              post: {
                id: result._id,
                title: result.title,
                content: result.content,
                author: result.author,
                imagePath: result.imagePath,
              }
          });
      })
      .catch(err => console.log('error', err));
});

router.put("/:id", multer({storage: storage}).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = `${req.protocol}://${req.get('host')}`;
    imagePath = `${url}/images/${req.file.filename}`;
  }
  const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      imagePath
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
