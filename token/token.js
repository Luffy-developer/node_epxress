var jwt = require('jsonwebtoken');

var jwtScrect = 'first_token';

var setToken = function (user_name, id) {
  return new Promise((resolve, reject) => {
    const token = jwt.sign({
      user_name: user_name,
      id: id
    }, jwtScrect, {
      expiresIn: '1h'
    });
    resolve(token)
  })
}

var getToken = function (token) {
  return new Promise((resolve, reject) => {
    if (!token) {
      console.log('token为空');
      reject({
        error: 'token为空'
      })
    } else {
      var info = jwt.verify(token.split(' ')[1], jwtScrect);
      resolve(info);
    }
  })
}

module.exports = {
  setToken,
  getToken
}