export default (data) => {
  const parser = new DOMParser();
  const domRss = parser.parseFromString(data, 'text/xml');

  const title = domRss.querySelector('title');
  const link = domRss.querySelector('link');
  const description = domRss.querySelector('description');

  const items = domRss.querySelectorAll('item');
  const posts = [];
  items.forEach((item) => {
    const postTitle = item.querySelector('title');
    const postLink = item.querySelector('link');
    const postGuid = item.querySelector('guid');
    const postContent = {
      title: postTitle.textContent,
      link: postLink.textContent,
      guid: postGuid.textContent,
    };
    posts.push(postContent);
  });

  const rssData = {
    title: title.textContent,
    link: link.textContent,
    description: description.textContent,
    posts,
  };
  return rssData;
};
