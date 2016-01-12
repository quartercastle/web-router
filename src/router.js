'use strict';

module.exports = {

  paths: [],
  currentPath: null,
  currentRoute: null,
  data: {},

  init: function(){
    window.onpopstate = function(e){
      this.find();
    }.bind(this);

    this.events();
    this.find();
  },


  events: function(){
    $('body').on('tap click', 'a', function(event){
      if($(this).attr('target') != '_blank'){
        event.preventDefault();
        Route.change($(this).attr('href'));
      }
    });
  },


  set: function(path, callback){
    this.build('GET', path, callback); 
  },


  build: function(method, path, callback){

    if(path[0] != '/')
      path = '/'+path;

    if(path[path.length-1] == '/')
      path = path.slice(0, -1);

    this.paths.push({ method: method, path: path, callback: callback });
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


  find: function(){
    this.data = {};

    if(!this.paths)
      return;

    if(window.location.search != ''){
      var params = window.location.search.replace('?', '').split('&');
      for(var i = 0; i < params.length; i++){
        var key = decodeURI(params[i].split('=')[0]);
        var value = decodeURI(params[i].split('=')[1]);
        this.data[key] = value;
      }
    }

    for(var i = 0; i < this.paths.length; i++){
      var realPath = window.location.pathname;
      var data = this.checkForVars(i);

      if(realPath[realPath.length-1] == '/')
        realPath = realPath.slice(0, -1);

      this.currentRoute = i;
      this.currentPath = this.paths[i].path;

      if(this.paths[i].path === realPath){
        this.paths[i].callback();
        return this;
      } else if(data.path === realPath) {
        this.paths[i].callback.apply(this, data.array);
        return this;
      }
    }

    this.notFound();
  },

  checkForVars: function(index){
    var path = this.paths[index].path.split('/');
    var realPath = window.location.pathname.split('/');
    var newPath = '';
    var data = {
      array: [],
      path: '',
    };

    if(realPath[realPath.length-1] == '/')
      realPath = realPath.slice(0, -1);

    for(var i = 0; i < path.length; i++){
      if(i > 0){
        if(path[i][0] == ':'){
          if(realPath[i]){
            this.data[path[i].replace(':', '')] = decodeURI(realPath[i]);
            data.array.push(decodeURIComponent(realPath[i]));
            newPath += '/'+realPath[i];
          } else {
            newPath += '/'+path[i];
          }
        } else {
          newPath += '/'+path[i];
        }
      }
    }
    
    data.path = newPath;
    return data;
  },

  notFound: function(){

  },

};