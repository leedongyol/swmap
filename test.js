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
