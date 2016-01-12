'use strict';

var Route = {

  paths: [],
  realPath: null,
  currentPath: null,
  currentRoute: null,
  data: {},


  init: function(){
    window.onpopstate = function(e){
      this.find();
    }.bind(this);

    this.events.register();
    this.find();
  },


  events: {
    register: function(){
      var elems = document.getElementsByTagName('a');
      for(var i = 0; i < elems.length; i++){
        elems[i].addEventListener('click', this.linkClick);
      }
    },

    linkClick: function(event){
      if(event.target.getAttribute('target') !== '_blank')
        event.preventDefault();
      Route.change(event.target.getAttribute('href'));
    }
  },


  set: function(path, middleware, callback, options){
    if(callback === undefined){
      callback = middleware;
      middleware = function(){ return true; };
    }

    this.build(path, middleware, callback, options);
  },


  build: function(path, middleware, callback, options){

    if(path[0] != '/')
      path = '/'+path;

    if(path[path.length-1] == '/')
      path = path.slice(0, -1);

    this.paths.push({
      path: path,
      middleware: middleware,
      callback: callback
    });
  },


  change: function(path, data){
    if(path[0] != '/')
      path = '/'+path;

    if(window.location.hash)
      path += window.location.hash;

    window.history.pushState("","", path);
    this.find();

    for(var prop in data){
      this.data[prop] = data[prop];
    }
  },


  current: function(options){
    return this;
  },


  getParams: function(){
    if(window.location.search != ''){
      var params = window.location.search.replace('?', '').split('&');
      for(var i = 0; i < params.length; i++){
        var key = decodeURI(params[i].split('=')[0]);
        var value = decodeURI(params[i].split('=')[1]);
        this.data[key] = value;
      }
    }
  },


  find: function(){
    this.data = {}; // reset old route data
    this.getParams(); // check for params

    if(!this.paths)
      return;

    for(var i = 0; i < this.paths.length; i++){
      this.realPath = window.location.pathname;

      if(this.realPath[this.realPath.length-1] == '/')
        this.realPath = this.realPath.slice(0, -1);


      if(!(this.paths[i].path.indexOf(':') > false) && this.paths[i].path === this.realPath){
        // normal route
        if(this.paths[i].middleware()){
          this.currentRoute = i;
          this.currentPath = this.paths[i].path;
          this.paths[i].callback();
          return this;
        }
      }
    }

    // if no path matched check for paths with vars
    this.checkForVars();
  },


  checkForVars: function(){
    for(var i = 0; i < this.paths.length; i++){
      var route = this.paths[i];

      if((route.path.indexOf(':') > false)){
        var r = this.pathConstructor(route.path);
        if(r.path == this.realPath){
          if(route.middleware()){
            this.currentRoute = i;
            this.currentPath = this.paths[i].path;
            route.callback.apply(this, r.data);
            return this;
          }
        }
      }
    }

    this.notFound();
  },


  pathConstructor: function(path){
    path = path.split('/');
    var realPath = this.realPath.split('/');
    var route = {
      data: [],
      path: '',
    };

    for(var i = 0; i < path.length; i++){
      if(path[i][0] === ':'){
        if(realPath[i]){
          this.data[path[i].replace(':', '').replace('?', '')] = decodeURI(realPath[i]);
          route.data.push(decodeURIComponent(realPath[i]));
          path[i] = realPath[i];
        }

        if(path[i].indexOf('?') > false)
          path[i] = realPath[i] || '';
      }
    }

    path = path.join('/');

    if(path[path.length-1] === '/')
      path = path.slice(0, -1);

    route.path = path;
    return route;
  },


  notFound: function(){
    console.warn('Router.js:   Route is not defined...');
  },

};

module.exports = Route;
