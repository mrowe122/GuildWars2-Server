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

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/', createAccount);

function createAccount(req, res) {
  _unirest2.default.get(_config2.default.gwHost + '/tokeninfo').headers({ Authorization: 'Bearer ' + req.body.apiKey }).end(function (data) {
    if (data.ok) {
      var _token = JSON.stringify(data.body);
      if (!_fs2.default.existsSync('userDb')) {
        _fs2.default.mkdirSync('userDb');
      }
      _fs2.default.writeFile('./userDb/apiKey', _token, function (err) {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).send(data.body);
      });
    } else {
      res.status(403).send(data.body);
    }
  });
}

exports.default = router;