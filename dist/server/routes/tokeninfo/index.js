'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _unirest = require('unirest');

var _unirest2 = _interopRequireDefault(_unirest);

var _util = require('../../util');

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.use('/', _util.checkSession).post('/', addToken);

function addToken(req, res) {
  _unirest2.default.get(_config2.default.gwHost + '/tokeninfo').headers({ Authorization: 'Bearer ' + req.body.apiKey }).end(function (data) {
    if (data.ok) {
      _fs2.default.readFile('./userDb/users/' + req.user.username, 'utf8', function (err, file) {
        if (err) {
          return res.status(500).send(err);
        }
        var user = JSON.parse(file);
        user.tokenInfo = data.body;
        user.apiKey = req.body.apiKey;
        _fs2.default.writeFile('./userDb/users/' + req.user.username, JSON.stringify(user), 'utf8', function (err) {
          if (err) {
            return res.status(500).send(err);
          }

          return res.status(200).send({ apiKey: req.body.apiKey, permissions: user.tokenInfo });
        });
      });
    } else {
      res.status(403).send(data.body);
    }
  });
}

exports.default = router;