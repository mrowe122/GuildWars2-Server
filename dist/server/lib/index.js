'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApiKey = exports.checkToken = exports.getSpecializations = exports.getGuild = exports.getSkins = exports.getItems = undefined;

var _unirest = require('unirest');

var _unirest2 = _interopRequireDefault(_unirest);

var _firebaseAdmin = require('firebase-admin');

var admin = _interopRequireWildcard(_firebaseAdmin);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getItems = exports.getItems = function getItems(ids) {
  return new Promise(function (resolve) {
    _unirest2.default.get(_config2.default.gwHost + '/items?ids=' + ids).end(function (data) {
      return resolve(data);
    });
  });
};

var getSkins = exports.getSkins = function getSkins(ids) {
  return new Promise(function (resolve) {
    _unirest2.default.get(_config2.default.gwHost + '/skins?ids=' + ids).end(function (data) {
      return resolve(data);
    });
  });
};

var getGuild = exports.getGuild = function getGuild(id) {
  return new Promise(function (resolve) {
    _unirest2.default.get(_config2.default.gwHost + '/guild/' + id).end(function (data) {
      return resolve(data);
    });
  });
};

var getSpecializations = exports.getSpecializations = function getSpecializations(ids) {
  return new Promise(function (resolve) {
    _unirest2.default.get(_config2.default.gwHost + '/specializations?ids=' + ids).end(function (data) {
      return resolve(data);
    });
  });
};

var checkToken = exports.checkToken = function checkToken(req, res, next) {
  var token = req.body.token || req.query.token;
  admin.auth().verifyIdToken(token).then(function (decodedToken) {
    req.uid = decodedToken.uid;
    next();
  }).catch(function (err) {
    console.log(err);
    res.sendStatus(500);
  });
};

var getApiKey = exports.getApiKey = function getApiKey(req, res, next) {
  admin.database().ref('users/' + req.uid).once('value').then(function (snapshot) {
    var uuid = snapshot.val().apiKey;
    if (uuid) {
      req.apiKey = uuid;
      next();
    } else {
      res.status(403).send({ message: 'No Api Key' });
    }
  });
};