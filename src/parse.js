export default (data) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(data, 'text/xml');
  const title = parsedData.querySelector('title').textContent;
  const discription = parsedData.querySelector('description').textContent;
  const posts = parsedData.querySelectorAll('item');
  const postContents = [...posts].map((post) => {
    const titlePost = post.querySelector('title').textContent;
    const link = post.querySelector('link').textContent;
    return { titlePost, link };
  });
  return [{ title, discription }, postContents];
};
