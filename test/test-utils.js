const {jsdom} = require('jsdom');

const Video = require('../models/video');

// Create a video through the browser
const userCreatesVideo = (options = {}) => {
  const vidToCreate = buildVideoObject();
  browser.url('videos/create');
  browser.setValue('#title-input', vidToCreate.title);
  browser.setValue('#description-input', vidToCreate.description);
  browser.setValue('#url-input', vidToCreate.url);
  browser.click('#submit-button');
  return vidToCreate;
};

// Create and return a sample Video object
const buildVideoObject = (options = {}) => {
  const title = options.title || 'Pug Trainer Workout';
  const description = options.description || 'Get fit, fast!';
  const url = options.url || 'https://www.youtube.com/watch?v=dv4f5D8mjdM';
  return {title, description, url};
};

// Add a sample Video object to mongodb
const seedVideoToDatabase = async (options = {}) => {
  const video = await Video.create(buildVideoObject(options));
  return video;
};

// extract text from an Element by selector.
const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.textContent;
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

const findElementByAttribute = (htmlAsString, element, attribute, value) => {
  const field = jsdom(htmlAsString).querySelector(`${element}[${attribute}="${value}"]`);
  if (field !== null) {
    return field;
  } else {
    throw new Error(`${element} with ${attribute}="${value}" not found in HTML string`);
  }
};

const generateRandomUrl = (domain) => {
  return `http://${domain}/${Math.random()}`;
};

module.exports = {
  userCreatesVideo,
  buildVideoObject,
  seedVideoToDatabase,
  parseTextFromHTML,
  findElementByAttribute,
  generateRandomUrl
};
