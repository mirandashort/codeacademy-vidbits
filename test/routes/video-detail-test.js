const { assert } = require('chai');
const request = require('supertest');
const app = require('../../app');
const Video = require('../../models/video');

const { parseTextFromHTML, seedVideoToDatabase,findElementByAttribute } = require('../test-utils');
const { connectDatabase, disconnectDatabase } = require('../database-utilities');

describe('Server path: /videos/:id', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('GET', () => {
    it('renders the video title and description', async () => {
      const video = await seedVideoToDatabase();
      const response = await request(app).get(`/videos/${video._id}`);

      assert.include(parseTextFromHTML(response.text, '.video-title'), video.title);
      assert.include(parseTextFromHTML(response.text, '.video-description'), video.description);
    });

    it('contains an iframe with the URL', async () => {
      const video = await seedVideoToDatabase();
      const response = await request(app).get(`/videos/${video._id}`);
      const vidElement = findElementByAttribute(response.text,'iframe','src',video.url);

      assert.equal(vidElement.src, video.url);
    });
  });
});
