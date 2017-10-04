'use strict';

const fs = require('fs');
const path = require('path');
const school = fs.readFileSync(path.resolve(__dirname, '../public/school.json'), 'utf8');

module.exports = app => {
  class TeamController extends app.Controller {
    * school() {
      let result = `{ "provs": ${school} }`;
      result = JSON.parse(result);
      this.r(0, result);
    }
    * create() {
      const { ctx } = this;
      const data = ctx.request.body;
      const team = yield ctx.service.team.createTeam(data);
      this.r(0, team);
    }
    * temamate() {
      const { ctx } = this;
      const { teamId } = ctx.request.query;
      const list = yield ctx.service.team.getTemamateList(teamId);
      this.r(0, { list });
    }
    * captainInfo() {
      const { ctx } = this;
      const { captainId, viceCaptainId } = ctx.request.query;
      const info = yield ctx.service.team.getCaptainInfo(captainId, viceCaptainId);
      this.r(0, info);
    }
    * update() {
      const { ctx } = this;
      const { name, value, teamId } = ctx.request.body;
      yield ctx.service.team.updateTeam(teamId, name, value);
      this.r(0, value);
    }
  }
  return TeamController;
};
