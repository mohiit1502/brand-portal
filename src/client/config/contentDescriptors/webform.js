const WEBFORMCONFIG = {
    landingPageConfig: {
        contents: [
        {
            header: "Walmart Brand Portal",
            body: {
            para1: "You can report any legitimate claims of intellectual property infringement for items listed on Walmart.com, including claims of copyright, trademark, patent, and counterfeit.Please note that violations of exclusive distribution agreements are not the subject of IP infringement, and Walmart will not take action to enforce such agreements.",
            para2: "Please note that violations of exclusive distribution agreements are not the subject of IP infringement, and Walmart will not take action to enforce such agreements.Please note that violations of exclusive distribution agreements are not the subject of IP infringement, and Walmart will not take action to enforce such agreements.Please note that violations of exclusive distribution agreements are not the subject of IP infringement, and Walmart will not take action to enforce such agreements."
            },
            button: {
            buttonText: "Register",
            key: "register",
            classes: "btn btn-sm btn-primary"
            }
        },
        {
            header: "DMCA IP Claim Form",
            body: {
            para1: "You can report any legitimate claims of intellectual property infringement for items listed on Walmart.com, including claims of copyright, trademark, patent, and counterfeit.Please note that violations of exclusive distribution agreements are not the subject of IP infringement, and Walmart will not take action to enforce such agreements.",
            para2: "Please note that violations of exclusive distribution agreements are not the subject of IP infringement, and Walmart will not take action to enforce such agreements.Please note that violations of exclusive distribution agreements are not the subject of IP infringement, and Walmart will not take action to enforce such agreements.Please note that violations of exclusive distribution agreements are not the subject of IP infringement, and Walmart will not take action to enforce such agreements."
            },
            button: {
            buttonText: "Submit IP claim",
            key: "submit_claim",
            classes: "btn btn-sm  btn-primary"
            }
        }
    ]
    },
    ctaPageConfig: {
        messageContent: {
          para1: "Thank you for claim of IP infringement. We will review your request and let you know whne a decision has been made."
        },
        tiles: [
          {
            svg: "ProblemSolving",
            header: "{content to be added}What are the benefits of Walmart Brand Portal?",
            content: {
              list1: {
                type: "ol",
                steps: [
                  "Streamlined IP claim submission process",
                  "Comprehensive claim tracking dashboard",
                  "Centralized user management services"
                ]
              }
            }
          },
          {
            svg: "GroupPeople",
            header: "{content to be added} Who is eligible to use Walmart Brand Portal?",
            content: {
              list1: {
                type: "ol",
                steps: [
                  "Rights owners with registered trademarks",
                  "Authorized third-party brand protection agencies",
                  "Authorized legal representatives"
                ]
              }
            }
          },
          {
            svg: "Verify",
            header: "{content to be added} What do I need to get started?",
            content: {
              list1: {
                type: "ol",
                steps: [
                  "Company information",
                  "Active trademark registration number",
                  "Verifiable email address"
                ]
              }
            }
          }
        ]
      }
  };

export default WEBFORMCONFIG;
