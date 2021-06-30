import Http from "./Http";
import Helper from "./helper";

class PreLoadAPIUtil {
  fetchClaims(dispatcher) {
    Http.get("/api/claims")
      .then(res => {
        console.log(res);
        let claimList = [];
        const content = res.body.data.content;
        if (content) {
          claimList = content.map((claim, i) => {
            const newClaim = { ...claim, sequence: i + 1 };
            newClaim.original = claim;
            const firstName = claim.firstName ? Helper.toCamelCaseIndividual(claim.firstName) : "";
            const lastName = claim.lastName ? Helper.toCamelCaseIndividual(claim.lastName) : "";
            newClaim.createdByName = firstName + " " + lastName;
            newClaim.statusDetails = newClaim.statusDetails && newClaim.statusDetails !== "null" ? newClaim.statusDetails : "";
            return newClaim;
          });
        }
        dispatcher({claimList});
      });
  }

  fetchBrands(dispatcher) {
    Http.get("/api/brands")
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
        console.log(res);
        dispatcher({brandList});
      })
      .catch(e => {
        console.log(e);
      });
  }

  fetchUsers(dispatcher) {
    Http.get("/api/users")
      .then(res => {
        console.log(res);
        let userList = [];
        const content = res.body.content;
        userList = content.map((user, i) => {
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
}

const preLoadApiUtil = new PreLoadAPIUtil();
export {PreLoadAPIUtil, preLoadApiUtil};
