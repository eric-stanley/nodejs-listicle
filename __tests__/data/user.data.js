const genUsername = require('unique-username-generator');
const random = require('../../utils/random');

exports.users = [
  {
    fields: {
      input: {
        username: 'monsterup',
        password: 'JhvG6821*',
        password_confirm: 'JhvG6821*',
        email: 'monsterup@test.com',
      },
    },
  },
  {
    fields: {
      input: {
        username: 'fuzzyspuffy',
        password: 'EnoB6533+',
        password_confirm: 'EnoB6533+',
        email: 'fuzzyspuffy@test.com',
      },
    },
  },
  {
    fields: {
      input: {
        username: 'milka1baby',
        password: 'DgfD3659+',
        password_confirm: 'DgfD3659+',
        email: 'milka1baby@test.com',
      },
    },
  },
  {
    fields: {
      input: {
        password: 'password',
        email: 'admin@test.com',
      },
    },
  },
];

exports.getRandomUsers = (numOfSignups) => {
  const users = [];
  let i = 0;
  do {
    i += 1;
    const username = genUsername.generateUsername();
    const password = random.randomString(10);
    const user = {
      fields: {
        input: {
          username: username,
          password: password,
          password_confirm: password,
          email: username + '@test.com',
        },
      },
    };
    users.push(user);
  } while (i < numOfSignups);
  return users;
};
