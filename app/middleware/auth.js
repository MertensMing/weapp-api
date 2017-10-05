'use strict';

module.exports = () => {
  return function* (next) {
    const ignore = matchPath(this.path);
    const sessionKey = this.get('x-session-key');
    const user = yield this.app.redis.get(sessionKey);
    if (ignore) {
      yield next;
    } else if (user) {
      this.app.redis.set(sessionKey, user, 'EX', 60 * 60 * 24 * 7);
      yield next;
    } else {
      this.body = {
        code: 10000,
        msg: '无法取到用户的 openid',
      };
    }
  };
  function matchPath(nowPath) {
    const paths = [
      /\/vertify$/,
    ];
    for (const path of paths) {
      const isMatch = new RegExp(path).test(nowPath.replace(/\?.*/g, ''));
      if (isMatch) {
        return true;
      }
    }
    return false;
  }
};
