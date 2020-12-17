/* eslint-disable quote-props */
const WIDGETCONFIG = {
    "WIDGETCOMMON": {
        "layoutClasses": "mx-auto",
        "widgetClasses": "widget-border position-relative py-2 h-100 text-center color-555",
        "widgetStyle": {"flex": "0 0 30%", "maxWidth": "30%", "minHeight": "15rem"},
        "contentLayout": "py-2",
        "header": {
            "contentLayout": "",
            "contentClasses": "h3 font-weight-bold"
        },
        "body": {
            "contentLayout": "py-3",
            "contentClasses": "h5 px-3 font-weight-bold override-body-style"
        },
        "footer": {
            "contentLayout": "border-top pb-0 position-absolute w-100 bottom-1",
            "contentClasses": "h3 mb-0 text-primary font-weight-bold"
        }
    },
    "WIDGETS": [
        {
            "item": "CLAIMS",
            "layoutClasses": "",
            "widgetClasses": "",
            "widgetStyle": {},
            "placement": "1.1.3", // row.order.span
            "header": {
                "title": "My Claims",
                "contentClasses": ""
            },
            "body": {
                "content": "Report Walmart.com listings for alleged intellectual property infringement",
                "contentClasses": ""
            },
            "footer": {
                "text": "Submit a New Claim",
                "contentClasses": "",
                "icon": "",
                "href": "/claims",
                "position": "right"
            }
        },
        {
            "actionEnabler": "enableBrandCreate",
            "item": "BRANDS",
            "action": "CREATE",
            "layoutClasses": "",
            "widgetClasses": "",
            "widgetStyle": {},
            "placement": "1.2.3", // row.order.span
            "header": {
                "title": "My Brands",
                "contentClasses": ""
            },
            "body": {
                "content": "Add more brands to your Walmart Brand Portal account",
                "contentClasses": ""
            },
            "footer": {
                "text": "Register a New Brand",
                "contentClasses": "",
                "icon": "",
                "href": "/brands",
                "position": "right"
            }
        },
        {
            "actionEnabler": "enableUserInvite",
            "item": "USERS",
            "action": "INVITE",
            "layoutClasses": "",
            "widgetClasses": "",
            "widgetStyle": {},
            "placement": "1.3.3", // row.order.span
            "header": {
                "title": "Users",
                "contentClasses": ""
            },
            "body": {
                "content": "Invite authorized users to your Walmart Brand Portal account",
                "contentClasses": ""
            },
            "footer": {
                "text": "Invite a New User",
                "contentClasses": "",
                "icon": "",
                "href": "/users",
                "position": "right"
            }
        }
    ]
};

export default WIDGETCONFIG;
