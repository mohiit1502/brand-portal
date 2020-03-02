//
// This partial config will always be used when app is running on OneOps
//
// Your app is considered running on OneOps if process.env.ONEOPS_ENVPROFILE is defined.
//

module.exports = {
  plugins: {
    webapp: {
      options: {
        cdn: {
          enabled: true
        }
      }
    }
  }
};
