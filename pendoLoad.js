(function(apiKey) {
  (function(p, e, n, d, o) {
    var v, w, x, y, z;
    o = p[d] = p[d] || {};
    o._q = o._q || [];
    v = ["initialize", "identify", "updateOptions", "pageLoad", "track"];
    for (w = 0, x = v.length; w < x; ++w)
      (function(m) {
        o[m] =
          o[m] ||
          function() {
            o._q[m === v[0] ? "unshift" : "push"](
              [m].concat([].slice.call(arguments, 0))
            );
          };
      })(v[w]);
    y = e.createElement(n);
    y.async = !0;
    y.src ='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';
    z = e.getElementsByTagName(n)[0];
    z.parentNode.insertBefore(y, z);
  })(window, document, "script", "pendo");
})("ec79a3df-aaf6-4523-7fe3-da7bcab948e0");

window.pendo.initialize({
  visitor: {
    id:window.localStorage.getItem("loginId")
  },
  account: {
    id:window.localStorage.getItem("loginId"),
    emailId:window.localStorage.getItem("loginId"),
    brandPortalOrgId:window.localStorage.getItem("brandPortalOrgId"),
    brandPortalOrgName:window.localStorage.getItem("brandPortalOrgName"),
    brandPortalOrgStatus:window.localStorage.getItem("brandPortalOrgStatus"),
    brandPortalRole:window.localStorage.getItem("brandPortalRole"),
    sellerPartnerId:window.localStorage.getItem("sellerPartnerId"),
    sellerName:window.localStorage.getItem("sellerName"),
    isInternationalSeller:window.localStorage.getItem("isInternationalSeller"),
    sellerCountry:window.localStorage.getItem("sellerCountry"),
    accountLinked:window.localStorage.getItem("accountLinked"),
    isSeller:window.localStorage.getItem("isSeller"),
    doItLater:window.localStorage.getItem("doItLater")
  }
});
