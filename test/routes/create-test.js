const { assert } = require('chai');
const request = require('supertest');

const app = require('../../app');
const Video = require('../../models/video');

const { parseTextFromHTML, buildVideoObject, findElementByAttribute } = require('../test-utils');
const { connectDatabase, disconnectDatabase } = require('../database-utilities');

describe('Server path: /videos/create', () => {
  const vidToCreate = buildVideoObject();

  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('POST', () => {
    it.only('saves a Video document', async () => {
      const response = await request(app).post('/videos/create').type('form').send(vidToCreate);
      const createdVideo = await Video.findOne(vidToCreate);

      assert.isOk(createdVideo, 'Video was not created successfully in the database');
      assert.include(createdVideo, vidToCreate);
    });

    it('redirects to the show page', async () => {
      const response = await request(app)
        .post('/videos/create')
        .type('form')
        .send(vidToCreate);

      const createdVideo = await Video.findOne(vidToCreate);

      assert.equal(response.status, 302);
      assert.equal(response.headers.location, `/videos/${createdVideo._id}`);
    });

    it('will not save a video without a title', async () => {
      const invalidVideo = {description:'No Title Here',url:'http://www.google.com'};
      const response = await request(app)
        .post('/videos/create')
        .type('form')
        .send(invalidVideo);

      const allVids = await Video.find({});

      assert.equal(allVids.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });

    it('will not save a video without a url', async () => {
      const invalidVideo = {title:'Url-Less', description:'No URL Here'};
      const response = await request(app)
        .post('/videos/create')
        .type('form')
        .send(invalidVideo);
      const allVids = await Video.find({});

      assert.equal(allVids.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });

    it('remembers the description and url when title fails validation', async () => {
      const invalidVideo = {description:'No Title Here',url:'http://www.google.com'};
      const response = await request(app)
        .post('/videos/create')
        .type('form')
        .send(invalidVideo);
      const vidElement = findElementByAttribute(response.text,'input','value',invalidVideo.url);

      assert.include(parseTextFromHTML(response.text, 'form'), invalidVideo.description);
      assert.equal(vidElement.value, invalidVideo.url);
    });
  });
});
