## Install web-router with npm
```txt
npm install --save web-router
```

### Run unit test
```
npm test
```

<br>
<br>
## Usage
To setup web-router all you need to do is to reqiure the module with browserify, define your routes and then run the `Route.init()`.
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

#### Without browserify
```html
<script src="/path/to/web-router.js"></script>
```

<br>
<br>
## Use web-router with ES2015 shorthand functions and React
If you use ES2015 and React a good way to define your callbacks is by using the shorthand function syntax like below.
```jsx
Route.group('users', {
  '/':      () => ReactDOM.render(<UserList />, $elem),
  '/:id': (id) => ReactDOM.render(<ShowUser id={id} />, $elem)
});
```
> **Note:** Its a good idea to create a wrapper function for the ```ReactDOM.render```, both for readability and usage.


#### Route groups
Is a powerful way to structure your routes, and gives you the ability to prefix groups of routes. 

```js
// function structure
// prefix (optional): prefix is added to the routes in the group
// middleware (optional): 
// routes: is a object where the object key defines the route and the related function is the callback 
Route.group(prefix, middleware, routes);

// example
Route.group('admin', Auth.admin, {
  'users': UserController.list,
  'user/:id': UserController.show,
  'user/:id/delete': function(){
     // delete user
  }
});
```

#### Optional variables
If you need a variable in a route to be optional, you can do this by adding a `?` at the end
```js
Route.set('user/:id?', UserController.index);
```

#### Route parameters
If you have a url with params `example.com?key=value`. You can access those through the the `Route.data`.
```js
// example url: www.example.com?key=value
Route.data.key // returns value
```

#### Middlewares
Middlewares are used when you want some logic to run before the callback is triggered. If the middleware returns true the callback will run as it normally would. If it returns false the route callback will not be triggered.
```js
// Middleware example
// If you want to check if a user is logged in before the route is available
Route.set('/admin', Auth.check, function(){
  // triggers if Auth.check() returns true
}); 
```


#### Change route
web-router adds an event listener to all `<a href="/hello/world"></a>` to avoid page refreshes and instead triggers the `Route.change('/hello/world')`. 


#### Define 404 error
If you want to, you can rewrite the `Route.notFound()` to what ever you want.
```js
// defined function which is triggered when route isn't found
Route.notFound = function(){
  // do something
};
```
