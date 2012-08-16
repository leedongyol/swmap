/**
Copyright (c) 2012 Startup Weekend

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
"use strict";

(function ($, mapsApi, moment) {
  // Functions
  var buildQueryUrl, testHarness, objectSize,
    processEventData, initializeMap, filterUnusableEvents,
    addMarkersToMap, generateMapMarkers, generateMarkerTitle,
    showInfoWindow, getInfoWindowInstance, createStyledMarkerImage,
    createStyleMarkersShadow, getEventTitle, getStartDateFormatted,
    getURL;

  if (window.testHarness) {
    testHarness = window.testHarness;
  }

  /**
   * Given an object, return the number of keys
   */
  objectSize = function (obj) {
    if (obj.length) { return obj.length; }

    var size = 0, key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) { size += 1; }
    }
    return size;
  };
  if (testHarness) { testHarness.objectSize = objectSize; }

  /**
   * Build a URL with the query parameters added as
   * URL parameters. This URL will represent the API
   * endpoint for getting events
   *
   * @baseUrl - A string representing the base API URL, including the protocol
   * @query - An object holding key-value pairs representing the API query
   */
  buildQueryUrl = function (baseUrl, query) {
    var prop, finalUrl, queryTerms = [];

    // Chop off the trailing slash if it exists
    if (baseUrl[baseUrl.length - 1] === '/') {
      baseUrl = baseUrl.slice(0, -1);
    }

    if (query && objectSize(query) > 0) {
      for (prop in query) {
        if (query.hasOwnProperty(prop)) {
          queryTerms.push(prop + "=" + query[prop]);
        }
      }

      finalUrl = baseUrl + "?" + queryTerms.join("&");
    } else {
      finalUrl = baseUrl;
    }

    return finalUrl;
  };
  if (testHarness) { testHarness.buildQueryUrl = buildQueryUrl; }

  /**
   * Initialize the map via the Google Maps API and return
   * the instance
   */
  initializeMap = function (domElement, mapOptions) {
    var map = new mapsApi.Map(domElement, mapOptions);

    // Close the info window if the user clicks the map
    mapsApi.event.addListener(map, 'click', function () {
      getInfoWindowInstance().close();
    });

    return map;
  };

  /**
   * Given a list of events, only return the ones we can
   * use on the map. In this case, usable events are in
   * a Good or Working state, and have location data attached
   * on them
   */
  filterUnusableEvents = function (events) {
    var goodEvents = [];
    $.each(events, function (idx, event) {
      if (event.event_status && (event.event_status === 'G' || event.event_status === 'W')) {
        if (event.location && event.location.lat && event.location.lng) {
          goodEvents.push(event);
        }
      }
    });

    return goodEvents;
  };
  if (testHarness) { testHarness.filterUnusableEvents = filterUnusableEvents; }

  /**
   * Given an event object, generate a title suitable
   * for a map marker object
   */
  generateMarkerTitle = function (event) {
    var titleString;

    titleString = getEventTitle(event);
    titleString += getStartDateFormatted(event);
    titleString += getURL(event);

    return titleString;
  };
  if (testHarness) { testHarness.generateMarkerTitle = generateMarkerTitle; }

  /**
   * Given an event object, generate the title
   */
  getEventTitle = function (event) {
    var titleTerms = [];
    titleTerms.push(event.city);

    if (event.state && event.state.length > 0) {
      titleTerms.push(event.state);
    }
    if (event.country && event.country.length > 0) {
      titleTerms.push(event.country);
    }

    return titleTerms.join(', ');
  };

  /**
   * Given an event object, return the start date as a string
   */
  getStartDateFormatted = function (event) {
    var startDateFormatted = "";
    if (event.start_date) {
      startDateFormatted = "<br />" + moment(event.start_date).utc().format("MMM D, YYYY");
    }
    return startDateFormatted;
  };

  /**
   * Given an event object, return the url
   */
  getURL = function (event) {
    var actualUrl, url;
    url = "";
    if (event.website && event.website.length > 0) {
      if (event.website.indexOf('http') < 0) {
        actualUrl = 'http://' + event.website;
      } else {
        actualUrl = event.website;
      }

      url =
        "<br /><a target='_blank' href='" +
        actualUrl +
        "'>" +
        event.website +
        "</a>";
    }

    return url;
  };

  /**
   * Creates an info window instance if it doesn't already exist
   * and returns that instance everytime it is invoked thereafter
   *
   * @map - The map the info window is bound to
   */
  getInfoWindowInstance = function (map) {
    var infoWindowInstance = new mapsApi.InfoWindow({
      map: map
    });

    // Javascript mystery function rewriting action
    getInfoWindowInstance = function () {
      return infoWindowInstance;
    };

    return infoWindowInstance;
  };

  /**
   * Creates a pop-up info window over the marker when clicked
   *
   * @content - A string containing the text for the info window
   * @map - The map to add the window to
   * @marker - The marker the info window floats over
   */
  showInfoWindow = function (content, map, marker) {
    getInfoWindowInstance().setContent(content);
    getInfoWindowInstance().open(map, marker);
  };

  /**
   * Uses the Google Charts API to create a styled image
   * for the marker.
   *
   * @color - A string representing the hex value for the marker color. Do not include a '#'
   * @showDot - A boolean to determine whether a dot should be shown on the marker
   */
  createStyledMarkerImage = function (color, showDot) {
    var url;

    url = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + color;
    if (showDot === false) {
      url += "|" + color;
    }

    return new mapsApi.MarkerImage(url,
        new mapsApi.Size(21, 34),
        new mapsApi.Point(0, 0),
        new mapsApi.Point(10, 34));
  };

  /**
   * Uses the Google Charts API to create a shadow for a marker
   */
  createStyleMarkersShadow = function () {
    var url = "http://chart.apis.google.com/chart?chst=d_map_pin_shadow";
    return new mapsApi.MarkerImage(url,
        new mapsApi.Size(40, 37),
        new mapsApi.Point(0, 0),
        new mapsApi.Point(12, 35));
  };

  /**
   * Given an array of event objects, generate map markers for them
   */
  generateMapMarkers = function (events, markerSettings) {
    var markers = [];

    $.each(events, function (idx, event) {
      var currentDay, markerColor, markerDot = false, marker;

      // Figure out the logic for the map styles

      // Does the client care about past/future events?
      if (markerSettings.pastEvents || markerSettings.futureEvents) {
        currentDay = moment().utc();
        if (moment(event.start_date).utc().diff(currentDay) >= 0) {
          // Future styling
          if (markerSettings.futureEvents) {
            markerColor =
              markerSettings.futureEvents.color === null ? markerSettings.color : markerSettings.futureEvents.color;
            markerDot =
              markerSettings.futureEvents.showDot === null ? markerSettings.showDot : markerSettings.futureEvents.showDot;
          } else {
            // Client didn't provide future event styling!!!
            // Use the default color so there is at least some differentiation
            markerColor = markerSettings.color;
            markerDot = markerSettings.showDot;
          }
        } else {
          // Past styling
          if (markerSettings.pastEvents) {
            markerColor = markerSettings.pastEvents.color === null ? markerSettings.color : markerSettings.pastEvents.color;
            markerDot = markerSettings.pastEvents.showDot === null ? markerSettings.showDot : markerSettings.pastEvents.showDot;
          } else {
            // Client didn't provide past event styling!!!
            // Use the default color so there is at least some differentiation
            markerColor = markerSettings.color;
            markerDot = markerSettings.showDot;
          }
        }
      } else {
        // Either the user overwrote the default settings or we are using the defaults
        markerColor = markerSettings.color;
        markerDot = markerSettings.showDot;
      }

      marker = new mapsApi.Marker({
        position: new mapsApi.LatLng(event.location.lat, event.location.lng),
        title: generateMarkerTitle(event),
        icon: createStyledMarkerImage(markerColor, markerDot),
        shadow: createStyleMarkersShadow()
      });

      markers.push(marker);
    });

    return markers;
  };

  /**
   * Takes a series of Google Maps markers and adds them to the map
   *
   * @map - An already instantiated Google Map object
   * @events - An array of Google Map Marker objects
   */
  addMarkersToMap = function (map, markers) {
    $.each(markers, function (idx, marker) {
      // Configure event listeners
      mapsApi.event.addListener(marker, 'click', function () {
        showInfoWindow(marker.title, map, marker);
      });

      marker.setMap(map);
    });
  };

  /**
   * A function to receive data from the API server, process
   * it, and kick off other processing activity
   *
   * @data - An array of JSON objects representing events
   */
  processEventData = function (data, settings, domElement) {
    var map, eventWorkingSet, markers;

    // Create the map
    map = initializeMap(domElement, settings.mapSettings);

    // Initialize info window instance
    getInfoWindowInstance(map);

    // Loop through the events returned from the server and filter
    // out those that don't meet the criteria for our map
    eventWorkingSet = filterUnusableEvents(data);

    markers = generateMapMarkers(eventWorkingSet, settings.markerSettings);
    addMarkersToMap(map, markers);
  };
  if (testHarness) { testHarness.processEventData = processEventData; }

  /**
   * This plugin creates a map based on data points
   * provided by the SWOOP API
   *
   * @mapId - The CSS selector for the area to render the map
   * @opts - The settings for the map plugin
   */
  $.fn.swmap = function (opts) {
    var defaults, settings, apiUrl, domElement,
      defaultMapSettings, userMapSettings, defaultMarkerSettings,
      userMarkerSettings;

    userMapSettings = opts.mapSettings;
    userMarkerSettings = opts.markerSettings;

    defaults = {
      url: 'http://swoop.startupweekend.org/events',
      query: {}
    };

    defaultMapSettings = {
      center: new mapsApi.LatLng(30, 20),
      zoom: 2,
      minZoom: 2,
      maxZoom: 8,
      zoomControl: true,
      mapTypeId: mapsApi.MapTypeId.ROADMAP
    };

    defaultMarkerSettings = {
      color: "FE7569",
      showDot: true
    };

    // Grab the client's options and set up options
    // with defaults for settings that weren't specified
    settings = $.extend(defaults, opts);

    settings.mapSettings = $.extend(defaultMapSettings, userMapSettings);
    settings.markerSettings = $.extend(defaultMarkerSettings, userMarkerSettings);

    // Build the API URL based on query parameters
    // if they are supplied
    apiUrl = buildQueryUrl(settings.url, settings.query);
    domElement = this[0];

    $.ajax({
      dataType: 'jsonp',
      url: apiUrl,
      success: function (data) { processEventData(data, settings, domElement); }
    });
  };
}(jQuery, google.maps, moment));
