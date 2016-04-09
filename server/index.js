'use strict';

let apiRouter = require('./api');
let koa = require('koa');
let koaCors = require('koa-cors');

let app = koa();

app.use(koaCors({ methods: 'GET' }));

app.use(function* pageNotFound(next) {
  yield next;

  if (this.status != 404) return;

  this.status = 404;
  this.body = 'Invalid request. Usage : /fromLang/toLang/Word. Example : /en/fr/london.';
});

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

module.exports = app;
