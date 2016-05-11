"use strict";

var koa = require('koa')();
var router = require('koa-router');
var mount = require('koa-mount');
var logger = require('koa-logger');
var jsonBody = require('koa-json-body');
var api = require('./api.js');

var apiv1 = new router()
  .post('/all', jsonBody(), api.all)
  .post('/merge', jsonBody(), api.all, api.merge);

koa
  .use(logger())
  .use(function *(next) {
    yield next;

    if (this.status !== 404) {
      return false;
    }
    this.status = 404;
    this.body = 'whoops';
  })
  .use(mount('/v1', apiv1.middleware()))
  .listen(1338);