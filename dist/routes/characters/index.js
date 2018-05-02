'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _unirest = require('unirest');

var _unirest2 = _interopRequireDefault(_unirest);

var _config = require('../../../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', request).get('/:id', charData);

function request(req, res) {
  _unirest2.default.get(_config.gwHost + '/characters' + req.url).headers({ Authorization: 'Bearer ' + _config.key }).end(function (data) {
    return res.json(data);
  });
}

function charData(req, res) {
  _unirest2.default.get(_config.gwHost + '/characters' + req.url).headers({ Authorization: 'Bearer ' + _config.key }).end(function (data) {
    res.json(data);
  });
}

exports.default = router;