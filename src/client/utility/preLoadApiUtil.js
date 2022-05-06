/* eslint-disable filenames/match-regex, no-empty */
import Http from "./Http";
import Helper from "./helper";
import FORMFIELDMETA from "../config/formsConfig/form-field-meta";
import MODALMETA from "../config/contentDescriptors/modals-meta";
import SECTIONSCONFIG from "../config/contentDescriptors/sections-meta";

class PreLoadApiUtil {

  fetchClaims(dispatcher, logoutUrl, clientType) {
    Http.get("/api/claims", {clientType})
      .then(res => {
        let claimList = [];
        const content = res.body.data.content;
        if (content) {
          claimList = content.map((claim, i) => {
            const newClaim = { ...claim, sequence: i + 1 };
            newClaim.original = claim;
            const firstName = claim.firstName ? Helper.toCamelCaseIndividual(claim.firstName) : "";
            const lastName = claim.lastName ? Helper.toCamelCaseIndividual(claim.lastName) : "";
            newClaim.createdByName = `${firstName  } ${  lastName}`;
            newClaim.statusDetails = newClaim.statusDetails && newClaim.statusDetails !== "null" ? newClaim.statusDetails : "";
            return newClaim;
          });
        }
        dispatcher({claimList});
      });
  }

  fetchBrands(dispatcher, logoutUrl, clientType) {
    Http.get("/api/brands", {clientType})
      .then(res => {
        let brandList = [];
        const content = res.body.content;
        if (content && content.length) {
          brandList = content.map((brand, i) => {
            const newBrand = { ...brand, sequence: i + 1 };
            newBrand.original = brand;
            return newBrand;
          });
        }
        dispatcher({brandList});
      })
      .catch(() => {});
  }

  fetchUsers(dispatcher) {
    Http.get("/api/users")
      .then(res => {
        const content = res.body.content;
        const userList = content.map((user, i) => {
          const newUser = {
            id: user.email,
            loginId: user.email,
            username: `${user.firstName} ${user.lastName}`,
            sequence: i + 1,
            brands: user.brands.map(brand => brand.name),
            dateAdded: Helper.getDateFromTimeStamp(user.createTs),
            status: user.status,
            original: user
          };

          if (user.role && user.role.name) {
            newUser.role = user.role.name;
          }

          if (user.type.toLowerCase() === "thirdparty") {
            newUser.company = user.companyName;
          }
          return newUser;
        });
        dispatcher({userList});
      });
  }

    fetchModalConfig(dispatcher) {
        try {
            dispatcher(MODALMETA);
            Http.get("/api/modalConfig")
                .then(response => {
                    if (response.body) {
                        try {
                            response = JSON.parse(response.body);
                            // response = MODALMETA;
                            dispatcher(response);
                        } catch (e) {
                            dispatcher(MODALMETA);
                        }
                    }
                });
        } catch (err) {}
    }

    fetchFormFieldConfig (dispatcher) {
        try {
            dispatcher(FORMFIELDMETA);
            Http.get("/api/formConfig")
                .then(response => {
                    if (response.body) {
                        try {
                            response = JSON.parse(response.body);
                            // response = FORMFIELDMETA;
                            dispatcher(response);
                        } catch (e) {
                            dispatcher(FORMFIELDMETA);
                        }
                    }
                });
        } catch (err) {}
    }

    fetchSectionsConfig (dispatcher) {
      try {
        dispatcher(SECTIONSCONFIG);
        Http.get("/api/sectionsConfig")
          .then(response => {
            if (response.body) {
              try {
                response = JSON.parse(response.body);
                // response = SECTIONSCONFIG;
                dispatcher(response);
              } catch (e) {
                dispatcher(SECTIONSCONFIG);
              }
            }
          });
      } catch (err) {}
    }
}

const preLoadApiUtil = new PreLoadApiUtil();
export {PreLoadApiUtil, preLoadApiUtil};
