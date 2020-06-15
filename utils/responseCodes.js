const successCodes = {
  signUpSuccess: {
    code: 101,
    statusCode: 201
  },
  logInSuccess: {
    code: 102,
    statusCode: 200
  },
  changePasswordSuccess: {
    code: 103,
    statusCode: 200
  },
  forgotPasswordSuccess: {
    code: 104,
    statusCode: 200
  },
  sessionValid: {
    code: 105,
    statusCode: 200
  },
  logoutSuccess: {
    code: 106,
    statusCode: 200
  },
  tokenValid: {
    code: 107,
    statusCode: 200
  },
  setPasswordSuccess: {
    code: 108,
    statusCode: 200
  },
  disableUserSuccess: {
    code: 109,
    statusCode: 200
  },
  getAllUserSuccess: {
    code: 110,
    statusCode: 200
  },
  detailsSuccess: {
    code: 111,
    statusCode: 200
  }
};

const errorCodes = {
  default: {
    statusCode: 500,
    code: 151
  },
  joi: {
    statusCode: 400,
    code: 152
  },
  userNotFound: {
    statusCode: 404,
    code: 153
  },
  userAlreadyExists: {
    statusCode: 400,
    code: 154
  },
  sessionInvalid: {
    statusCode: 401,
    code: 155
  },
  changePasswordFailed: {
    statusCode: 400,
    code: 156
  },
  tokenInvalid: {
    statusCode: 400,
    code: 157
  },
  tokenExpired: {
    statusCode: 400,
    code: 158
  },
  setPasswordFailed: {
    statusCode: 400,
    code: 159
  },
  disableUserFailed: {
    statusCode: 400,
    code: 160
  },
  detailsFailed: {
    statusCode: 400,
    code: 161
  }
};
module.exports = {errorCodes, successCodes};
