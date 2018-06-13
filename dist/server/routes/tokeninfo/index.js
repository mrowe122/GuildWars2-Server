'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', request);

function request(req, res) {
  _fs2.default.readFile('./userDb/apiKey', 'utf8', function (err, data) {
    if (err) {
      res.status(401).send('no api key stored');
    } else {
      res.send({ body: JSON.parse(data) });
    }
  });
}

exports.default = router;