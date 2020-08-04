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
                    question: "How do I get access to Walmart Brand Portal?",
                    type: "list",
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
                                    }
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
                                    }
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
                                    }
                                }
                            ]
                        },
                        para2: "You will be granted access to Brand Portal to protect your intellectual property once we have verified the information you submit in your application."
                    }
                },
                {
                    question: "Are WIPO or EUIPO trademarks accepted by Walmart Brand Portal?",
                    type: "simple",
                    answer: {
                        para1: "Walmart Brand Portal currently only accepts trademarks registered with the United States Patent and Trademark Office (USPTO)."
                    }
                },
                {
                    question: "Can agents that represent a brand get access to Walmart Brand Portal?",
                    type: "simple",
                    answer: {
                        para1: "Yes. Rights owners can add additional users, including agents, to their Brand Portal account. Users can request to be added to a rights owner's Brand Portal account, or a rights owner can invite new users and assign specific roles and brands to their users."
                    }
                },
                {
                    question: "How can I check the status of my Brand Portal application?",
                    type: "simple",
                    answer: {
                        para1: "Brand Portal will provide real-time status updates, use your brand portal account information to log in to your account, your application status will be displayed for you."
                    }
                },
                {
                    question: "How do I add a new brand to my Brand Portal account?",
                    type: "list",
                    answer: {
                        para1: "Once your information has been verified and you've gained access to Brand Portal, you can add more brands to your account. You can do this at any time by taking the following steps:",
                        list: {
                            type: "ol",
                            subType: "1",
                            steps: [
                                {
                                    main: "Login to your Brand Portal account"
                                },
                                {
                                    main: "Head to \"My Brands\" section"
                                },
                                {
                                    main: "Click \"New Brand\""
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
                                    }
                                }
                            ]
                        }
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
                    question: "Can I retract a claim I made on Brand Portal?",
                    type: "simple",
                    answer: {
                        para1: "In the case of retracting claims, please reach out to our customer service from within your brand portal account."
                    }
                },
                {
                    question: "How do I access my brand if the current Brand Portal rights owner is no longer with the company?",
                    type: "simple",
                    answer: {
                        para1: "Our detected team of specialist will be able to help you, please reach out to our customer service from within your brand portal account."
                    }
                },
                {
                    question: "How can I get help from the Walmart Brand Portal team?",
                    type: "simple",
                    answer: {
                        para1: "Please reach out to our customer service from within your brand portal account."
                    }
                },
                {
                    question: "What type of issues can I use Brand Portal to report?",
                    type: "simple",
                    answer: {
                        para1: "Intellectual property rights can be submitted through your brand portal account, TM, Copyright, Patent and counterfeit items"
                    }
                },
                {
                    question: "Is Walmart Brand Portal service available only in the United States?",
                    type: "simple",
                    answer: {
                        para1: "Currently, walmart.com is providing its brand portal services to the united states."
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
                            }
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
                            }
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
                            }
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
                            main: "Login to your Brand Portal account"
                        },
                        {
                            main: "Head to \"My Brands\" section"
                        },
                        {
                            main: "Click \"New Brand\""
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
                            }
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
                    }
                }
            ]
        }
    }
};

export default HELPCONFIG;
