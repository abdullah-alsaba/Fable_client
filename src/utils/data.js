export const getDataFeaturedBooks = async () => {
  const res = await fetch(`${process.env.NEXT_SERVER_URI}/featuredBooks`);
  const data = await res.json();
  return data;
};