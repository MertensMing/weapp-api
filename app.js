'use strict';

module.exports = app => {
  class CustomController extends app.Controller {
    r(code = 0, data = null, msg = '') {
      this.ctx.body = {
        code,
        data,
        msg,
      };
    }
    * getOpenId() {
      const { ctx } = this;
      const userSessionKey = ctx.get('x-session-key');
      let userInfo = yield this.app.redis.get(userSessionKey);
      userInfo = JSON.parse(userInfo);
      return userInfo.openid;
    }
  }
  app.Controller = CustomController;
};
