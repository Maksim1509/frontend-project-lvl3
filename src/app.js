/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import _ from 'lodash';
import resources from './locales';
import observe from './observers';
import getContent from './parse';
import { renderErrors, renderState } from './renders';

const addProxy = (url) => `https://cors-anywhere.herokuapp.com/${url}`;

const validate = (value, links) => {
  const schema = yup.string().url().required()
    .notOneOf(links, 'rss already exist');
  try {
    schema.validateSync(value, { abortEarly: false });
  } catch (error) {
    return error.inner.map(({ message }) => message);
  }
  return null;
};

const updateState = (errors, state) => {
  if (errors) {
    state.errors = errors;
    state.valid = false;
  } else {
    state.errors = [];
    state.valid = true;
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
      const [feed, posts] = getContent(response.data);
      const feedId = _.uniqueId();
      feed.feedId = feedId;
      state.feedsList.push(feed);
      state.postsList.push(posts);
      state.links.push(link);
      state.valid = false;
      state.processState = 'successfully';
    })
    .catch((err) => {
      state.processState = 'failed';
      state.valid = false;
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
    valid: false,
    errors: [],
    links: [],
    feedsList: [],
    postsList: [],
  };

  observe(state, renderErrors, renderState);

  const requestIntervalTime = 5000;
  const updateContent = () => {
    const promises = state.links.map((link) => {
      const linkWithProxy = addProxy(link);
      return axios.get(linkWithProxy);
    });
    const promise = Promise.all(promises);
    promise.then((response) => {
      const updatedPosts = response.map(({ data }) => {
        const [, posts] = getContent(data);
        return posts;
      });
      state.postsList = updatedPosts;
    }).finally(() => setTimeout(updateContent, requestIntervalTime));
  };
  setTimeout(updateContent, requestIntervalTime);

  const form = document.querySelector('form');
  form.addEventListener('submit', formHandler(state));

  const input = form.querySelector('input');
  input.addEventListener('input', ({ target }) => {
    const { value } = target;
    state.linkField = value;
    const errors = validate(value, state.links);
    updateState(errors, state);
  });
};
