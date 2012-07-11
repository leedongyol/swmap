"use strict";

(function ($, mapsApi) {
  var buildQueryUrl, testHarness, objectSize, 
      processEventData, initializeMap, filterUnusableEvents;

  if (window.testHarness) {
    testHarness = window.testHarness;
  }

  /**
   * Given an object, return the number of keys
   */
  objectSize = function (obj) {
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
  initializeMap = function (mapId, mapOptions) {
    return new mapsApi.Map($(mapId), mapOptions); 
  }

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
        if (event.location && event.location['lat'] && event.location['lng']) {
          goodEvents.push(event);
        } 
      } 
    });

    return goodEvents;
  };
  if (testHarness) { testHarness.filterUnusableEvents = filterUnusableEvents; }

  /**
   * A function to receive data from the API server, process
   * it, and kick off other processing activity
   *
   * @data - An array of JSON objects representing events
   */
  processEventData = function (data, settings) {
    var map, eventWorkingSet;

    map = initializeMap(settings.mapId, settings.mapSettings);

    // Loop through the events returned from the server and filter
    // out those that don't meet the criteria for our map
    eventWorkingSet = filterUnusableEvents(data);
  };
  if (testHarness) { testHarness.processEventData = processEventData; }

  /**
   * This plugin creates a map based on data points
   * provided by the SWOOP API
   *
   * @mapId - The CSS selector for the area to render the map
   * @opts - The settings for the map plugin
   */
  $.fn.swmap = function (mapId, opts) {
    var defaults, settings, apiUrl;

    defaults = {
      url: 'http://swoop.startupweekend.org/events',
      query: {},
      mapId: mapId,
      mapSettings: {
        center: new mapsApi.LatLng(30, 20),
        zoom: 2,
        minZoom: 2,
        maxZoom: 8,
        zoomControl: true,
        mapsTypeId: mapsApi.MapTypeId.ROADMAP
      }
    };

    // Grab the client's options and set up options
    // with defaults for settings that weren't specified
    settings = $.extend(defaults, opts);

    // Build the API URL based on query parameters
    // if they are supplied
    apiUrl = buildQueryUrl(settings.url, settings.query);

    $.ajax({
      dataType: 'jsonp',
      url: apiUrl,
      success: function (data) { processEventData (data, settings); }
    });
  };
}(jQuery, google.maps));
