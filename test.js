var testHarness = window.testHarness || {};

module('objectSize tests');
test('returns 0 for empty object', function () {
  var obj, result;

  obj = {};
  result = testHarness.objectSize(obj);
  equal(result, 0);
});

test('returns the key length for an object', function () {
  var obj, result;

  obj = {
    a: 1,
    b: 2,
    c: 3
  };

  result = testHarness.objectSize(obj);
  equal(result, 3);
});

module('buildQueryUrl tests');
test('returns baseUrl for an empty query', function () {
  var result = testHarness.buildQueryUrl('http://baseurl', {});
  equal(result, 'http://baseurl');
});

test('returns baseUrl with HTTP parameters', function () {
  var result, query;
  query = {
    country: 'USA',
    since: '2010-01-01'
  };

  result = testHarness.buildQueryUrl('http://baseurl', query);

  equal(result, 'http://baseurl?country=USA&since=2010-01-01');
});

test('handles the case where the base URL has a trailing slash', function () {
  var result, query;

  query = {
    country: 'USA',
    since: '2010-01-01'
  };

  result = testHarness.buildQueryUrl('http://baseurl/', query);

  equal(result, 'http://baseurl?country=USA&since=2010-01-01');
});

module('filterUnusableEvents tests');
test('rejects events with the wrong status', function () {
  var result, events = [
    {
      event_status: 'C',
      location: {
        lat: 10,  
        lng: 10
      }
    },
    {
      event_status: 'P',
      location: {
        lat: 10,  
        lng: 10
      }
    },
    {
      event_status: 'T',
      location: {
        lat: 10,  
        lng: 10
      }
    }
  ];

  result = testHarness.filterUnusableEvents(events);

  equal(result.length, 0);
});

test('only takes events with good or working status', function () {
  var result, events = [
    {
      event_status: 'W',
      location: {
        lat: 10,  
        lng: 10
      }
    },
    {
      event_status: 'G',
      location: {
        lat: 10,  
        lng: 10
      }
    },
    {
      event_status: 'T',
      location: {
        lat: 10,  
        lng: 10
      }
    }
  ];

  result = testHarness.filterUnusableEvents(events);

  equal(result.length, 2);
});

test('only takes events with latitude and longitude', function () {
  var result, events = [
    {
      event_status: 'W',
      location: {
        lat: 10,  
        lng: 10
      }
    },
    {
      event_status: 'G'
    },
    {
      event_status: 'G',
      location: {
        lat: 10,  
      }
    }
  ];  

  result = testHarness.filterUnusableEvents(events);
  
  equal(result.length, 1);
});
