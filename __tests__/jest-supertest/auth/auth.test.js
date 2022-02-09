const { supertest } = require('../../testHelper');

const request = supertest(process.env.MONGO_LOCAL_CON_STR);

//This piece of code is for getting the authorization token after login to your app.
test('Login to the application', () => console.log(request));

module.exports = {
  request,
};
