'use strict';

const qiniu = require('node-qiniu');
const accessKey = 'qRffErplKquwE5_0JS6kQdQ4-oJWi8ZBpmH73MEP';
const secretKey = 'XxeasCERbG7eWynf42W1bRHqaSOghlEM24LQnrsD';
qiniu.config({
  access_key: accessKey,
  secret_key: secretKey,
});

module.exports = appInfo => {
  const config = {};

  config.cluster = {
    listen: {
      port: 9527,
      hostname: '127.0.0.1',
    },
  };

  config.keys = `${appInfo.name}_1505502760036_2182`;

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0,
    },
  };

  config.mysql = {
    client: {
      host: '106.15.194.102',
      port: '3306',
      user: 'root',
      password: 'root',
      database: 'we_app_db',
    },
    app: true, // 是否加载到 app 上，默认开启
    agent: false, // 是否加载到 agent 上，默认关闭
  };

  config.security = {
    csrf: {
      ignoreJSON: true,
      enable: false,
    },
  };

  config.middleware = [ 'auth', 'errorHandler' ];

  return config;
};
