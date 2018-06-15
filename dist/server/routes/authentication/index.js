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

var UUID = function UUID() {
  var dt = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
};

router.post('/create', createAccount).post('/', authenticate);

function createAccount(req, res) {
  var user = {
    password: req.body.password
  };
  var id = UUID();

  _fs2.default.writeFile('./userDb/users/' + req.body.user, JSON.stringify(user), 'utf8', function (err) {
    if (err) {
      return res.status(500).send(err);
    }

    var session = {
      user: req.body.user
    };
    _fs2.default.writeFile('./userDb/sessions/' + id, JSON.stringify(session), 'utf8', function (err) {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(201).send(id);
    });
  });
}

function authenticate(req, res) {
  _fs2.default.readFile('./userDb/users/' + req.body.user, 'utf8', function (err, file) {
    if (err) {
      res.status(404).send('user does not exist');
    } else {
      var user = JSON.parse(file);
      if (user.password === req.body.password) {
        var id = UUID();
        var session = {
          user: req.body.user
        };
        _fs2.default.writeFile('./userDb/sessions/' + id, JSON.stringify(session), 'utf8', function (err) {
          if (err) {
            return res.status(500).send(err);
          }
          return res.status(200).send(id);
        });
      } else {
        res.status(403).send('password did not match');
      }
    }
  });
}

exports.default = router;