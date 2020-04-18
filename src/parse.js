import { uniqueId } from 'lodash';

export default (data) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(data, 'text/xml');
  const title = parsedData.querySelector('title').textContent;
  const discription = parsedData.querySelector('description').textContent;
  const posts = parsedData.querySelectorAll('item');
  const postsContent = [...posts].map((post) => {
    const titlePost = post.querySelector('title').textContent;
    const link = post.querySelector('link').textContent;
    return { titlePost, link };
  });
  const feedId = uniqueId();
  return {
    title, discription, postsContent, feedId,
  };
};
