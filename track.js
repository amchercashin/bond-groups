var currentEncodedURL = encodeURIComponent(window.location.href)
var API_ENDPOINT = "https://0biunsjmwk.execute-api.us-east-1.amazonaws.com/dev/nandolytics/"
var getEndpoint = API_ENDPOINT + currentEncodedURL
var recordEndpoint = API_ENDPOINT + "record"

// Record a visit to this site
fetch(recordEndpoint, {
  method: 'post',
  crossDomain: true,
  body: JSON.stringify({"siteUrl":currentEncodedURL})
}).then(r => r.json())
  .then(data => console.log(data))
  .catch(e => console.log("The POST request for Nandolytics failed"))

// Console log current site visits
fetch(getEndpoint,{crossDomain: true}).then(r => r.json())
  .then(data => {
    console.log(data['siteHits'])
  })
  .catch(e => console.log("The GET request for Nandolytics failed"))
