const wt = require('wikitranslate')

module.exports.translate = (event, context, cb) => {
  const params = event.path

  return wt(params.input, params.fromLang, params.toLang)
  .then(translation => cb(null, translation))
  .catch(err => cb(err))
}

module.exports.langs = (event, context, cb) => {
  cb(null, {
    langs: wt.langs
  })
}
