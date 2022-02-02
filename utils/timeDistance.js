module.exports = (date1, date2) => {
  let distance = Math.abs(date1 - date2);
  const hours = Math.floor(distance / 3600000);
  distance -= hours * 3600000;
  const minutes = Math.floor(distance / 60000);
  distance -= minutes * 60000;
  const seconds = Math.floor(distance / 1000);
  return `${('0' + hours).slice(-2)}h:${('0' + minutes).slice(-2)}m:${(
    '0' + seconds
  ).slice(-2)}s`;
};
