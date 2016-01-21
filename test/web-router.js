'use strict';

var assert = require('assert');
var Route = require('../src/web-router');


function clear(){
  Route.paths = [];
}

// fake document and window
global.document = {
  getElementsByTagName: function(){
    return [];
  },
};
global.window = {
  location: {
    pathname: '/',
    search: '?key=value',
  },
  history: { 
    pushState: function(arg1, arg2, path){
      window.location.pathname = path;
    }
  }
};


describe('Test Route.init()', function(){
  it('initialize', function(){
    assert.equal(true, Route.init());
  });
});


describe('Test Route.set()', function() {
  clear();
  Route.set('/', function(){ return ''; });
  Route.set('test', function(){ return '/test'; });
  Route.set('new/route', function(){ return true }, function(){ return '/new/route'; });

  Route.paths.forEach(function(route) {
    it('define route: ' + route.path, function () {
      assert.equal(route.path, route.callback());
    });
  });
});


describe('Test Route.group()', function(){
  clear();

  Route.group({
    '/': function(){ return ''; },
    '/test': function(){ return '/test' },
    '/new/route': function(){ return '/new/route'; }
  });

  Route.paths.forEach(function(route) {
    it('define route: ' + route.path, function () {
      assert.equal(route.path, route.callback());
    });
  });
});


describe('Test Route.group() with prefix', function(){
  clear();

  Route.group('prefix', {
    '/': function(){ return '/prefix'; },
    '/test': function(){ return '/prefix/test' },
    '/new/route': function(){ return '/prefix/new/route'; }
  });

  Route.paths.forEach(function(route) {
    it('define route: ' + route.path, function () {
      assert.equal(route.path, route.callback());
    });
  });
});


describe('Test route with variables', function(){
  clear();
  Route.set('test/:id', function(id){ return id; });
  Route.change('/test/55');
  it('get id from route: '+Route.current(), function(){
    assert.equal('55', Route.data.id);
  });
});


describe('Test route params', function(){
  it('Route.data.key should return value', function(){
    assert.equal('value', Route.data.key);
  });
});


describe('Testing middlewares', function(){
  it('on Route.set()', function(){
    clear();
    Route.set('/test', function(){ return false; }, function(){ return false; });
    assert.equal(false, Route.paths[0].middleware());
  });


  it('on Route.group()', function(){
    clear();
    Route.group(function(){ return false; }, {
      '/test': function(){ return true; },
    });

    assert.equal(false, Route.paths[0].middleware());
  });

  it('on Route.group() with prefix', function(){
    clear();
    Route.group('/prefix', function(){ return false; }, {
      '/test': function(){ return true; },
    });

    assert.equal(false, Route.paths[0].middleware());
  });
});


describe('Test Route.change()', function(){
  it('change route to: /test', function(){
    clear();
    Route.set('test', function(){ return true; });
    Route.change('test');
    assert.equal(window.location.pathname, Route.paths[0].path);
  });
});


describe('Test Route.current()', function(){
  it('returns the route: /test', function(){
    assert.equal(window.location.pathname, Route.current());
  });
});


describe('Test Route.notFound()', function(){
  it('triggers notFound', function(){
    var testNotFound = false;
    Route.notFound = function(){ testNotFound = true; };
    Route.change('404');
    assert.equal(true, testNotFound);
  });
});
