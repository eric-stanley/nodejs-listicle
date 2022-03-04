const random = require('../../utils/random');

exports.getRandomRoles = (numOfRoles) => {
  const roles = [];
  let i = 0;
  do {
    i += 1;
    const description = random.randomString(10);
    const role = {
      fields: {
        input: {
          description: description,
        },
      },
    };
    roles.push(role);
  } while (i < numOfRoles);
  return roles;
};
