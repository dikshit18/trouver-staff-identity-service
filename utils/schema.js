const Joi = require('@hapi/joi');
const JoiGuidV4 = Joi.string().guid({version: ['uuidv4']});

const schema = (() => {
  return {
    signUpSchema: Joi.object()
      .keys({
        email: Joi.string()
          .email()
          .required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required()
      })
      .unknown(false),

    logInSchema: Joi.object()
      .keys({
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string().required()
      })
      .unknown(false),

    changePasswordSchema: Joi.object()
      .keys({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required(),
        sessionId: JoiGuidV4.required()
      })
      .unknown(false),
    logoutSchema: Joi.object()
      .keys({
        sessionId: JoiGuidV4.required()
      })
      .unknown(false),
    validateToken: Joi.object()
      .keys({
        token: Joi.string().required()
      })
      .unknown(false),
    confirmUser: Joi.object()
      .keys({
        token: Joi.string().required(),
        password: Joi.string().required()
      })
      .unknown(false),
    disableUser: Joi.object()
      .keys({
        identityId: JoiGuidV4.required()
      })
      .unknown(false)
  };
})();

module.exports = {schema};
