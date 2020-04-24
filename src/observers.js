import { watch } from 'melanke-watchjs';
import { last } from 'lodash';

export default (state, renderErrors, renderState, i18next) => {
  watch(state, 'errors', () => renderErrors(state, i18next));
  watch(state, 'processState', () => renderState(state, i18next));

  watch(state, 'valid', () => {
    const submitBtn = document.querySelector('button');
    submitBtn.disabled = !state.valid;
  });

  watch(state, 'feedContent', () => {
    const listTab = document.getElementById('list-tab');
    const currentFeed = last(state.feedContent);
    const feedListItem = document.createElement('a');
    feedListItem.setAttribute('id', `list-feed${currentFeed.feedId}-list`);
    feedListItem.setAttribute('data-toggle', 'list');
    feedListItem.setAttribute('href', `#list-feed${currentFeed.feedId}`);
    feedListItem.setAttribute('role', 'tab');
    feedListItem.setAttribute('aria-controls', `feed${currentFeed.feedId}`);
    feedListItem.classList.add('list-group-item');
    const feedTitle = `<h5>${currentFeed.title}</h5><p>${currentFeed.discription}</p>`;
    feedListItem.innerHTML = feedTitle;

    const tabContent = document.getElementById('nav-tabContent');
    const postsContainer = document.createElement('div');
    postsContainer.setAttribute('id', `list-feed${currentFeed.feedId}`);
    postsContainer.classList.add('tab-pane', 'fade');
    postsContainer.setAttribute('role', 'tabpanel');
    postsContainer.setAttribute('aria-labelledby', `list-feed${currentFeed.feedId}-list`);
    const postList = document.createElement('ul');
    postList.classList.add('list-group');
    currentFeed.postsContent.forEach((post) => {
      const postListItem = document.createElement('li');
      postListItem.classList.add('list-group-item');
      const link = `<a class="text-secondary" href="${post.link}">${post.titlePost}</a>`;
      postListItem.innerHTML = link;
      postList.appendChild(postListItem);
    });
    if (state.feedContent.length === 1) {
      feedListItem.classList.add('active');
      postsContainer.classList.add('show', 'active');
    }
    listTab.appendChild(feedListItem);
    postsContainer.appendChild(postList);
    tabContent.appendChild(postsContainer);
  });

  watch(state, 'feedUpdatedContent', () => {
    const posts = document.querySelectorAll('[role="tabpanel"]');
    const updatedPosts = state.feedUpdatedContent
      .map(({ postsContent }, index) => ({ postsContent, index }));
    updatedPosts.forEach(({ postsContent, index }) => {
      const post = posts[index];
      post.innerHTML = '';
      const postList = document.createElement('ul');
      postList.classList.add('list-group');
      postsContent.forEach(({ titlePost, link }) => {
        const postListItem = document.createElement('li');
        postListItem.classList.add('list-group-item');
        const linkItem = `<a class="text-secondary" href="${link}">${titlePost}</a>`;
        postListItem.innerHTML = linkItem;
        postList.appendChild(postListItem);
      });
      post.appendChild(postList);
    });
  });
};
