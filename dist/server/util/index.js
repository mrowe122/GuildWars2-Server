'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeEquipmentIds = undefined;

var _fp = require('lodash/fp');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var mergeEquipmentIds = function mergeEquipmentIds(data, ids) {
  return new Promise(function (resolve) {
    var idKey = (0, _fp.keyBy)('id')(ids);
    var equipment = (0, _fp.flatMap)(function (_ref) {
      var _ref$infusions = _ref.infusions,
          infusions = _ref$infusions === undefined ? [] : _ref$infusions,
          _ref$upgrades = _ref.upgrades,
          upgrades = _ref$upgrades === undefined ? [] : _ref$upgrades,
          e = _objectWithoutProperties(_ref, ['infusions', 'upgrades']);

      return (0, _fp.assign)(e, { data: idKey[e.id], infusions: infusions.map(function (i) {
          return idKey[i];
        }), upgrades: upgrades.map(function (u) {
          return idKey[u];
        }) });
    })(data.equipment);
    resolve((0, _fp.assign)(data, { equipment: (0, _fp.keyBy)('slot')(equipment) }));
  });
};
exports.mergeEquipmentIds = mergeEquipmentIds;