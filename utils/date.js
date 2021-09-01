export const getToday = () => {
  const date =  new Date();
  let day = date.getDate();
  if (day.length === 1) day = `0${day}`;
  let month = date.getMonth() + 1;
  if (`${month}`.length === 1) month = `0${month}`;
  return `${day}-${month}-${date.getFullYear()}`;
}
