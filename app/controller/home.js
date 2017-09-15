'use strict';

module.exports = app => {
  class HomeController extends app.Controller {
    * index() {
      this.ctx.body = {
        code: 0,
        data: 'hello my first wx app'
      };
    }
  }
  return HomeController;
};
