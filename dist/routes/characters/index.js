'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _unirest = require('unirest');

var _unirest2 = _interopRequireDefault(_unirest);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', request).get('/:id', charData);

function request(req, res) {
  _unirest2.default.get(_config2.default.gwHost + '/characters' + req.url)
  //TODO client will not be sending api key. Implement Database
  .headers({ Authorization: 'Bearer ' + req.query.access_token }).end(function (data) {
    return res.send(data);
  });
}

function charData(req, res) {
  _unirest2.default.get(_config2.default.gwHost + '/characters' + req.url)
  //TODO client will not be sending api key. Implement Database
  .headers({ Authorization: 'Bearer ' + req.query.access_token }).end(function (data) {
    return res.send(data);
  });
}

exports.default = router;