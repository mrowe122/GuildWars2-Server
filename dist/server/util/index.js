'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseData = undefined;

var _fp = require('lodash/fp');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var parseData = exports.parseData = function parseData(data, ids) {
  return Promise.all([mergeEquipment(data.equipment, [ids[0].body, ids[1].body]), guildEmblem(ids[2].body), mergeSpecialization(data.specializations, ids[3].body)]).then(function (parsedData) {
    return (0, _fp.assignAll)([data].concat(_toConsumableArray(parsedData)));
  });
};

var mergeEquipment = function mergeEquipment(data, ids) {
  return new Promise(function (resolve) {
    var _itemIdKey = (0, _fp.keyBy)('id')(ids[0]);
    var _skinIdKey = (0, _fp.keyBy)('id')(ids[1]);
    var _equipment = (0, _fp.flatMap)(function (_ref) {
      var _ref$infusions = _ref.infusions,
          infusions = _ref$infusions === undefined ? [] : _ref$infusions,
          _ref$upgrades = _ref.upgrades,
          upgrades = _ref$upgrades === undefined ? [] : _ref$upgrades,
          _ref$skin = _ref.skin,
          skin = _ref$skin === undefined ? null : _ref$skin,
          e = _objectWithoutProperties(_ref, ['infusions', 'upgrades', 'skin']);

      return (0, _fp.assign)(e, {
        data: _itemIdKey[e.id],
        infusions: infusions.map(function (i) {
          return _itemIdKey[i];
        }),
        upgrades: upgrades.map(function (u) {
          return _itemIdKey[u];
        }),
        skin: _skinIdKey[skin]
      });
    })(data);
    resolve({ equipment: (0, _fp.keyBy)('slot')(_equipment) });
  });
};

var guildEmblem = function guildEmblem(data) {
  return new Promise(function (resolve) {
    return resolve({ guild: data });
  });
};

var mergeSpecialization = function mergeSpecialization(data, ids) {
  return new Promise(function (resolve) {
    var _itemIdKey = (0, _fp.keyBy)('id')(ids);
    var _specialization = (0, _fp.mapValues)((0, _fp.map)(function (s) {
      return s ? (0, _fp.assign)(s, { data: _itemIdKey[s.id] }) : null;
    }))(data);
    resolve({ specializations: _specialization });
  });
};