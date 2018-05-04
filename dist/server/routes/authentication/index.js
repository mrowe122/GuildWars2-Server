'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _unirest = require('unirest');

var _unirest2 = _interopRequireDefault(_unirest);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/', createAccount);

function createAccount(req, res) {
  var user = JSON.stringify(req.body);
  if (!_fs2.default.existsSync('userDb')) {
    _fs2.default.mkdirSync('userDb');
  }
  _fs2.default.writeFile('./userDb/user', user, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send('User Created');
  });
}

exports.default = router;