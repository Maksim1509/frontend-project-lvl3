import { watch } from 'melanke-watchjs';

export default (state) => {
  watch(state, 'errors', () => {
    const inputLink = document.querySelector('input');
    const feedback = document.querySelector('.feedback');
    if (!state.valid) {
      const { errors: [error] } = state;
      inputLink.classList.add('is-invalid');
      feedback.classList.add('invalid-feedback');
      feedback.classList.remove('valid-feedback');
      feedback.innerHTML = error;
    } else {
      inputLink.classList.remove('is-invalid');
      feedback.classList.remove('invalid-feedback');
      feedback.innerHTML = '';
    }
  });

  watch(state, 'valid', () => {
    const submitBtn = document.querySelector('button');
    submitBtn.disabled = !state.valid;
  });

  watch(state, 'processState', () => {
    const submitBtn = document.querySelector('button');
    const link = document.querySelector('input');
    const feedback = document.querySelector('.feedback');
    if (state.processState === 'sending') {
      submitBtn.disabled = true;
      link.readOnly = true;
    }
    if (state.processState === 'finished') {
      submitBtn.disabled = false;
      link.readOnly = false;
      link.value = '';
      feedback.innerHTML = 'Rss has been loaded';
      feedback.classList.add('valid-feedback');
    }
    if (state.processState === 'finished this Error') {
      submitBtn.disabled = false;
      link.readOnly = false;
      link.value = '';
      feedback.innerHTML = state.processError;
      feedback.classList.add('invalid-feedback');
    }
  });

  watch(state, 'feedContent', () => {
    const feedContainer = document.querySelector('.feed-container');
    feedContainer.innerHTML = '';
    state.feedContent.forEach((feed) => {
      const feedItem = document.createElement('div');
      feedItem.classList.add('row');

      const divFeed = document.createElement('div');
      divFeed.classList.add('feed', 'col');
      divFeed.id = `feed-${feed.feedId}`;
      const feedTitle = document.createElement('h4');
      feedTitle.innerHTML = feed.title;
      const spanDicription = document.createElement('span');
      spanDicription.innerHTML = feed.discription;
      divFeed.appendChild(feedTitle);
      divFeed.appendChild(spanDicription);
      feedItem.appendChild(divFeed);

      const ulPost = document.createElement('ul');
      ulPost.classList.add('col');
      ulPost.id = `post-${feed.feedId}`;
      feed.postsContent.forEach((post) => {
        const liPost = document.createElement('li');
        const link = `<a href="${post.link}">${post.titlePost}</a>`;
        liPost.innerHTML = link;
        ulPost.appendChild(liPost);
      });
      feedItem.appendChild(ulPost);
      feedContainer.appendChild(feedItem);
    });
  });
};
