const getHeadRss = (dom) => dom.reduce((acc, node) => {
  const { children, tagName, textContent } = node;
  if (!children.length || tagName === 'item') {
    return { ...acc, [tagName]: textContent };
  }
  return { ...acc, [tagName]: getHeadRss([...children]) };
}, {});

const getRssPosts = (items) => items.map(
  ({ children }) => [...children].reduce(
    (acc, { tagName, textContent }) => ({ ...acc, [tagName]: textContent }), {},
  ),
);

export default (data) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(data, 'text/xml');

  const rss = parsedData.getElementsByTagName('rss');
  const rssItems = parsedData.querySelectorAll('item');

  const headRss = getHeadRss([...rss]);
  const posts = getRssPosts([...rssItems]);

  headRss.rss.channel.item = posts;
  return headRss;
// структура рсс
//  {
//    rss: {
//      channel: {
//        title,
//          item: [{
//            title,
//            link,
//            ...
//          }],
//        ...
//      },
//    },
//  }
};
