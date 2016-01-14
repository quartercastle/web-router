#### Install web-router with npm
```txt
npm install --save web-router
```


#### Usage
To setup web-router all you need to do is to reqiure the module, define your routes and then run the `Route.init()`.
```js
var Route = require('web-router');

Route.set('/hello/:variable', function(variable){
  console.log('hello', variable);
});

Route.group({
  'path/to/something': function(){},
  'path/to/something/else': function(){},
});

Route.init();
```

##### Route groups
Is a powerful way to structure your routes, and gives you the ability to namespace groups of routes. 

```js
// function structure
// namespace (optional): the grouped routes while have the namespace appended
// middleware (optional): 
// routes: is a object where the object key defines the route and the related function is the callback 
Route.group(namespace, middleware, routes);

// example
Route.group('admin', Auth.admin, {
  'users': UserController.list,
  'user/:id': UserController.show,
  'user/:id/delete': function(){
     // delete user
  }
});
```

##### Optional variables
If you need a variable in a route to be optional, you can do this by adding a `?` at the end
```js
Route.set('user/:id?', UserController.index);
```

##### Route parameters
If you have a url with params `example.com?key=value`. You can access those through the the `Route.data`.
```js
// example url: www.example.com?key=value
Route.data.key // returns value
```

##### Middlewares
Middlewares are used when you want some logic to run before the callback is triggered. If the middleware returns true the callback will run as it normally would. If it returns false the route callback will not be triggered.
```js
// Middleware example
// If you want to check if a user is logged before the route is available
Route.set('/admin', Auth.check, function(){
  // triggers if Auth.check() returns true
}); 
```  


##### Change route
web-router adds an event listener to all `<a href="/hello/world"></a>` to avoid page refreshes and instead triggers the `Route.change('/hello/world')`. 


##### Define 404 error
If you want to, you can rewrite the `Route.notFound()` to what ever you want.
```js
// defined function which is triggered when route isn't found
Route.notFound = function(){
  // do something
};
```
