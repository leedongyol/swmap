"use strict";

(function ($) {
  var buildQueryUrl, testHarness, objectSize;

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
   * This plugin creates a map based on data points
   * provided by the SWOOP API
   *
   * @mapId - The CSS selector for the area to render the map
   * @opts - The settings for the map plugin
   */
  $.fn.swmap = function (mapId, opts) {
    var defaults, settings, apiUrl;

    defaults = {
      url: 'http://swoop.startupweekend.org/events'
    };

    // Grab the client's options and set up options
    // with defaults for settings that weren't specified
    settings = $.extend(defaults, opts);

    // Build the API URL based on query parameters
    // if they are supplied
    if (settings.query !== null && objectSize(settings.query) > 0) {
      apiUrl = buildQueryUrl(settings.url, settings.query);
    } else {
      apiUrl = settings.url;
    }
  };
}(jQuery));
