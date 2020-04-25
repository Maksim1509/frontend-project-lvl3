/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import _ from 'lodash';
import resources from './locales';
import observe from './observers';
import getContent from './parse';
import { renderErrors, renderState } from './renders';

const links = [];
const schema = yup.string().url().required()
  .test('Unique', 'rss alredy exist', (values) => !links.includes(values));

const addProxy = (url) => `https://cors-anywhere.herokuapp.com/${url}`;

const updateValidationState = (state) => {
  try {
    schema.validateSync(state.linkField, { abortEarly: false });
    state.valid = true;
    state.errors = [];
  } catch (e) {
    const errors = e.inner.map(({ message }) => message);
    state.errors = errors;
    state.valid = false;
  }
};

const formHandler = (state) => (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const link = formData.get('link');
  state.processState = 'sending';
  const linkWithProxy = addProxy(link);
  axios.get(linkWithProxy)
    .then((response) => {
      const feedContent = getContent(response.data);
      const feedId = _.uniqueId();
      feedContent.feedId = feedId;
      state.feedContent.push(feedContent);
      links.push(link);
      state.links.push(link);
      state.processState = 'successfully';
    })
    .catch((err) => {
      state.processState = 'failed';
      state.processError = err.response.status;
    });
};

export default () => {
  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  });
  const state = {
    processState: '',
    processError: null,
    linkField: '',
    valid: true,
    errors: [],
    links: [],
    feedContent: [],
    feedUpdatedContent: [],
  };

  observe(state, renderErrors, renderState, i18next);

  const requestIntervalTime = 5000;
  const updateContent = () => {
    const promises = state.links.map((link) => {
      const linkWithProxy = addProxy(link);
      return axios.get(linkWithProxy);
    });
    const promise = Promise.all(promises);
    promise.then((response) => {
      const feedUpdatedContent = response.map(({ data }) => {
        const content = getContent(data);
        return content;
      });
      state.feedUpdatedContent = feedUpdatedContent;
      setTimeout(updateContent, requestIntervalTime);
    }).catch(() => {
      setTimeout(updateContent, requestIntervalTime);
    });
  };
  setTimeout(updateContent, requestIntervalTime);

  const form = document.querySelector('form');
  form.addEventListener('submit', formHandler(state));

  const input = form.querySelector('input');
  input.addEventListener('input', ({ target }) => {
    const { value } = target;
    state.linkField = value;
    updateValidationState(state, state.links);
  });
};
