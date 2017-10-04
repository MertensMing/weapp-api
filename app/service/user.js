'use strict';

const dateFormat = require('dateformat');
const qiniu = require('node-qiniu');
const imagesBucket = qiniu.bucket('soccer-weapp');

module.exports = app => {
  class TeamService extends app.Service {
    * uploadImage(name, stream) {
      const puttingStream = imagesBucket.createPutStream(name);
      const reply = yield new Promise((resolve, reject) => {
        stream.pipe(puttingStream)
          .on('error', err => {
            reject(err);
          })
          .on('end', reply => {
            resolve(reply);
          });
      });
      return reply;
    }
    * updateUser(openId, name, value) {
      const nowStr = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      const row = {
        [name]: value,
        updateAt: nowStr,
      };
      const result = yield app.mysql.update('user', row, {
        where: {
          openId,
        },
      });
      row.id = result.insertId;
      return row;
    }
  }
  return TeamService;
};
