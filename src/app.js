/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import view from './view';
import getContent from './parse';
import resources from './locales';

const schema = yup.string().url().required();

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

const formController = (state) => (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const link = formData.get('link');
  if (state.links.includes(link)) {
    state.errors.push('rss alredy exist');
    state.valid = false;
    return;
  }
  state.processState = 'sending';
  const linkWithProxy = addProxy(link);
  axios.get(linkWithProxy)
    .then((response) => {
      const feedContent = getContent(response.data);
      state.feedContent.push(feedContent);
      state.links.push(link);
      state.processState = 'finished';
    })
    .catch((err) => {
      state.processState = 'finished this Error';
      state.processError = err.response.status;
    });
};

const renderErrors = (state) => {
  const inputLink = document.querySelector('input');
  const feedback = document.querySelector('.feedback');
  if (!state.valid) {
    const { errors: [error] } = state;
    inputLink.classList.add('is-invalid');
    feedback.classList.add('invalid-feedback');
    feedback.classList.remove('valid-feedback');
    feedback.innerHTML = i18next.t(`errors.validation.${error}`);
  } else {
    inputLink.classList.remove('is-invalid');
    feedback.classList.remove('invalid-feedback');
    feedback.innerHTML = '';
  }
};

const renderState = (state) => {
  const submitBtn = document.querySelector('button');
  const link = document.querySelector('input');
  const feedback = document.querySelector('.feedback');

  switch (state.processState) {
    case 'sending': submitBtn.disabled = true;
      link.readOnly = true;
      break;
    case 'finished': submitBtn.disabled = false;
      link.readOnly = false;
      link.value = '';
      feedback.innerHTML = i18next.t('loaded');
      feedback.classList.add('valid-feedback');
      break;
    case 'finished this Error': submitBtn.disabled = false;
      link.readOnly = false;
      link.value = '';
      feedback.innerHTML = i18next.t([`errors.netWork.${state.processError}`, 'errors.netWork.unspecific']);
      feedback.classList.add('invalid-feedback');
      break;
    default:
      throw new Error(`Unknow state: ${state.processState}`);
  }
};

export default () => {
  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  });
  const state = {
    processState: 'filling',
    processError: null,
    linkField: '',
    valid: true,
    errors: [],
    links: [],
    feedContent: [],
  };

  view(state, renderErrors, renderState);

  const updateContent = () => {
    const promises = state.links.map((link) => {
      const linkWithProxy = addProxy(link);
      return axios.get(linkWithProxy);
    });
    const promise = Promise.all(promises);
    promise.then((response) => {
      const feedContent = response.map(({ data }) => getContent(data));
      state.feedContent = feedContent;
      setTimeout(updateContent, 5000);
    }).catch((e) => {
      console.log(e);
      setTimeout(updateContent, 5000);
    });
  };
  setTimeout(updateContent, 5000);

  const form = document.querySelector('form');
  form.addEventListener('submit', formController(state));

  const input = form.querySelector('input');
  input.addEventListener('input', ({ target }) => {
    state.processState = 'filling';
    const { value } = target;
    state.linkField = value;
    updateValidationState(state);
  });
};
