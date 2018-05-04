'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getItems = undefined;

var _unirest = require('unirest');

var _unirest2 = _interopRequireDefault(_unirest);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getItems = exports.getItems = function getItems(ids) {
  return _unirest2.default.get(_config2.default.gwHost + '/items?ids=' + ids);
};