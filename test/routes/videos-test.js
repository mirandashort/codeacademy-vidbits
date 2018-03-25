const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');
const Video = require('../../models/video');

const {parseTextFromHTML, seedVideoToDatabase,generateRandomUrl} = require('../test-utils');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('Server path: /', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('GET', () => {
    it('renders exiting videos', async () => {
      const video = await seedVideoToDatabase();
      const response = await request(app)
        .get(`/videos`);

      assert.include(parseTextFromHTML(response.text, '.video-title'), video.title);
    });

    it('renders all videos from the database', async () => {
      const firstVideo = await seedVideoToDatabase({title: 'Video1'});
      const secondVideo = await seedVideoToDatabase({title: 'Video2'});
      const response = await request(app)
        .get(`/videos`);

      assert.include(response.text, firstVideo.title);
      assert.include(response.text, secondVideo.title);
    });

    it('renders an iframe with a random URL', async() => {
      const video = await seedVideoToDatabase({url:generateRandomUrl('youtube.com')});
      const response = await request(app)
        .get(`/videos`);

      assert.include(response.text, video.url);
    });
  });
});
