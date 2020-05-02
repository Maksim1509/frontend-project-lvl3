import { watch } from 'melanke-watchjs';
import { last } from 'lodash';

const isFirstFeed = (feeds) => feeds.length === 1;

export default (state, renderErrors, renderState, i18next) => {
  watch(state, 'errors', () => renderErrors(state, i18next));
  watch(state, 'processState', () => renderState(state, i18next));

  watch(state, 'valid', () => {
    const submitBtn = document.querySelector('button');
    submitBtn.disabled = !state.valid;
  });

  watch(state, 'feeds', () => {
    const listTab = document.getElementById('list-tab');
    const currentFeed = last(state.feeds);
    const feedListItem = document.createElement('a');
    feedListItem.setAttribute('id', `list-feed${currentFeed.feedId}-list`);
    feedListItem.setAttribute('data-toggle', 'list');
    feedListItem.setAttribute('href', `#list-feed${currentFeed.feedId}`);
    feedListItem.setAttribute('role', 'tab');
    feedListItem.setAttribute('aria-controls', `feed${currentFeed.feedId}`);
    feedListItem.classList.add('list-group-item');
    const feedTitle = `<h5>${currentFeed.title}</h5><p>${currentFeed.description}</p>`;
    feedListItem.innerHTML = feedTitle;

    const tabContent = document.getElementById('nav-tabContent');
    const postsContainer = document.createElement('div');
    postsContainer.setAttribute('id', `list-feed${currentFeed.feedId}`);
    postsContainer.classList.add('tab-pane', 'fade');
    postsContainer.setAttribute('role', 'tabpanel');
    postsContainer.setAttribute('aria-labelledby', `list-feed${currentFeed.feedId}-list`);
    if (isFirstFeed(state.feeds)) {
      feedListItem.classList.add('active');
      postsContainer.classList.add('show', 'active');
    }
    listTab.appendChild(feedListItem);
    tabContent.appendChild(postsContainer);
  });

  watch(state, 'posts', () => {
    const postsContainer = document.querySelectorAll('[role="tabpanel"]');
    const updatedPosts = state.posts.map((posts, index) => ({ posts, index }));
    updatedPosts.forEach(({ posts, index }) => {
      const oldPost = postsContainer[index];
      oldPost.innerHTML = '';
      const postsList = document.createElement('ul');
      postsList.classList.add('list-group');
      posts.forEach(({ title, link }) => {
        const postListItem = document.createElement('li');
        postListItem.classList.add('list-group-item', 'bg-info');
        const linkHtml = `<a class="text-white" href="${link}">${title}</a>`;
        postListItem.innerHTML = linkHtml;
        postsList.appendChild(postListItem);
      });
      oldPost.appendChild(postsList);
    });
  });
};
