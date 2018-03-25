const { assert } = require('chai');
const request = require('supertest');

const app = require('../../app');
const Video = require('../../models/video');

const {parseTextFromHTML,buildVideoObject,seedVideoToDatabase,findElementByAttribute} = require('../test-utils');
const {connectDatabase,disconnectDatabase} = require('../database-utilities');

describe('Server path: /videos/:id/edit', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('GET', () => {
    it('renders the video Form', async () => {
      const video = await seedVideoToDatabase();
      const response = await request(app).get(`/videos/${video._id}/edit`);
      const formTitle = findElementByAttribute(
        response.text,
        'input',
        'id',
        'title-input'
      );
      const formDescription = findElementByAttribute(
        response.text,
        'textarea',
        'id',
        'description-input'
      );
      const formUrl = findElementByAttribute(
        response.text,
        'input',
        'id',
        'url-input'
      );

      assert.equal(formTitle.value, video.title, 'Update form has a title');
      assert.equal(formDescription.value, video.description, 'Update form has a description');
      assert.equal(formUrl.value, video.url, 'Update form has a url');
    });
  });

  describe('POST', () => {
    it('Updates a Video document', async () => {
      const video = await seedVideoToDatabase();
      const updatedVideo = buildVideoObject({title: 'Updated Title!'});
      const response = await request(app)
        .post(`/videos/${video._id}/updates`)
        .type('form')
        .send(updatedVideo);
      const createdVideo = await Video.findById(video._id);

      assert.isOk(createdVideo, 'Video was not created successfully in the database');
      assert.equal(createdVideo.title,updatedVideo.title);
    });

    it('redirects to the show page', async () => {
      const video = await seedVideoToDatabase();
      const updatedVideo = buildVideoObject({title: 'Updated Title!'});
      const response = await request(app)
        .post(`/videos/${video._id}/updates`)
        .type('form')
        .send(updatedVideo);

      assert.equal(response.status, 302);
      assert.equal(response.headers.location, `/videos/${video._id}`);
    });

    it('will not save an invalid record', async () => {
      const video = await seedVideoToDatabase();
      const updatedVideo = {title: '', description: 'No Titles!', url: 'www.google.com'};
      const response = await request(app)
        .post(`/videos/${video._id}/updates`)
        .type('form')
        .send(updatedVideo);
      const createdVideo = await Video.findById(video._id);

      assert.equal(video.title, createdVideo.title);
      assert.notEqual(updatedVideo.title, createdVideo.title);
    });

    it('responds with 400 on invalid updates and displays \'edit\'', async () => {
      const video = await seedVideoToDatabase();
      const updatedVideo = {title: '', description: 'No Titles!', url: 'www.google.com'};
      const response = await request(app)
        .post(`/videos/${video._id}/updates`)
        .type('form')
        .send(updatedVideo);

      assert.equal(response.status, 400);
      assert.equal(parseTextFromHTML(response.text, 'h2'), 'Edit');
      assert.include(parseTextFromHTML(response.text, 'form'),'required','invalid updates should alert the user');
    });
  });
});
