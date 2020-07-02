export default class StorageSrvc {

  storageService = window.sessionStorage;

  constructor(storageType) {
    switch (storageType) {
      case "sessionStorage" :
        this.storageService = window.sessionStorage;
        break;
      case "localStorage" :
        this.storageService = window.localStorage;
        break;
    }
  }

  getItem (key) {
    try {
      return this.storageService.getItem(key);
    } catch (e) {
      return null;
    }
  }

  setItem (key, value) {
    try {
      return this.storageService.setItem(key, value);
    } catch (e) {
      throw e;
    }
  }

  getJSONItem (key) {
    try {
      return JSON.parse(this.storageService.getItem(key));
    } catch (e) {
      return null;
    }
  }

  setJSONItem (key, value) {
    try {
      return this.storageService.setItem(key, JSON.stringify(value));
    } catch (e) {
      throw e;
    }
  }

  removeItem (key) {
    try {
      return this.storageService.removeItem(key);
    } catch (e) {
      throw e;
    }
  }
}

export const STORAGE_TYPES = {
  SESSION_STORAGE: "sessionStorage",
  LOCAL_STORAGE: "localStorage"
};
