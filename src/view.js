import { watch } from 'melanke-watchjs';

export default (state) => {
  watch(state, 'errors', () => {
    const inputLink = document.querySelector('input');
    if (!state.valid) {
      const { errors: [error] } = state;
      inputLink.classList.add('is-invalid');
      const errorMessage = document.querySelector('.invalid-feedback');
      console.log(errorMessage);
      if (errorMessage) {
        errorMessage.innerHTML = error;
        return;
      }
      const divError = document.createElement('div');
      divError.classList.add('invalid-feedback');
      divError.innerHTML = error;
      inputLink.parentElement.appendChild(divError);
    } else {
      inputLink.classList.remove('is-invalid');
      const errorMessage = document.querySelector('.invalid-feedback');
      if (errorMessage) {
        errorMessage.remove();
      }
    }
  });
  watch(state, 'valid', () => {
    const submitBtn = document.querySelector('button');
    submitBtn.disabled = !state.valid;
  });
};
