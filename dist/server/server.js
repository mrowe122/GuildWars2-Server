'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var start = function start() {
  app.use(_bodyParser2.default.urlencoded({ extended: false }));
  app.use(_bodyParser2.default.json());

  app.use('/api', _routes2.default);
  app.listen(_config2.default.port, function () {
    console.log('Express router listening on port: ' + _config2.default.port);
    if (!_fs2.default.existsSync('userDb')) {
      _fs2.default.mkdir('userDb', function () {
        _fs2.default.mkdir('userDb/users', function () {
          console.log('created users db');
        });
        _fs2.default.mkdir('userDb/sessions', function () {
          console.log('created sessions db');
        });
      });
    }
  });
};

exports.default = start;