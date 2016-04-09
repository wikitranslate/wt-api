'use strict';

let _ = require('lodash');
let koaRouter = require('koa-router');
let wt = require('wikitranslate');

let router = koaRouter();

router.get('/langs', function* listLangs() {
  this.body = wt.langs;
});

router.get('/:fromLang/:toLang/:input',
  function* log(next) {
    yield next;

    let count = _(this.body).values().flatten().size();

    console.log(`Found ${count} translations for "${this.params.input}" (${this.params.fromLang} -> ${this.params.toLang}).`);
  },
  function* translate() {
    try {
      this.body = yield wt(this.params.input, this.params.fromLang, this.params.toLang);
    }
    catch (err) {
      this.throw(400, err);
    }
  }
);

module.exports = router;
