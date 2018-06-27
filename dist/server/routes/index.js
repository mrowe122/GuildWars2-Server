'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _characters = require('./characters');

var _characters2 = _interopRequireDefault(_characters);

var _tokeninfo = require('./tokeninfo');

var _tokeninfo2 = _interopRequireDefault(_tokeninfo);

var _permissions = require('./permissions');

var _permissions2 = _interopRequireDefault(_permissions);

var _lib = require('../lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var enableCors = function enableCors(req, res, next) {
  res.set('Cache-Control', 'no-store, must-revalidate, no-cache');
  res.set('Pragma', 'no-cache');
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  next();
};

router.use(enableCors).use(_lib.checkToken).use('/tokeninfo', _tokeninfo2.default).use(_lib.getApiKey).use('/characters', _characters2.default).use('/permissions', _permissions2.default);

exports.default = router;