'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGuild = exports.getSkins = exports.getItems = undefined;

var _unirest = require('unirest');

var _unirest2 = _interopRequireDefault(_unirest);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getItems = exports.getItems = function getItems(ids) {
  return new Promise(function (resolve) {
    _unirest2.default.get(_config2.default.gwHost + '/items?ids=' + ids).end(function (data) {
      // check if errors
      resolve(data);
    });
  });
};

var getSkins = exports.getSkins = function getSkins(ids) {
  return new Promise(function (resolve) {
    _unirest2.default.get(_config2.default.gwHost + '/skins?ids=' + ids).end(function (data) {
      // check if errors
      resolve(data);
    });
  });
};

var getGuild = exports.getGuild = function getGuild(id) {
  return new Promise(function (resolve) {
    _unirest2.default.get(_config2.default.gwHost + '/guild/' + id).end(function (data) {
      // check if errors
      resolve(data);
    });
  });
};