export const getDataFeaturedBooks = async () => {
  const res = await fetch(`${process.env.NEXT_SERVER_URI}/featuredBooks`);
  const data = await res.json();
  return data;
};


export const getTopWritersData = async () => {
    const res = await fetch(`${process.env.NEXT_SERVER_URI}/authors/top`);
    const data = await res.json()
    return data 
}