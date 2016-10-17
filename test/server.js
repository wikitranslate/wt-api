const chai = require('chai');
const server = require('../server/server');

chai.use(require('chai-http'));

const expect = chai.expect;

describe('WikiTranslate API', function () {
  // Wikipedia API is sometimes a bit picky.
  this.timeout(5000);

  it('should translate words', () => {
    return chai.request(server)
    .get('/fr/en/Potentiel électrique')
    .then((res) => {
      expect(res).to.have.status(200);

      expect(res.body).to.be.an('object');
      expect(res.body).to.contain.keys('wikipedia');
      expect(res.body.wikipedia).to.be.an('array');
      expect(res.body.wikipedia[0]).to.equal('Electric potential');
    });
  });

  it('should refuse malformed urls', () => {
    return chai.request(server)
    .get('/fr/Aimantation')
    .then(() => {
      throw new Error('Did not return an error :(');
    }, (err) => {
      expect(err).to.have.status(404);
      expect(err.response.text).to.contain('Usage');
    });
  });

  it('should return an error when the destination language does not exist', () => {
    return chai.request(server)
    .get('/fr/jp/Ferromagnétisme')
    .then(() => {
      throw new Error('Did not return an error :(');
    }, (err) => {
      expect(err).to.have.status(400);
      expect(err.response.text).to.equal('"jp" is not a valid language.');
    });
  });

  it('should return an error when the origin language does not exist', () => {
    return chai.request(server)
    .get('/po/fr/Ferromagnétisme')
    .then(() => {
      throw new Error('Did not return an error :(');
    }, (err) => {
      expect(err).to.have.status(400);
      expect(err.response.text).to.equal('"po" is not a valid language.');
    });
  });

  it('should provide CORS headers', () => {
    return chai.request(server)
    .get('/fr/en/Ferromagnétisme')
    .then((res) => {
      expect(res).to.have.status(200);

      expect(res.headers).to.contain.keys('access-control-allow-origin', 'access-control-allow-methods');
      expect(res.headers['access-control-allow-origin']).to.equal('*');
      expect(res.headers['access-control-allow-methods']).to.equal('GET');
    });
  });

  it('should return a lsit of supported languages', () => {
    return chai.request(server)
    .get('/langs')
    .then((res) => {
      expect(res).to.have.status(200);

      expect(res.body).to.be.an('array');
      expect(res.body).to.contain('fr', 'en');
    });
  });
});
