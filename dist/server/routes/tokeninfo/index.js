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

router.use(function (req, res, next) {
  _fs2.default.readFile('./userDb/apiKey', 'utf8', function (err, data) {
    if (err) {
      res.status(401).send('no api key stored');
    } else {
      req.apiKey = JSON.parse(data).apiKey;
      next();
    }
  });
});

router.get('/', request);

function request(req, res) {
  _unirest2.default.get(_config2.default.gwHost + '/tokeninfo').headers({ Authorization: 'Bearer ' + req.apiKey }).end(function (data) {
    if (data.ok) {
      return res.send({ body: data.body, statusCode: data.statusCode });
    } else {
      return res.status(data.statusCode).send(data.body);
    }
  });
}

exports.default = router;