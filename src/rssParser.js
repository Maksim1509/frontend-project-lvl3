const getHeadRss = (rss) => {
  const data = {};
  rss.forEach(({ tagName, textContent }) => {
    if (tagName === 'item') {
      return;
    }
    data[tagName] = textContent;
  });
  return data;
};

const getObject = (node) => {
  const { children } = node;
  const obj = {};
  [...children].forEach(({ tagName, textContent }) => {
    obj[tagName] = textContent;
  });
  return obj;
};

const getRssPosts = (items) => {
  const posts = [];
  items.forEach((item) => {
    const post = getObject(item);
    posts.push(post);
  });
  return posts;
};

export default (data) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(data, 'text/xml');
  const { children: rssChannel } = parsedData.querySelector('channel');
  const items = parsedData.querySelectorAll('item');

  const headRss = getHeadRss([...rssChannel]);
  const postsRss = getRssPosts([...items]);
  return { ...headRss, posts: postsRss };
};
