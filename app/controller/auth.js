'use strict';

module.exports = app => {
  class AuthController extends app.Controller {
    * vertify() {
      const { ctx } = this;
      const { wxCode } = ctx.request.body;
      const authService = ctx.service.auth;
      const result = yield authService.getSessionKeyByCode(wxCode);
      const sessionKey = result.sessionKey;
      const openId = result.openId;
      const user = yield authService.getUserByOpenId(openId);
      let team = null;
      if (user) {
        const teamId = user.teamId;
        team = yield authService.getTeamInfoByTeamId(teamId);
      }
      this.r(0, {
        sessionKey,
        user,
        team,
      });
    }
    * csrf() {
      this.r(0, this.ctx.csrf);
    }
    * register() {
      const { ctx } = this;
      const data = ctx.request.body;
      const authService = ctx.service.auth;
      const openId = yield this.getOpenId();
      const user = yield authService.saveUser(openId, data);
      this.r(0, user);
    }
  }
  return AuthController;
};
