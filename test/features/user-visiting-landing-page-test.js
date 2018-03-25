const {assert} = require('chai');
const {userCreatesVideo} = require('../test-utils');

describe('User visiting landing page', () => {
  describe('with no existing videos', () => {
    it('shows no videos', () => {
      browser.url('/');

      assert.equal(browser.getText('#videos-container'), '');
    });
  });

  describe('can navigate', () => {
    it('to the create page', () => {
      browser.url('/');
      browser.click('a[href="/videos/create"]');

      assert.include(browser.getText('h2'), 'Create');
    });
  });

  describe('with videos', () => {
    it('videos are displayed', () => {
      const createdVideo = userCreatesVideo();

      browser.url('/');

      assert.include(browser.getText('body'), createdVideo.title);
      assert.include(browser.getAttribute('iframe', 'src'), createdVideo.url);
    });

    it('can navigate to a video', () => {
      const createdVideo = userCreatesVideo();

      browser.url('/');
      browser.click('.video-card a');

      assert.include(browser.getText('body'), createdVideo.description);
    });
  });
});
