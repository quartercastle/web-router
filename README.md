# web-router

Web-router is a powerful and lightweight client-side router. 

### Install Router.js with npm
```txt
npm install --save web-router
```


### Usage
To setup Router.js all you need to do is to reqiure the module, define your routes and then run the `Route.init()`.
```js
var Route = require('web-router');

Route.set('/hello/:variable', function(variable){
  console.log('hello', variable);
});

Route.init();
```


#### Optional variables
If you need a variable in a route to be optional, you can do this by adding a `?` at the end
```js
Route.set('user/:id?', UserController.index);
```


#### Middlewares
Middlewares are used when you want some logic to run before the callback is triggered. If the middleware returns true the callback will run as it normally would. If it returns false the route callback will not be triggered.
```js
// Middleware example
// If you want to check if a user is logged before the route is available
Route.set('/admin', Auth.check(), function(){
  // triggers if Auth.check() returns true
}); 
```  


#### Change route
Router.js adds an event listener to all `<a href="#"></a>` to avoid page refreshes and instead triggers the `Route.change('/hello/world')`. 


#### Define 404 error
If you want to, you can rewrite the `Route.notFound()` to what ever you want.
```js
// defined function which is triggered when route isn't found
Route.notFound = function(){
  // do something
};
```
