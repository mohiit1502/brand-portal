import AuthUtil from "../../../src/client/utility/AuthUtil";
import profile from "../../client/mocks/userProfile";
import CONSTANTS from "../../../src/client/constants/constants";

const ROLES = CONSTANTS.USER.ROLES;

describe("auth util test container", () => {
  it("should generate auth output",  () => {
    let response = AuthUtil.isActionAccessible("CLAIMS.DASHBOARD_ACTION");
    expect(response).toBe(false);
    response = AuthUtil.isActionAccessible("CLAIMS.DASHBOARD_ACTION", profile, ROLES.SUPERADMIN)
    expect(response).toBe(true);
    response = AuthUtil.isActionAccessible("USERS.INVITE", profile, ROLES.ADMIN);
    expect(response).toBe(true);
  });
});
