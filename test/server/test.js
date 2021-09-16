"use strict"

const nj = require("node-jose");

const token = "eyJraWQiOiI5YmNiMDBlNy1iMDNiLTQwYTctYTQ1MS1jODM4ZTQ0MzZhNjUiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiZGlyIn0..vpH6lwD1LnToC_Oy.HK3tT4LGWW9fG9jmIhCN38GBI-7XbI1dAfV1QiQj0Fc6a7pQwnoSm-J2uBm7UBsFp0f9DfbHlXek9XMrRZ8Sa2hXj_cFfdTHiWeRdgJ3f4h_E2Sw0GNUp-GU_nIaOKeJzdt3qPjmrFpPgW_CcD9RFN_2JRbHG2ovPf2xgsLo5n6Qulu3yLgM7IOLD8uNkfRS8eYVbMMPLcG_TQIoTR3VB2SymrEbQh8QadCeEA8u00uV1aGouvDgJA54p41oqJkzU1MQffnh-TkeKInn-S81_ClHHmKUOBilbcHqIs-7irb3BzHVMYOTNdM5b0jn7U6tEFInGgrnfRFmo_5oEGtcmeEksiu7F9nlKZQ1cgvH5BVa1poTMChlPvq6uUMtsGH1brf1vb5VA0huzP_zgDfgvXh_Vn4e6Kx_98JIET9-s5-eesHywqQmzWqFHMOUoXfIjJxF140_7kL3ENIORWp-yLoEdguK1S0AaeNZ72DRWE14WigMDsR6pR8ap1la_4TKQ5iWB-FDz2BAbZQgnaJN7gnt41voaapJXbBxFkoOBltW_kBPM3EWzWpGoF_70q_kja_RRJLKdCq11yY9AMSl83Zqw3KVooneiHVZcczMS-mIpq5F-q_EAQva1CflqnvDuBAgkSw5h4QH_73Lf5-ONGZBKsCD99eLlMaiIm2cepFLyCPITmUZywh7-p0VYwdGGJekZUPvXtztyCqMnF4eNSpNEpykFGhHNmjOnGbSMprKjHWJwW3C0hd__kkBNsmVct_JDI5PY2yaXMd-1GVprH9LRwu-fID5utwbmqtfhEYXuz3c--oJqoT1yYKCL4O5W_z7zAwRtTCrt-XmhRmOj_7IWK1Hqvdk32c4R3gyMs7Twq0Dxh9JGGxdoRl9G7DkZB_hKRgX5ZI3Xq9OwA6Du0xlXkxlTyNowi3KoGDAJVvxeL1LqYHs_DW_gl31wKbZCHCSmpSsT5dbTYiMuJ4Vo_UJ9hU4ysND9057t_P-d7813DbcYKEsFXGS5-bXdeY2Yt65AyJKS4Evq7FE6EFt62K-Aa6rl8__e45xZtW6XL06uSIlMKRIAaDba-180tIg22SREUaA0WrSExHA3yfE6MIetYHxXoefeS318fDOW1qWZPwMrtAWE4CG6sKq4sg2GFzmWN-kVMFGItNx-g6nbSumpXbFRp2f2VZYtIE3GWY1i_xZbeJ2lF2KYzrrYaS49RRXTA21fL42Qn3qn5q2_wfkHJkYiMWu5Z-Eo4j8Y6f0ah7rrfcRfXVPik3rT9NDVVojT78-1iYAVxyVfB5r3s8NNAiFiPybI7q1lCH0q-vmWPdEu059gDA-YbLR2O2SbodTHaMxXyELzkz4rZhsC37w1cM6KIk7NR8W2dRAYlJ3pKIXxixtXuC-Mx2shpeESmALtxcwsXu4zHaiHBY0puQ4rhckn2lU6LMzyls8oe0IkhM9grnYK1VIPkrS2x00cHLyvPZYPmsBgLGn14GgVsC6x8JacDZhNBQQRfRqPUBc3N4IMbCiA23MFU99Ugn6-XX3bDnv8aGc3s6EIuaI5HEY9GSQzFaEc8bOaOXPunZbJ_MxaK_H6IKNdQk0eqImE31aZjchWLwLQxMH118r_5HcrmETh4I6i_gmLFzAqzuh_N0C48VW-8vmbcH3W0IbcBii9sVR3ClqmVJSGIbMNV_GkvAVgvj66CB1BpxYBXZ7vd70k9u6kW_1IpRbTQQLu83x3anXsbotxu0Fx9OFrgE4NMsWOmlIxT8hPNvt9iFRmmBzCmJGtI3K5VZPEjklhqCkHjWYIEdngpkkf8Az-w.nHmSLOh467B7N7qEpkIPoA";
// let token2 = "eyJraWQiOiIzM2U0YzRjNy0xMThkLTQyZTgtYmQ4NS1kNWIzYjI5MGY5ZWMiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiZGlyIn0..ZJcFMfCzqaon4I2O.z61qhGcoSAzVtLXZNAQ-x5HRGZlBg45PPrCr20hUtX0qIG3jWV9idOoCMkpL2Fr6VPIFTo1yu6lk08sXNjXNrxAd0BFYEw8c_tK3rGzhOzmLkH2KIL11YtFobbRafnakaQjT_r2Bm0JJt8oZB2mPNelrweGsPtt_QLMRroQvkV_ZBOf-W1quwZ1NVj1YFS4hFpI9kfcPZh_b1AAFGykdJ-76B_RYJ-w28NFGDPDTYe5mMWVjh8kWX7O_8AlEVvmGOrrXU7Y0iDmrDCZEE5ZMs7Pp4e7Yl3Ac_Ujafedfi2iBwrRFEVei4LDumMvLgDWHc7OFAxT0N_H_IecLr6sWusnS56Th5OthW5k6RPy6qUkSL7skxKNZo4CQUlgeGQe05ofzuZPvFu4W-9VLPOwsU9x1cQZ0s45_lfnetUDNOhAvTPnI71IWQxbEdWbcF0IcQs9saAjL1rezxMiHI-VX0UmkJM-G4S73t1m4b3iKOTs-zpIjsNN3bZlfn7hUejNTgj-Ff82SUX5oM6yssZi5khGWL8y0iRbls0da0bN_aQm-xu2QHZLMZ9FCwHEAFwuc9yvhcgrz3mhlZnSRv7_rEREMdU5eWyOAuQedBMVUFKUDOI2lN3RDLsALi9bqPTcjXF-jxPRDZo5C91BIjLrHI8XwC1Oq33EetoSHm64fO630Gu00tInY8V0jxJuQruec-Y7VIWeQul0NHYe2dxabY2Gr0gHQK57fV7fA_ihlG6LdILL2i3bWZIw3RXldqjWtWbgv4JhYd1deWWhvG9oMzxTlha_j22a8wBLzu2FQVyi1nzNoQfMwlbsPmOQ1rBef_9neJRC7Xr6q2JM8WNX9WI9tsfJaq8iUQfgvcQNVZkQcEhk0amt1cwwwl2m1AQZiN0mytUJCokE5_YM5Dq3p1SFj0urfniaZ6t0LzmRVHljGWwnrazMdMwjWhp3pOUQ85ONovhYhA0zJ3-rbLyCmKOwuyUewqbCZoThuFmXb5JOuNxKjfF_3d-IaV6G76RpkyQogJj7crOttZJ9ujiAVlHjeAePWIIWi2MVrxZg6WreHl93QBnaq6tS_rWJV8kobgn62ql4tg6LpjEtw1SwDRVW88Qr_IYyNYxlTg0F1nMpKyQ0y7AsFq5V5mUMaMCwEgWd9E8XKm_0DsBqCYmql-bLbdTZyJS4ZXUrANMc6I0_o8g_ocITedvCBvzk16jlXWUcfsC66le4-SvZGewJPn6RcXubxVFxXLTw6h3mtkeglN56dM66x9QfRZM-JxISXX_uZaUvzCDzCY60UW_oYQXCKcXnaar4AiNAFVcHlLs4cxrcp7KS9IdjxYUA6pr_2Wfn2k4y8DzVZWsSO1sjnoXLiEUB6uL4nmELTgdf_AzgPtQLxkAnMF2XgrVkwgiPDnpdVhdWCgN9A5W6W1jyW6BiKVfHBYIZ8dE1fcA_sJ6VJWoRdwXdzC7w9C-65K-EfIuxqmxtd1n8rbpCTCHH2pTsdYmwCHvO-UwwLFM2Tu9Xr0Mg1xl78KzeCkXtdypni-7dexGj53NpYir2hedHyeX854Tlq1ypX-jCN4Ppab4gIV5nnrw4j--Xf5XJrVyFp7T82NJ14Y-ZlAGbozummDYwxAQb1Lem83WjEtAK__cTivJOyJtB5gisVF1D0jUB6paXv7_Oyx91VNQ9coYxTkVNSQxaUhgI_zgLHGQ3q77-k0nEjs1XEtJM7bbtavEFy8OHz7elV5s8uVLqXuS5naO5AioOJ60x6PdBztbZdHR6kn5G9wz3PzlN8Xjc5qgJ_WxBPYwXP72PtIIZsvhXe1jE.bJa7zXVHLNdVSiDro8e_FA"

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
}

decryptToken(token);
