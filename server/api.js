const koaRouter = require('koa-router');
const wt = require('wikitranslate');

const router = koaRouter();

router.get('/langs', function* listLangs() {
  this.body = wt.langs;
});

router.get('/:fromLang/:toLang/:input',
  function* log(next) {
    yield next;

    const count = Object
      .keys(this.body)
      .map(key => this.body[key])
      .reduce((acc, a) => acc + a.length, 0);

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
