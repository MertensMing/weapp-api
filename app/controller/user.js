'use strict';

module.exports = app => {
  class UserController extends app.Controller {
    * upload() {
      const { ctx } = this;
      const stream = yield ctx.getFileStream();
      const name = `weapp/img_${Date.now()}`;
      const reply = yield ctx.service.user.uploadImage(name, stream);
      if (reply.key) {
        ctx.body = reply.key;
      } else {
        ctx.body = reply.key;
      }
    }
    * update() {
      const { ctx } = this;
      const { name, value } = ctx.request.body;
      const openId = yield this.getOpenId();
      yield ctx.service.user.updateUser(openId, name, value);
      this.r(0, value);
    }
  }
  return UserController;
};
