# covid-19-tracker for Discord and Webhooks

#### Note: This is a personal project and should not be relied upon.

This can be imported and also used as a standalone program. It uses a config file stored at /config.json. If needed
you can also overwrite the config file:
```Javascript
const tracker = require("covid-19-tracker")
const my_config = {} // Insert your config file.
tracker.set_config(my_config)
```
Then you can easily push through all your webhooks the latest updates.
```Javascript
const tracker = require("covid-19-tracker")
tracker.post_data().then(function(){
    console.log("Success")
}).error(function(e){
    console.error(e);
})
```

## Config file
```JSON
{
  "base_url": "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/",
  "webhooks": [
    "https://discordapp.com/api/webhooks/"
  ],
  "suffix": "cases",
  "country": "France",
  "_country_comment": "//Country as written in CSSEGIS daily reports files.",
  "time": {
    "hour": 1,
    "minute": 31
  },
  "template": {
    "embeds": [
      {
        "title": "Informations",
        "description": "The latest news from the Covid-2019",
        "color": 4176176,
        "footer": {
          "text": "Bot"
        },
        "fields": [
          {
            "name": "France",
            "value": "",
            "inline": true
          },
          {
            "name": "World",
            "value": "",
            "inline": true
          },
          {
            "name": "France compared to yesterday",
            "value": "",
            "inline": true
          },
          {
            "name": "World compared to yesterday",
            "value": "",
            "inline": true
          }
        ]
      }
    ]
  }
}
```
You can find your country name in theses files. [Click here](https://github.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_daily_reports/)

# Run it standalone

```bash
npm install node-schedule
#Edit your config file
npm run test
node index.js
```

# Licences & Sources

Default information source: [CSSEGISandData/COVID-19](https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_daily_reports)
```
Terms of Use:

This GitHub repo and its contents herein, including all data, mapping, and analysis, copyright 2020 Johns Hopkins University, all rights reserved, is provided to the public strictly for educational and academic research purposes. The Website relies upon publicly available data from multiple sources, that do not always agree. The Johns Hopkins University hereby disclaims any and all representations and warranties with respect to the Website, including accuracy, fitness for use, and merchantability. Reliance on the Website for medical guidance or use of the Website in commerce is strictly prohibited.

```
node-schedule (MIT): [npm](https://www.npmjs.com/package/node-schedule)

This project use MIT as a licence.