const {assert} = require('chai');
const {userCreatesVideo} = require('../test-utils');

describe('User deleting a video', () => {
  it('removes the video from the list', () => {
    const createdVideo = userCreatesVideo();

    browser.url(`/`);
    browser.click('.video-card a');
    browser.click('#delete');
    
    assert.include(browser.getText('body'), createdVideo.title, "The video should be gone from list");
  });
});
