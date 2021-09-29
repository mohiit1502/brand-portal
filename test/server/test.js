"use strict";

const nj = require("node-jose");

const toTempken = "eyJraWQiOiI5YmNiMDBlNy1iMDNiLTQwYTctYTQ1MS1jODM4ZTQ0MzZhNjUiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiZGlyIn0..vpH6lwD1LnToC_Oy.HK3tT4LGWW9fG9jmIhCN38GBI-7XbI1dAfV1QiQj0Fc6a7pQwnoSm-J2uBm7UBsFp0f9DfbHlXek9XMrRZ8Sa2hXj_cFfdTHiWeRdgJ3f4h_E2Sw0GNUp-GU_nIaOKeJzdt3qPjmrFpPgW_CcD9RFN_2JRbHG2ovPf2xgsLo5n6Qulu3yLgM7IOLD8uNkfRS8eYVbMMPLcG_TQIoTR3VB2SymrEbQh8QadCeEA8u00uV1aGouvDgJA54p41oqJkzU1MQffnh-TkeKInn-S81_ClHHmKUOBilbcHqIs-7irb3BzHVMYOTNdM5b0jn7U6tEFInGgrnfRFmo_5oEGtcmeEksiu7F9nlKZQ1cgvH5BVa1poTMChlPvq6uUMtsGH1brf1vb5VA0huzP_zgDfgvXh_Vn4e6Kx_98JIET9-s5-eesHywqQmzWqFHMOUoXfIjJxF140_7kL3ENIORWp-yLoEdguK1S0AaeNZ72DRWE14WigMDsR6pR8ap1la_4TKQ5iWB-FDz2BAbZQgnaJN7gnt41voaapJXbBxFkoOBltW_kBPM3EWzWpGoF_70q_kja_RRJLKdCq11yY9AMSl83Zqw3KVooneiHVZcczMS-mIpq5F-q_EAQva1CflqnvDuBAgkSw5h4QH_73Lf5-ONGZBKsCD99eLlMaiIm2cepFLyCPITmUZywh7-p0VYwdGGJekZUPvXtztyCqMnF4eNSpNEpykFGhHNmjOnGbSMprKjHWJwW3C0hd__kkBNsmVct_JDI5PY2yaXMd-1GVprH9LRwu-fID5utwbmqtfhEYXuz3c--oJqoT1yYKCL4O5W_z7zAwRtTCrt-XmhRmOj_7IWK1Hqvdk32c4R3gyMs7Twq0Dxh9JGGxdoRl9G7DkZB_hKRgX5ZI3Xq9OwA6Du0xlXkxlTyNowi3KoGDAJVvxeL1LqYHs_DW_gl31wKbZCHCSmpSsT5dbTYiMuJ4Vo_UJ9hU4ysND9057t_P-d7813DbcYKEsFXGS5-bXdeY2Yt65AyJKS4Evq7FE6EFt62K-Aa6rl8__e45xZtW6XL06uSIlMKRIAaDba-180tIg22SREUaA0WrSExHA3yfE6MIetYHxXoefeS318fDOW1qWZPwMrtAWE4CG6sKq4sg2GFzmWN-kVMFGItNx-g6nbSumpXbFRp2f2VZYtIE3GWY1i_xZbeJ2lF2KYzrrYaS49RRXTA21fL42Qn3qn5q2_wfkHJkYiMWu5Z-Eo4j8Y6f0ah7rrfcRfXVPik3rT9NDVVojT78-1iYAVxyVfB5r3s8NNAiFiPybI7q1lCH0q-vmWPdEu059gDA-YbLR2O2SbodTHaMxXyELzkz4rZhsC37w1cM6KIk7NR8W2dRAYlJ3pKIXxixtXuC-Mx2shpeESmALtxcwsXu4zHaiHBY0puQ4rhckn2lU6LMzyls8oe0IkhM9grnYK1VIPkrS2x00cHLyvPZYPmsBgLGn14GgVsC6x8JacDZhNBQQRfRqPUBc3N4IMbCiA23MFU99Ugn6-XX3bDnv8aGc3s6EIuaI5HEY9GSQzFaEc8bOaOXPunZbJ_MxaK_H6IKNdQk0eqImE31aZjchWLwLQxMH118r_5HcrmETh4I6i_gmLFzAqzuh_N0C48VW-8vmbcH3W0IbcBii9sVR3ClqmVJSGIbMNV_GkvAVgvj66CB1BpxYBXZ7vd70k9u6kW_1IpRbTQQLu83x3anXsbotxu0Fx9OFrgE4NMsWOmlIxT8hPNvt9iFRmmBzCmJGtI3K5VZPEjklhqCkHjWYIEdngpkkf8Az-w.nHmSLOh467B7N7qEpkIPoA";

const decryptToken = function (idToken) {
  const falconSSOTokenKey = JSON.parse("{\"kty\":\"oct\",\"use\":\"enc\",\"kid\":\"9a7392d7-dfdc-4af9-b829-bcdd1b3e1aad\",\"k\":\"5hKE_Lgai-24Y5c4bU-60aRGmZ-7cGJxlBuCtCvZGmM\"}");
  const keystore = nj.JWK.createKeyStore();
  let jwtt;
  let obj = null;

  return new Promise((resolve, reject) => {
    try {
      keystore.add(falconSSOTokenKey).then(addedKeyStore => {
        nj.JWE.createDecrypt(addedKeyStore).decrypt(idToken).then(result => {
          const { payload: bufferArray } = result;
          jwtt = String.fromCharCode(...[...bufferArray]);
          const payload = jwtt.split(".")[1];
          /*eslint new-cap: ["error", { "capIsNew": false }]*/
          const decodedData = Buffer(payload, "base64").toString();
          obj = JSON.parse(decodedData);
          // console.log(obj);
          return resolve(obj);
        });
      });
    } catch (err) {
      // console.error(`JWT ERROR: ${err}`);
      reject(err);
    }
  });
};

decryptToken(toTempken);
