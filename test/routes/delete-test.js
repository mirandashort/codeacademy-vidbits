const { assert } = require('chai');
const request = require('supertest');

const app = require('../../app');
const Video = require('../../models/video');

const {seedVideoToDatabase} = require('../test-utils');
const {connectDatabase,disconnectDatabase} = require('../database-utilities');

describe('Server path: /videos/:id/delete', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('POST', () => {
    it('Removes a Video document', async () => {
      const video = await seedVideoToDatabase();
      const response = await request(app)
        .post(`/videos/${video._id}/deletions`)
        .type('form')
        .send();
      const videoList = await Video.find({});

      assert.equal(videoList.length,0,'Video was not deleted');
    });

    it('redirects home', async () => {
        const video = await seedVideoToDatabase();
        const response = await request(app)
          .post(`/videos/${video._id}/deletions`)
          .type('form')
          .send();

      assert.equal(response.status, 302);
      assert.equal(response.headers.location, `/`);
    });
  });
});
