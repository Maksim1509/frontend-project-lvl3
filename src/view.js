import { watch } from 'melanke-watchjs';

export default (state, renderErrors, renderState) => {
  watch(state, 'errors', () => renderErrors(state));
  watch(state, 'processState', () => renderState(state));

  watch(state, 'valid', () => {
    const submitBtn = document.querySelector('button');
    submitBtn.disabled = !state.valid;
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
