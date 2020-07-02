//
// This is the server side entry point for the React app.
// It's loaded by the @walmart/electrode-react-webapp2 plugin specified in config/default.json
//

import { routes } from "../../client/routes";
const reduxRouterEngine = require("@walmart/electrode-redux-router-engine");

//
// This function is exported as the content for the webapp plugin.
//
// See config/default.json under plugins.webapp on specifying the content.
//
// When the Web server hits the routes handler installed by the webapp plugin, it
// will call this function to retrieve the content for SSR if it's enabled.
//
//

let routesEngine;

module.exports = req => {
  if (!routesEngine) {
    routesEngine = reduxRouterEngine(routes);
  }

  return routesEngine(req);
};
