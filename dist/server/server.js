'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _firebaseAdmin = require('firebase-admin');

var admin = _interopRequireWildcard(_firebaseAdmin);

var _serviceAccountKey = require('../serviceAccountKey.json');

var _serviceAccountKey2 = _interopRequireDefault(_serviceAccountKey);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var start = function start() {
  admin.initializeApp({
    credential: admin.credential.cert(_serviceAccountKey2.default),
    databaseURL: 'https://gw2tracker-d615c.firebaseio.com'
  });

  app.use(_bodyParser2.default.urlencoded({ extended: false }));
  app.use(_bodyParser2.default.json());

  app.use('/api', _routes2.default);
  app.listen(_config2.default.port, function () {
    console.log('Express router listening on port: ' + _config2.default.port);
  });
};

exports.default = start;