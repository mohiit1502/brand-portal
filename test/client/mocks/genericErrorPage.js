const GENERICERRORPAGE = {
  withDetails: {
    containerClass: "test-container",
    generic: true,
    header: "generic-test-header",
    image: "PageError",
    isLoggedIn: true,
    isOnboarded: true,
    logInId: "test@gmail.com",
    message: "test-message",
    profileInformationLoaded: true,
    userInfoError: "test-error"
  },
  withoutDetails: {
    generic: false,
    isLoggedIn: false,
    isOnboarded: false,
    profileInformationLoaded: false
  }

}
export default GENERICERRORPAGE;
