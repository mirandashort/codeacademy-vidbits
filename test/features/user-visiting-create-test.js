const {assert} = require('chai');
const {buildVideoObject} = require('../test-utils');

describe('User visits the create page', () => {
  describe('posts a new item', () => {
    it('and is rendered', () => {
      const vidToCreate = buildVideoObject();

      browser.url('videos/create');
      browser.setValue('#title-input', vidToCreate.title);
      browser.setValue('#description-input', vidToCreate.description);
      browser.setValue('#url-input', vidToCreate.url);
      browser.click('#submit-button');

      assert.include(browser.getText('body'), vidToCreate.title);
    });
  });
});
