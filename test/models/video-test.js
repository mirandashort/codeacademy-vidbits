const Video = require('../../models/video');
const {assert} = require('chai');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('Model: Video', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('#title', () => {
    it('is a String', () => {
      const titleAsNonString = 1;
      const video = new Video({title: titleAsNonString});

      assert.strictEqual(video.title, titleAsNonString.toString());
    });

    it('is required', () => {
      const video = new Video({});
      video.validateSync();

      assert.equal(video.errors.title.message, 'a `title` is required');
    });
  });

  describe('#description', () => {
    it('is a String', () => {
      const descriptionAsNonString = 1;
      const video = new Video({description: descriptionAsNonString});

      assert.strictEqual(video.description, descriptionAsNonString.toString());
    });

    it('is required', () => {
      const video = new Video({});
      video.validateSync();

      assert.equal(video.errors.description.message, 'a `description` is required');
    });
  });

  describe('#url', () => {
    it('is a String', () => {
      const urlAsNonString = 1;
      const video = new Video({url: urlAsNonString});

      assert.strictEqual(video.url, urlAsNonString.toString());
    });

    it('is required', () => {
      const video = new Video({});
      video.validateSync();
      
      assert.equal(video.errors.url.message, 'a `url` is required');
    });
  });
});
