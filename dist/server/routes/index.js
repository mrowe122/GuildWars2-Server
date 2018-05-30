'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _characters = require('./characters');

var _characters2 = _interopRequireDefault(_characters);

var _authentication = require('./authentication');

var _authentication2 = _interopRequireDefault(_authentication);

var _tokeninfo = require('./tokeninfo');

var _tokeninfo2 = _interopRequireDefault(_tokeninfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var enableCors = function enableCors(req, res, next) {
  res.set('Cache-Control', 'no-store, must-revalidate, no-cache');
  res.set('Pragma', 'no-cache');
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  next();
};

router.use(enableCors);

router.use('/characters', _characters2.default);
// TODO: The entirety of this authentication is temporary
router.use('/authenticate', _authentication2.default);
router.use('/tokeninfo', _tokeninfo2.default);

exports.default = router;