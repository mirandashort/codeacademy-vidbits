const {assert} = require('chai');
const {userCreatesVideo} = require('../test-utils');

describe('user updating a video', () => {
  it('changes the values', () => {
    const newTitle = 'Dog Ross does us a Learn';
    const createdVideo = userCreatesVideo();

    browser.click('#edit');
    browser.setValue('#title-input', newTitle);
    browser.click('#submit-button');

    assert.include(browser.getText('body'), newTitle, "The show page has an updated title");
  });

  it('overwrites the previous title', () => {
    const newTitle = 'Dog Ross does us a Learn';
    const createdVideo = userCreatesVideo();

    browser.click('#edit');
    browser.setValue('#title-input', newTitle);
    browser.click('#submit-button');
    browser.url('/');

    assert.include(browser.getText('body'), newTitle);
    assert.notInclude(browser.getText('body'), createdVideo.title, 'Original title not overwritten');
  });
});
