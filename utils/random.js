const allCapsAlpha = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
const allLowerAlpha = [...'abcdefghijklmnopqrstuvwxyz'];
const allUniqueChars = [...'~!@#$%^&*()_+-=[]{}|;:\'",./<>?'];
const allNumbers = [...'0123456789'];
const base = [
  ...allCapsAlpha,
  ...allNumbers,
  ...allLowerAlpha,
  ...allUniqueChars,
];

exports.generator = (base, len) => {
  return [...Array(len)]
    .map((i) => base[(Math.random() * base.length) | 0])
    .join('');
};

exports.uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

exports.randomIntBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

exports.randomItem = (arrayOfItems) => {
  return arrayOfItems[Math.floor(Math.random() * arrayOfItems.length)];
};

exports.randomString = (length) => {
  const charset = 'abcdefghijklmnopqrstuvwxyz';
  let res = '';
  while (length--) res += charset[(Math.random() * charset.length) | 0];
  return res;
};
