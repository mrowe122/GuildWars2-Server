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

var _fp = require('lodash/fp');

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _lib = require('../../lib');

var _util = require('../../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

router.get('/', request).get('/:id', charData);

function request(req, res) {
  _unirest2.default.get(_config2.default.gwHost + '/characters').headers({ Authorization: 'Bearer ' + req.apiKey }).end(function (data) {
    if (data.ok) {
      return res.send({ body: data.body, statusCode: data.statusCode });
    } else {
      return res.status(data.statusCode).send(data.body);
    }
  });
}

function charData(req, res) {
  _unirest2.default.get(_config2.default.gwHost + '/characters' + req.url).headers({ Authorization: 'Bearer ' + req.apiKey }).end(function (data) {
    if (!data.ok) {
      return res.status(data.statusCode).send(data.body);
    }
    var itemsId = (0, _fp.flatMap)(function (_ref) {
      var id = _ref.id,
          _ref$infusions = _ref.infusions,
          infusions = _ref$infusions === undefined ? [] : _ref$infusions,
          _ref$upgrades = _ref.upgrades,
          upgrades = _ref$upgrades === undefined ? [] : _ref$upgrades;
      return [id].concat(_toConsumableArray(infusions), _toConsumableArray(upgrades));
    })(data.body.equipment);
    var skinIds = (0, _fp.map)((0, _fp.get)('skin'))(data.body.equipment);
    var specializationIds = (0, _fp.flatMap)((0, _fp.map)((0, _fp.get)('id')))(data.body.specializations);
    return Promise.all([(0, _lib.getItems)(itemsId), (0, _lib.getSkins)(skinIds), (0, _lib.getGuild)(data.body.guild), (0, _lib.getSpecializations)(specializationIds)]).then((0, _util.parseData)(data.body)).then(function (merged) {
      return res.send({ body: merged, statusCode: data.statusCode });
    });
  });
}

exports.default = router;