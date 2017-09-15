'use strict';

module.exports = appInfo => {
  const config = {};

  config.cluster = {
    listen: {
      port: 9527,
      hostname: '127.0.0.1'
    }  
  };

  // should change to your own
  config.keys = appInfo.name + '_1505502760036_2182';

  // add your config here

  return config;
};
