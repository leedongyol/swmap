# swmap

A jQuery plugin to assist in creating a Startup Weekend event map for a website.

This tool will leverage the Startup Weekend SWOOP API to pull a list of events
that respects a given query.

## Usage

First, make sure you include the dependencies on the HTML page you want
the map on.

swmap depends on
* [jQuery](http://jquery.com/)
* [moment.js](http://momentjs.com/)
* [Google Maps API](https://developers.google.com/maps/documentation/javascript/)
* Your own Google Maps API key

Then, include the swmap code on the page. Feel free to use the minified
version in production.

```html
<script src="http://code.jquery.com/jquery-1.7.2.min.js"></script>
<script src="http://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&sensor=true"></script>
<script src="/js/moment.js"></script>
<script scr="/js/swmap.min.js"></script>
```

Once that is done, make sure there is an area on the page defined
to render the map on:

```html
<body>
  <div id="mapArea"></div>
</body>
```

Then you need to initialize the map plugin and pass it any query parameters
you want to use:

```javascript
$(function () {
  $('#mapArea').swmap({
    query: {
      country: 'USA',
      since: '2010-01-01'
    },
    mapSettings: {
      center: new google.maps.LatLng(lat, lng)
    },
    markerSettings: {
      color: '333333',
      showDot: false
    }
  }); 
});
```

The query parameters mirror the same query parameters the SWOOP API
understands. You'll have to check out the SWOOP documentation to know
what other API query options are available to you.

## Development and Testing

Tests are written with [QUnit](http://qunitjs.com/cookbook/). To run the tests for swmap,
open test.html in your web browser.

To run jslint on the project locally, pull down [jslint](https://github.com/reid/node-jslint)
on npm and run it on `swmap.js`.

These are the recommended jslint settings:

`jslint swmap.js --indent 2 --windows true --browser true`

We use [uglify-js](https://github.com/mishoo/UglifyJS) to generate minified versions of
our code.
