const {mongoose} = require('../database');

const Video = mongoose.model(
  'Video',
  mongoose.Schema({
    title: {
      type: String,
      required: [true, 'a `title` is required']
    },
    description: {
      type: String,
      required: [true, 'a `description` is required']
    },
    url: {
      type: String,
      required: [true, 'a `url` is required']
    },
  })
);

module.exports = Video;
