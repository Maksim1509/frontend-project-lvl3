const getHeadRss = (rss) => rss
  .reduce((acc, { tagName, textContent }) => (
    tagName === 'item' ? acc : { ...acc, [tagName]: textContent }
  ), {});

const getRssPosts = (items) => items.map(
  ({ children }) => [...children].reduce(
    (acc, { tagName, textContent }) => ({ ...acc, [tagName]: textContent }), {},
  ),
);

export default (data) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(data, 'text/xml');

  const { children: rssChannel } = parsedData.querySelector('channel');
  const rssItems = parsedData.querySelectorAll('item');

  const headRss = getHeadRss([...rssChannel]);
  const posts = getRssPosts([...rssItems]);
  return { ...headRss, posts };
};
