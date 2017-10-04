'use strict';

module.exports = app => {
  app.post('/vertify', 'auth.vertify');
  app.get('/csrf', 'auth.csrf');
  app.get('/school', 'team.school');
  app.post('/team/create', 'team.create');
  app.get('/temamate/list', 'team.temamate');
  app.post('/register', 'auth.register');
  app.post('/user/upload', 'user.upload');
  app.put('/user/update', 'user.update');
  app.get('/team/captain', 'team.captainInfo');
  app.put('/team/update', 'team.update');
};
