const loginTypeCtaMock = {
  noError: {
    "history": {
      "length": 17,
      "action": "PUSH",
      "location": {
        "pathname": "/login",
        "search": "",
        "hash": "",
        "key": "3r32hc"
      }
    },
    "location": {
      "pathname": "/login",
      "search": "",
      "hash": "",
      "key": "3r32hc"
    },
    "match": {
      "path": "/login",
      "url": "/login",
      "isExact": true,
      "params": {}
    },
    "route": {
      "path": "/login",
      "exact": true
    }
  },
  unauthorised:{
    "history": {
      "length": 18,
      "action": "POP",
      "location": {
        "pathname": "/login",
        "search": "?unauthorized",
        "hash": ""
      }
    },
    "location": {
      "pathname": "/login",
      "search": "?unauthorized",
      "hash": ""
    },
    "match": {
      "path": "/login",
      "url": "/login",
      "isExact": true,
      "params": {}
    },
    "route": {
      "path": "/login",
      "exact": true
    },
    "action": "login"
  }

};

export default loginTypeCtaMock;
