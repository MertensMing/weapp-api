'use strict';

const ERROR = require('../../config/error');

module.exports = () => {
  return function* (next) {
    try {
      yield next;
    } catch (err) {
      if (ERROR[err.message]) {
        const detail = ERROR[err.message];

        console.error('错误码 ===>', detail[0], '错误信息 ===>', detail[1]);

        this.status = 200;
        this.body = {
          code: detail[0],
          msg: detail[1],
        };
      } else {
        const status = err.status || 500;
        const error = (status === 500 && this.app.config.env === 'prod') ? 'Internal Server Error' : err.message;
        const res = {
          error,
        };

        if (status === 422) {
          res.detail = err.errors;
        }

        console.error('未定义错误 ===>', err.message);

        this.status = status;
        this.body = res;
      }
    }
  };
};
