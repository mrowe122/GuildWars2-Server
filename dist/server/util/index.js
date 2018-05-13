'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeEquipment = undefined;

var _fp = require('lodash/fp');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var mergeEquipment = function mergeEquipment(data, ids) {
  return new Promise(function (resolve) {
    var itemIdKey = (0, _fp.keyBy)('id')(ids[0].body);
    var skinIdKey = (0, _fp.keyBy)('id')(ids[1].body);
    var equipment = (0, _fp.flatMap)(function (_ref) {
      var _ref$infusions = _ref.infusions,
          infusions = _ref$infusions === undefined ? [] : _ref$infusions,
          _ref$upgrades = _ref.upgrades,
          upgrades = _ref$upgrades === undefined ? [] : _ref$upgrades,
          _ref$skin = _ref.skin,
          skin = _ref$skin === undefined ? null : _ref$skin,
          e = _objectWithoutProperties(_ref, ['infusions', 'upgrades', 'skin']);

      return (0, _fp.assign)(e, {
        data: itemIdKey[e.id],
        infusions: infusions.map(function (i) {
          return itemIdKey[i];
        }),
        upgrades: upgrades.map(function (u) {
          return itemIdKey[u];
        }),
        skin: skinIdKey[skin]
      });
    })(data.equipment);
    resolve((0, _fp.assign)(data, { equipment: (0, _fp.keyBy)('slot')(equipment) }));
  });
};
exports.mergeEquipment = mergeEquipment;