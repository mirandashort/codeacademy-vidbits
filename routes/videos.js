const router = require('express').Router();

const Video = require('../models/video');

router.get('/videos', async (req, res, next) => {
  const videos = await Video.find({});
  res.render('videos/index', {videos});
});

// create a new video by navigating to the 'create' route
router.get('/videos/create', (req, res, next) => {
  res.render('videos/create');
});

router.post('/videos/create', async (req, res, next) => {
  const {title, description, url} = req.body;
  const video = new Video({title, description, url});
  video.validateSync();
  if (video.errors) {
    res.status(400).render('videos/create', {video});
  } else {
    await video.save();
    res.redirect(`/videos/${video._id}`);
  }
});

router.get('/videos/:videoId', async (req, res, next) => {
  const video = await Video.findById(req.params.videoId);
  res.render('videos/show', {video});
});

router.get('/videos/:videoId/edit', async (req, res, next) => {
  const video = await Video.findById(req.params.videoId);
  res.render('videos/edit',{video});
});

router.post('/videos/:videoId/updates', async (req, res, next) => {
  const thisVideo = await Video.findById(req.params.videoId);
  await Video.update({_id: req.params.videoId}, //id to update
      req.body, //new values
      {runValidators: true}, //options
      function(err){ //callback
        if (err) {
          return res.status(400).render(`videos/edit`, {errors: err.errors, video: thisVideo});
        } else {
          return res.redirect(`/videos/${req.params.videoId}`)
        }
  });
});

router.post('/videos/:videoId/deletions', async (req, res, next) => {
  const video = await Video.findById(req.params.videoId);
  await video.remove()
  res.redirect('/');
});

module.exports = router;
