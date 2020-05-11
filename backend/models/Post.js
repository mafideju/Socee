const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
      type: String,
    },
    imagePath: {
      type: String,
    }
});

module.exports = mongoose.model('Post', PostSchema);
