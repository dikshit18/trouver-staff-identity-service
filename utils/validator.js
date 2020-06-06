'use strict';
const Joi = require('@hapi/joi');
/**
 * validateSchema is generic function which will validate requestBody as per schema
 * @param {*} requestBody is request payload
 * @param {*} schema is schema of payload
 */
const validateSchema = (requestBody, schema) => {
  return new Promise((resolve, reject) => {
    Joi.validate(requestBody, schema, err => {
      if (err) {
        //console.log.log(`Validation failed for body : ${JSON.stringify(requestBody)}. Error is ${err}.`);
        reject({
          code: 'schemaError',
          err: err
        });
      } else {
        resolve(true);
      }
    });
  });
};

module.exports = {validateSchema};
