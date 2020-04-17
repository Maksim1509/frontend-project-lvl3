/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import axios from 'axios';
import view from './view';
import getContent from './parse';

const schema = yup.string().url().required();

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

export default () => {
  const state = {
    processState: 'filling',
    processError: null,
    linkField: '',
    valid: true,
    errors: [],
    links: [],
    feedContent: [],
  };
  view(state);

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const link = formData.get('link');
    if (state.links.includes(link)) {
      state.errors.push('rss alredy exist');
      state.valid = false;
      return;
    }
    state.processState = 'sending';

    axios.get(`https://cors-anywhere.herokuapp.com/${link}`)
      .then((response) => {
        const feedContent = getContent(response.data);
        state.feedContent.push(feedContent);
        state.links.push(link);
        state.processState = 'finished';
      })
      .catch((err) => {
        state.processState = 'finished this Error';
        console.log(err);
        state.processError = err;
      });
  });

  const input = form.querySelector('input');
  input.addEventListener('input', ({ target }) => {
    state.processState = 'filling';
    const { value } = target;
    state.linkField = value;
    updateValidationState(state);
  });
};
