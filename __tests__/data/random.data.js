const random = require('../../utils/random');

exports.getRandomString = (count, field, length) => {
  const rndStrs = [];
  let i = 0;
  do {
    i += 1;
    const rndStr = random.randomString(length);
    const fields = {
      fields: {
        input: {
          [field]: rndStr,
        },
      },
    };
    rndStrs.push(fields);
  } while (i < count);
  return rndStrs;
};
