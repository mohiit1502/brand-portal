/*
 * Tell Electrode app archetype that you want to use ES6 syntax in your server code
 */

process.env.SERVER_ES6 = true;

/*
 * Tell Electrode app archetype that you want to use webpack dev as a middleware
 * This will run webpack dev server as part of your app server.
 */

process.env.WEBPACK_DEV_MIDDLEWARE = true;

/*
 * Tell Electrode app archetype that you want to shorten css names under production env
 */

process.env.ENABLE_SHORTEN_CSS_NAMES = true;

process.env.NODE_OPTIONS='--max-http-header-size=32768'

/*
 * Enable webpack's NodeSourcePlugin to simulate NodeJS libs in browser
 *
 * This basically adds a bunch of extra JavaScript to the browser to simulate
 * some NodeJS modules like `process`, `console`, `Buffer`, and `global`.
 *
 * Docs here:
 * https://github.com/webpack/docs/wiki/internal-webpack-plugins#nodenodesourcepluginoptions
 *
 * Note that the extra JavaScript could be substantial and adds more than 100K
 * of minified JS to your browser bundle.
 *
 * But if you see Errors like "Uncaught ReferenceError: global is not defined", then
 * the quick fix is to uncomment the line below.
 */

process.env.ENABLE_NODESOURCE_PLUGIN = true;

/*
 * Use PhantomJS to run your Karma Unit tests.  Default is "chrome" (Chrome Headless)
 */

// process.env.KARMA_BROWSER = "phantomjs";

/******************************************************************************
 * Begin webpack-dev-server only settings.                                    *
 * These do not apply if WEBPACK_DEV_MIDDLEWARE is enabled                    *
 ******************************************************************************/

/*
 * Turn off using electrode-webpack-reporter to show visual report of your webpack
 * compile results when running in dev mode with `clap dev`
 */

// process.env.HTML_WEBPACK_REPORTER_OFF = true;

/*
 * Use a custom host name instead of localhost, and a diff port instead of 2992
 * for webpack dev server when running in dev mode with `clap dev`
 */

// process.env.WEBPACK_DEV_HOST = "dev.mymachine.net";
// process.env.WEBPACK_DEV_PORT = 8100;

/*
 * Enable HTTPS for webpack dev server when running in dev mode with `clap dev`
 */

// process.env.WEBPACK_DEV_HTTPS = true;

/******************************************************************************
 * End webpack-dev-server only settings.                                      *
 ******************************************************************************/

require("electrode-archetype-react-app")();

//

//
// Load utils for building WML Electrode apps
//
require("@walmart/electrode-build-utils");
