const HELPCONFIG = {
    header: "Welcome to Walmart Brand Portal help center",
    categoryHeader: "Help Topics",
    categories: {
        faq: {
            categoryText: "Frequently Asked Questions"
        },
        account: {
            categoryText: "Account Registration"
        },
        brand: {
            categoryText: "Brand Management"
        },
        user: {
            categoryText: "User Management"
        },
        claim: {
            categoryText: "Claim Management"
        }
    },
    content: {
        faq: {
            header: "Frequently Asked Questions",
            id: "query_faq",
            simple: false,
            items: [
                {
                    question: "How can I check the status of my Brand Portal application?",
                    type: "simple",
                    answer: {
                        para1: "To see the status of your application, please log into your Brand Portal account. You will see a message with the current application status upon login."
                    }
                },
                {
                    question: "Are WIPO or EUIPO trademarks accepted by Walmart Brand Portal?",
                    type: "simple",
                    answer: {
                        para1: "Brand Portal currently only accepts trademarks registered with the United States Patent and Trademark Office (USPTO)."
                    }
                },
                {
                    question: "Can agents or third party vendors that represent a brand get access to Brand Portal?",
                    type: "simple",
                    answer: {
                        para1: "Yes. Rights owners can add additional users, including agents, to their Brand Portal account by inviting a new user and assigning specific roles and brands to the new user."
                    }
                },
                {
                    question: "How many brands can I add to my Brand Portal account?",
                    type: "simple",
                    answer: {
                        para1: "There is no limit to the number of brands you can add under your Brand Portal account. You can add additional brands at any time by heading to the \"My Brands\" section, clicking \"New Brand\", and entering your brand information. The submitted information will be verified by our team, then added to your account once ownership is confirmed."
                    }
                },
                {
                    question: "How do I report alleged intellectual property violations if I don't have a Brand Portal account?",
                    type: "simple",
                    answer: {
                        partial1: {
                            anchor1: {
                                href: "https://www.walmart.com",
                                text: "Walmart.com"
                            },
                            chunk1: " operates a ",
                            anchor2: {
                                href: "https://help.walmart.com/app/ts",
                                text: "publicly available webform"
                            },
                            chunk2: " for reporting alleged instances of intellectual property infringement."
                        }
                    }
                },
                {
                    question: "How do I check the status of the IP claim that I made on Brand Portal?",
                    type: "list",
                    answer: {
                        para1: "Once you submit an IP claim through Brand Portal, your claim will appear in the claim dashboard under \"My Claims\". To see the status of your claim, check the \"status\" column, or click on the claim number to see additional information.",
                        para2: "Your claim will show one of the following in the \"claim status\" section:",
                        list: {
                            type: "ul",
                            subType: "1",
                            steps: [
                                "Submitted: Your claim was submitted, and is pending review",
                                "In progress: Your claim is currently under review",
                                "Closed: Your claim is closed, and additional details were shared to the reporter's email address."
                            ]
                        }
                    }
                },
                {
                    question: "Can I retract a claim I made on Brand Portal?",
                    type: "simple",
                    answer: {
                        partial1: {
                            chunk1: "Please reach out to our support team at ",
                            anchor1: {
                                href: "mailto:IPInvest@walmart.com",
                                text: "IPInvest@walmart.com"
                            },
                            chunk2: " to submit a retraction. Please be sure to include the original claim number that you'd like to retract."
                        }
                    }
                },
                {
                    question: "How do I access my brand if the current Brand Portal rights owner is no longer with the company?",
                    type: "simple",
                    answer: {
                        partial1: {
                            chunk1: "Please reach out to our support team at: ",
                            anchor1: {
                                href: "mailto:IPInvest@walmart.com",
                                text: "IPInvest@walmart.com"
                            },
                            chunk2: ". Please be sure to include information about your account, along with details regarding your issue."
                        }
                    }
                },
                {
                    question: "How can I get help from the Walmart team if I'm experiencing bugs or have questions about the tool?",
                    type: "simple",
                    answer: {
                        partial1: {
                            chunk1: "Please reach out to our support team at: ",
                            anchor1: {
                                href: "mailto:IPInvest@walmart.com",
                                text: "IPInvest@walmart.com"
                            },
                            chunk2: " and include information about your account, along with details regarding your issue."
                        }
                    }
                },
                {
                    question: "What type of claims can I use Brand Portal to report?",
                    type: "simple",
                    answer: {
                        para1: "You can report any legitimate claims of intellectual property infringement for items listed on Walmart.com, including claims of copyright, trademark, patent, and counterfeit."
                    }
                },
                {
                    question: "Is Walmart Brand Portal service available only in the United States?",
                    type: "simple",
                    answer: {
                        para1: "Yes, Brand Portal services are currently offered only for the United States Walmart.com marketplace."
                    }
                }
            ]
        },
        account: {
            header: "How to register for Walmart Brand Portal",
            id: "query_account",
            simple: true,
            type: "listWithImages",
            question: "How do I get access to Walmart Brand Portal?",
            answer: {
                partial1: {
                    chunk1: "Walmart Brand Portal is built for rights owners who would like to protect their intellectual property on ",
                    anchor1: {
                        href: "https://www.walmart.com",
                        text: "Walmart.com."
                    },
                    chunk2: " To qualify for a Brand Portal account, you will need registered trademarks associated with your brands. We will ask for the following information in the application process:"
                },
                list: {
                    type: "ol",
                    subType: "1",
                    steps: [
                        {
                            main: "User Information:",
                            subList: {
                                type: "ul",
                                subType: "-",
                                steps: [
                                    "First and last name",
                                    "Email address"
                                ]
                            },
                            image: [
                                "FNameLName",
                                "Email"
                            ]
                        },
                        {
                            main: "Company Information:",
                            subList: {
                                type: "ul",
                                subType: "-",
                                steps: [
                                    "Company name",
                                    "Company address",
                                    "Business registration documents"
                                ]
                            },
                            image: [
                                "Company1",
                                "Company2"
                            ]
                        },
                        {
                            main: "Brand Information:",
                            subList: {
                                type: "ul",
                                subType: "-",
                                steps: [
                                    "Brand name",
                                    "Registered Trademark Number associated with the brand",
                                    "Additional comments about the brand"
                                ]
                            },
                            image: [
                                "Brand1",
                                "Brand2"
                            ]
                        }
                    ]
                },
                para2: "You will be granted access to Brand Portal to protect your intellectual property once we have verified the information you submit in your application."
            }
        },
        brand: {
            header: "How to add new brands to your Brand Portal account",
            id: "query_brand",
            simple: true,
            type: "listWithImages",
            answer: {
                para1: "Once your information has been verified and you've gained access to Brand Portal, you can add more brands to your account. You can do this at any time by taking the following steps:",
                list: {
                    type: "ol",
                    subType: "1",
                    steps: [
                        {
                            main: "Login to your Brand Portal account",
                            image: ["Login"]
                        },
                        {
                            main: "Head to \"My Brands\" section",
                            image: ["BrandList"]
                        },
                        {
                            main: "Click \"New Brand\"",
                            image: ["CreateBrandButton"]
                        },
                        {
                            main: "Enter your brand information:",
                            subList: {
                                type: "ul",
                                subType: "-",
                                steps: [
                                    "Brand name",
                                    "Registered Trademark Number associated with the brand",
                                    "Additional comments about the brand"
                                ]
                            },
                            image: ["CreateBrandForm"]
                        }
                    ]
                }
            }
        },
        user: {
            header: "How to add and manage users",
            id: "query_user",
            simple: true,
            type: "listWithImages",
            answer: {
                para1: "In Walmart Brand Portal, you can add and manage multiple users to help represent your brand. Users can include agents, and you have the flexibility to assign users to particular brands and roles. To add additional users to your Brand Portal account, follow these steps:",
                list: {
                    type: "ol",
                    subType: "1",
                    steps: [
                        {
                            main: "Login to your Brand Portal account",
                            image: ["Login"]
                        },
                        {
                            main: "Head to \"User List\" section",
                            image: ["UserList"]
                        },
                        {
                            main: "Click \"Invite User\"",
                            image: ["InviteUserButton"]
                        },
                        {
                            main: "Enter information about the user:",
                            subList: {
                                type: "ul",
                                subType: "-",
                                steps: [
                                    "Select the type of user",
                                    "First and last name",
                                    "Email",
                                    "Select role and assign brands"
                                ]
                            },
                            image: ["InviteUserForm"]
                        }
                    ]
                }
            }
        },
        claim: {
            header: "Claim Management",
            id: "query_claim",
            simple: false,
            items: [
                {
                    question: "How to submit claims",
                    type: "list",
                    answer: {
                        partial1: {
                            chunk1: "If you find any listings on ",
                            anchor1: {
                                href: "https://www.walmart.com",
                                text: "Walmart.com."
                            },
                            chunk2: " that you believe violate your intellectual property, you can submit a claim through Brand Portal. You can follow these steps to report alleged intellectual property infringements on ",
                            anchor2: {
                                href: "https://www.walmart.com",
                                text: "Walmart.com."
                            }
                        },
                        list: {
                            type: "ol",
                            subType: "1",
                            steps: [
                                {
                                    main: "Login to your Brand Portal Account"
                                },
                                {
                                    main: "Head to \"My Claims\" section"
                                },
                                {
                                    main: "Click \"New Claim\""
                                },
                                {
                                    main: "Fill out the New Claim form:",
                                    subList: {
                                        type: "ul",
                                        subType: "-",
                                        steps: [
                                            "Select the infringement type (Trademark, Copyright, Counterfeit, Patent)",
                                            "Select the brand name",
                                            "Enter the trademark registration number, if applicable",
                                            "Enter the item URL(s)",
                                            "Select the Seller Name",
                                            "Enter comments regarding your claim",
                                            "Confirm legal statements"
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    question: "How to check your claim history",
                    type: "simple",
                    answer: {
                        para1: "Once you've submitted claims through Brand Portal, you will be able to see your claim history, along with the status of each of your claims. Head to \"My Claims\" section to see all of the claims you've submitted through your Brand Portal account. You can filter your list by claim number, claim type, brand, who submitted the claim, claim date, and the status.",
                        para2: "To see additional details about the claims you submitted, click on the claim number. A pop-up will appear that will show you the following information: ",
                        list: {
                            type: "ul",
                            subType: "1",
                            steps: [
                                "Claim type",
                                "Brand information",
                                "Name of the reporter",
                                "Claim date",
                                "Reported items",
                                "Reported sellers",
                                "Claim comments",
                                {
                                    main: "Claim status",
                                    subList: {
                                        type: "ul",
                                        subType: "-",
                                        steps: [
                                            "Submitted: Your claim was submitted, and is pending review",
                                            "In progress: Your claim is currently under review",
                                            "Closed: Your claim is closed, and additional claim details were shared to the reporter's email address."
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                }
            ]
        }
    }
};

export default HELPCONFIG;
