'use strict';

const dateFormat = require('dateformat');

module.exports = app => {
  class TeamService extends app.Service {
    * createTeam(data) {
      const team = yield this.insertTeamToDb(data);
      const teamId = team.id;
      const { userId } = data;
      yield this.updateUserInfo(teamId, userId);
      return team;
    }
    * insertTeamToDb(data) {
      const nowStr = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      const row = {
        captainId: data.userId,
        viceCaptainId: 0,
        founderId: data.userId,
        teamName: data.teamName,
        univId: data.univId,
        univName: data.univName,
        logo: '',
        createAt: nowStr,
        updateAt: nowStr,
      };
      const result = yield app.mysql.insert('team', row);
      row.id = result.insertId;
      return row;
    }
    * updateUserInfo(teamId, userId) {
      const row = {
        teamId,
      };
      yield app.mysql.update('user', row, {
        where: {
          id: userId,
        },
      });
    }
    * getTemamateList(teamId) {
      const list = yield app.mysql.select('user', {
        where: {
          teamId,
        },
      });
      return list;
    }
    * getCaptainInfo(captainId, viceCaptainId) {
      function* getInfo(id) {
        const info = yield app.mysql.select('user', {
          where: {
            id,
          },
        });
        if (info.length > 0) {
          return info[0];
        }
        return null;
      }
      const captain = yield getInfo(captainId);
      const viceCaptain = yield getInfo(viceCaptainId);
      return {
        captain,
        viceCaptain,
      };
    }
    * updateTeam(teamId, name, value) {
      const nowStr = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      const row = {
        [name]: value,
        updateAt: nowStr,
      };
      const result = yield app.mysql.update('team', row, {
        where: {
          id: teamId,
        },
      });
      row.id = result.insertId;
      return row;
    }
  }
  return TeamService;
};
