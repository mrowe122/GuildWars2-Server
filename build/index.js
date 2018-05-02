#!/usr/bin/env node

'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.use('/api', _routes2.default);

app.listen(_config.port);
console.log('Express router listening on port: ' + _config.port);