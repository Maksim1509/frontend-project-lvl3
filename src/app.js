/* eslint-disable no-param-reassign */
// import _ from 'lodash';
import * as yup from 'yup';
import view from './view';

const schema = yup.string().url().required();

const updateValidationState = (state) => {
  try {
    schema.validateSync(state.linkField, { abortEarly: false });
    state.valid = true;
    state.errors = {};
  } catch (e) {
    const errors = e.inner.map(({ message }) => message);
    state.errors = errors;
    state.valid = false;
  }
};

export default () => {
  const state = {
    processState: 'filing',
    processError: null,
    linkField: '',
    valid: 'true',
    errors: [],
  };
  view(state);
  const form = document.querySelector('form');

  const input = form.querySelector('input');
  input.addEventListener('input', ({ target }) => {
    const { value } = target;
    state.linkField = value;
    console.log(value);
    updateValidationState(state);
  });
};
