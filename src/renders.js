import i18next from 'i18next';

export const renderErrors = (state) => {
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

export const renderState = (state) => {
  const submitBtn = document.querySelector('button');
  const link = document.querySelector('input');
  const feedback = document.querySelector('.feedback');
  const spiner = document.createElement('span');
  spiner.classList.add('spinner-border', 'spinner-border-sm');
  spiner.setAttribute('role', 'status');
  spiner.setAttribute('aria-hidden', 'true');
  const spinerText = document.createTextNode(i18next.t('button.load'));

  switch (state.processState) {
    case 'sending': submitBtn.disabled = true;
      link.readOnly = true;
      submitBtn.innerHTML = '';
      submitBtn.appendChild(spiner);
      submitBtn.appendChild(spinerText);
      break;
    case 'successfully':
      submitBtn.innerHTML = i18next.t('button.add');
      link.readOnly = false;
      link.value = '';
      feedback.innerHTML = i18next.t('loaded');
      feedback.classList.add('text-success');
      break;
    case 'failed':
      submitBtn.innerHTML = i18next.t('button.add');
      link.readOnly = false;
      link.value = '';
      feedback.innerHTML = i18next.t([`errors.netWork.${state.processError}`, 'errors.netWork.unspecific']);
      feedback.classList.add('text-danger');
      break;
    default:
      throw new Error(`Unknow state: ${state.processState}`);
  }
};
