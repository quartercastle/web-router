'use strict';

var Route = (function(){

  /**
   * Variables
   */
  var realPath = null,
      currentPath = null,
      currentRouteIndex =  null;


  /**
   * events
   * This object handles the registration and handling of events related to the Route object
   *
   * @type {Object}
   */
  var events = {
    register: function(){
      var elems = document.getElementsByTagName('a');
      for(var i = 0; i < elems.length; i++){
        elems[i].addEventListener('click', events.linkClick);
      }
    },

    linkClick: function(event){
      if(event.target.getAttribute('target') !== '_blank')
        event.preventDefault();
      Route.change(event.target.getAttribute('href'));
    }
  };


  /**
   * build
   * Append routes to the available paths array
   *
   * @param  {String}   path       The path to append to the path list
   * @param  {Function} middleware The middle where function, if middleware isn't defined then its null
   * @param  {Function} callback   The callback function
   * @param  {[Object]} options    Options, not used right now, maybe for named routes in the future
   * @return {undefined}
   */
  function build(path, middleware, callback, options){
    if(path[0] != '/')
      path = '/'+path;

    if(path[path.length-1] == '/')
      path = path.slice(0, -1);

    Route.paths.push({
      path: path,
      middleware: middleware,
      callback: callback
    });
  }


  /**
   * getParams
   * This function retrieves url params and appends it to the Route.data object
   *
   * @return {undefined}
   */
  function getParams(){
    if(window.location.search != ''){
      var params = window.location.search.replace('?', '').split('&');
      for(var i = 0; i < params.length; i++){
        var key = decodeURI(params[i].split('=')[0]);
        var value = decodeURI(params[i].split('=')[1]);
        Route.data[key] = value;
      }
    }
  }


  /**
   * pathConstructor
   * Creates a defined route with variables and turns it into a usable route
   *
   * @param  {Sring} path is a string of the route which needs to be formated
   * @return {Object} contains the formatted route and a mapping of the variables in the route
   */
  function pathConstructor(path){
    path = path.split('/');
    var rp = realPath.split('/');
    var route = {
      data: [],
      path: '',
    };

    for(var i = 0; i < path.length; i++){
      if(path[i][0] === ':'){
        if(rp[i]){
          Route.data[path[i].replace(':', '').replace('?', '')] = decodeURI(rp[i]);
          route.data.push(decodeURIComponent(rp[i]));
          path[i] = rp[i];
        }

        if(path[i].indexOf('?') > false)
          path[i] = rp[i] || '';
      }
    }

    path = path.join('/');

    if(path[path.length-1] === '/')
      path = path.slice(0, -1);

    route.path = path;
    return route;
  }


  /**
   * find
   * Find iterates over the registered routes and looks for matches
   * if no route matches, the start look for routes with variables
   *
   * @return {undefined}
   */
  function find(){
    Route.data = {}; // reset old route data
    getParams(); // check for params

    if(!Route.paths)
      return;

    realPath = window.location.pathname;

    if(realPath[realPath.length-1] == '/')
      realPath = realPath.slice(0, -1);

    for(var i = 0; i < Route.paths.length; i++){
      if(!(Route.paths[i].path.indexOf(':') > false) && Route.paths[i].path === realPath){
        // normal route
        if(Route.paths[i].middleware()){
          Route.paths[i].callback();
          setCurrentRoute(i);
          return Route;
        }
      }
    }

    // if no path matched check for paths with vars
    checkForVars();
  }


  /**
   * checkForVars
   * Looks for routes with variables. If nothing matches then trigger Route.notFound()
   *
   * @return {undefined}
   */
  function checkForVars(){
    for(var i = 0; i < Route.paths.length; i++){
      var route = Route.paths[i];

      if((route.path.indexOf(':') > false)){
        var r = pathConstructor(route.path);
        if(r.path == realPath){
          if(route.middleware()){
            route.callback.apply(Route, r.data);
            setCurrentRoute(i);
            return Route;
          }
        }
      }
    }

    Route.notFound();
  }


  /**
   * setCurrentRoute
   *
   * @param {int} i the iteration of paths
   */
  function setCurrentRoute(i){
    currentRouteIndex = i;
    currentPath = realPath;
    events.register();
  }


  /**
   * Route
   * This is the visible object, to handle the routing
   *
   * @type {Object}
   */
  var Route = {

    paths: [],
    data: {},


    init: function(){
      window.onpopstate = function(e){
        find();
      }.bind(this);

      events.register();
      find();
    },


    set: function(path, middleware, callback, options){
      if(callback === undefined){
        callback = middleware;
        middleware = function(){ return true; };
      }

      build(path, middleware, callback, options);
    },


    change: function(path, data){
      if(path[0] != '/')
        path = '/'+path;

      if(window.location.hash)
        path += window.location.hash;

      window.history.pushState("","", path);
      find();

      for(var prop in data){
        this.data[prop] = data[prop];
      }
    },


    current: function(options){
      return currentPath;
    },


    notFound: function(){
      console.warn('Router.js:   Route is not defined...');
    },

  };

  return Route;
}());

if(typeof module === "object" && typeof module.exports === "object"){
  module.exports = Route;
}
