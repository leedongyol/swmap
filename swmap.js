(function ($) {
  /**
   * Build a URL with the query parameters added as 
   * URL parameters. This URL will represent the API
   * endpoint for getting events
   *
   * @baseUrl - A string representing the base API URL, including the protocol
   * @query - An object holding key-value pairs representing the API query
   */
  var buildQueryUrl = function (baseUrl, query) {
    var prop, finalUrl;
    
    finalUrl = baseUrl + "?";
    for (prop in query) {
      if (query.hasOwnProperty(prop)) {
        finalUrl += prop + "=" + query[prop]; 
      } 
    }

    return finalUrl;
  };

  /**
   * This plugin creates a map based on data points
   * provided by the SWOOP API.
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
    if (hasOwnProperty.call(settings, 'query') && settings.query !== null && settings.query.length > 0) {
      apiUrl = buildQueryUrl(settings.url, settings.query); 
    } else {
      apiUrl = settings.url; 
    }
  };
})(jQuery);
