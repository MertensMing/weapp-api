'use strict';

const crypto = require('crypto');
const dateFormat = require('dateformat');

module.exports = app => {
  class SignService extends app.Service {
    * getSessionKeyByCode(wxCode) {
      const { ctx } = this;
      const userSessionKey = ctx.get('x-session-key');
      let userInfo = yield this.app.redis.get(userSessionKey);
      let sessionKey = userSessionKey;
      if (!userInfo) {
        userInfo = yield this.getUserInfoByCode(wxCode);
        sessionKey = this.generateSessionId(userInfo.session_key);
        yield this.cacheUserInfo(sessionKey, userInfo);
      } else {
        userInfo = JSON.parse(userInfo);
      }
      const openId = userInfo.openid;
      return {
        sessionKey,
        openId,
      };
    }
    * getUserInfoByCode(code) {
      const result = yield app.curl('https://api.weixin.qq.com/sns/jscode2session', {
        type: 'GET',
        data: {
          grant_type: 'authorization_code',
          appid: 'wxa57a939083b950a7',
          secret: '83fe1f18c4079d8bc00e4aa8bccc1195',
          js_code: code,
        },
      });
      const userInfo = JSON.parse(result.res.data.toString());
      return userInfo;
    }
    * cacheUserInfo(key, value) {
      try {
        const string = JSON.stringify(value);
        yield app.redis.set(key, string, 'EX', 60 * 60 * 24 * 7);
      } catch (err) {
        return null;
      }
    }
    * getUserByOpenId(openId) {
      const result = yield app.mysql.select('user', {
        where: {
          openId,
        },
      });
      if (result.length > 0) {
        return result[0];
      }
      return null;
    }
    * getTeamInfoByTeamId(teamId) {
      const result = yield app.mysql.select('team', {
        where: {
          id: teamId,
        },
      });
      if (result.length > 0) {
        return result[0];
      }
      return null;
    }
    generateSessionId(sessionKey) {
      const secret = 'wxa57a939083b950a7';
      const hash = crypto.createHmac('sha256', secret)
        .update(sessionKey)
        .digest('hex');
      return hash.slice(0, 20);
    }
    * saveUser(openId = '', data = {}) {
      const { uname, nickName, avatarUrl } = data;
      const nowStr = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      const row = {
        openId,
        uname,
        nickName,
        avatarUrl,
        teamId: 0,
        univId: 0,
        createAt: nowStr,
        updateAt: nowStr,
        playerNum: 35,
        enrollment: 2013,
        position: 0,
      };
      const result = yield app.mysql.insert('user', row);
      row.id = result.insertId;
      return row;
    }
  }
  return SignService;
};
