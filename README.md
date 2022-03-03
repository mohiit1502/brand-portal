# brand-portal   [![Quality Gate Status](https://sonar.wal-mart.com/api/project_badges/measure?branch=dev%2FsonarIntegration&project=brand-portal&metric=alert_status)](https://sonar.wal-mart.com/dashboard?id=brand-portal&branch=dev%2FsonarIntegration)      [![Build Status](https://ci.electrode.walmart.com/buildStatus/icon?job=0-github-org-RET-Marketplace%2Fropro-brandportal)](https://ci.electrode.walmart.com/job/0-github-org-RET-Marketplace/job/ropro-brandportal/)

> IP Dispute Portal for Brands

## Installation

```sh
$ npm install --save brand-portal
```
## Usage

```js
var roPro = require("brand-portal");

roPro("Rainbow");
```

## Dev Setup
```
Procure secrets.json file, and application pem certificate file

Update following files:

- default.json -> Change services.privateKey.file path from /secrets to a local path where application pem certificate is stored.
- server-constants.js -> Change PATH: "/secrets/secrets.json" to a local path where application secrets file is stored.

Run 'npm run dev' or navigate to package.json and use IDEs built in runners for 'dev' script  
```

## License

 © [Walmart Brand Portal]()

[npm-image]: https://badge.fury.io/js/RoPro.svg
[npm-url]: https://npmjs.org/package/RoPro
[travis-image]: https://travis-ci.org//RoPro.svg?branch=master
[travis-url]: https://travis-ci.org//RoPro
[daviddm-image]: https://david-dm.org//RoPro.svg?theme=shields.io
[daviddm-url]: https://david-dm.org//RoPro
