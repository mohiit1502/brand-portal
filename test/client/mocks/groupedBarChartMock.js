const GroupedBarChartProps = {
  "classes": "c-ChartsContainer__content__body",
  "chart": {
    "key": "claimType",
    "group": [
      {
        "name": "claimsCount"
      },
      {
        "name": "itemsCount",
        "colorMapper": "Items"
      }
    ]
  },
  "data": [
    {
      "claimType": "Trademark",
      "claimsCount": 2,
      "itemsCount": 2
    }
  ],
  "keys": [
    "Counterfeit",
    "Trademark",
    "Copyright",
    "Patent",
    "Items"
  ],
  "colors": {
    "Counterfeit": "#1F4F94",
    "Trademark": "#3483B9",
    "Copyright": "#71C5DF",
    "Patent": "#ADDDE9",
    "Items": "#E4B33F"
  },
  "currentFilter": {
    "orgId": "f9bccf12-49d2-4387-b047-9670ac66f7c0",
    "emailId": "subhadeep.dey@walmart.com",
    "role": "Super Admin",
    "widget-claims-by-type": {
      "dateRange": "last30days"
    },
    "widget-claims-by-brand": {
      "dateRange": "last30days"
    },
    "widget-claims-by-user": {
      "dateRange": "last30days"
    }
  },
  "containerId": "widget-claims-by-type",
  "sortingArray": [
    "Counterfeit",
    "Trademark",
    "Copyright",
    "Patent"
  ]
}

export default GroupedBarChartProps;
