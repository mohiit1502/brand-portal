# config

This directory contains all the configuration for your application.

The configs are separated into different partials in JSON or JS files.

Depending on the environment, some of these partials are loaded and merged into a single one with [electrode-config].

* `default.js*` and the one referenced by `process.env.NODE_ENV` (default to `development`) will be loaded.
* If your app is running on OneOps (`process.env.ONEOPS_ENVPROFILE` is defined), then `oneops-default.js*` is loaded.
* Base on the value of `process.env.ONEOPS_ENVPROFILE`, `oneops-{{ONEOPS_ENVPROFILE}}.js*` is also loaded.

[electrode-config]: https://gecgithub01.walmart.com/electrode/electrode-config
