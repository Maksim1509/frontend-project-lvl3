export const renderErrors = (state, i18next) => {
  const inputLink = document.querySelector('input');
  const feedback = document.querySelector('.feedback');
  if (!state.valid) {
    const { errors: [error] } = state;
    inputLink.classList.add('is-invalid');
    feedback.classList.add('text-danger');
    feedback.classList.remove('text-success');
    feedback.innerHTML = i18next.t(`errors.validation.${error}`);
  } else {
    inputLink.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.innerHTML = '';
  }
};

export const renderState = (state, i18next) => {
  const submitBtn = document.querySelector('button');
  const link = document.querySelector('input');
  const feedback = document.querySelector('.feedback');

  switch (state.processState) {
    case 'sending': submitBtn.disabled = true;
      link.readOnly = true;
      break;
    case 'successfully': submitBtn.disabled = false;
      link.readOnly = false;
      link.value = '';
      feedback.innerHTML = i18next.t('loaded');
      feedback.classList.add('text-success');
      break;
    case 'failed': submitBtn.disabled = false;
      link.readOnly = false;
      link.value = '';
      feedback.innerHTML = i18next.t([`errors.netWork.${state.processError}`, 'errors.netWork.unspecific']);
      feedback.classList.add('text-danger');
      break;
    default:
      throw new Error(`Unknow state: ${state.processState}`);
  }
};
