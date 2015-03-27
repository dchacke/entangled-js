# entangled-js
Client side counterpart of Ruby gem [Entangled](https://github.com/dchacke/entangled) in plain JavaScript.

(There is also [one for Angular](https://github.com/dchacke/entangled-angular).)

## Installation
You can either download or reference the file `entangled.js` from this repository, or simply install it with Bower:

```shell
$ bower install entangled-js
```

Then include it in your HTML.

## Usage
**[First, you need to set up your backend.](https://github.com/dchacke/entangled)**

Then, consider a `Message` object for a chat app:

```javascript
var Message = new Entangled('ws://localhost:3000/messages');
```

The Entangled constructor takes one argument when instantiated: the URL of your resource's index action (in this case, `/messages`). Note that the socket URL looks just like a standard restful URL with http, except that the protocol part has been switched with `ws` to use the websocket protocol. Also note that you need to use `wss` instead if you want to use SSL.

The Entangled constructor comes with these functions:

- `new(params)`
- `create(params, callback)`
- `find(id, callback)`
- `all(callback)`

...and the following functions on returned objects:

- `$save(callback)`
- `$update(params, callback)`
- `$destroy(callback)`

They're just like class and instance methods in Active Record.

Here are some examples:

```javascript
// To instantiate a blank message, e.g. for a form;
// You can optionally pass in an object to new() to
// set some default values
var message = Message.new();

// To instantiate and save a message in one go
Message.create({ body: 'text' }, function(message) {
  // Message was persisted on the server and is
  // available here
});

// To retrieve a specific message from the server
// with id 1 and subscribe to its channel
Message.find(1, function(message) {
  // Message with id 1 available here
});

// To retrieve all messages from the server and
// subscribe to the collection's channel
Message.all(function(messages) {
  // All messages available here
});

// To store a newly instantiated or update an existing message.
// If saved successfully, the message is updated in place
// with the attributes id, created_at and updated_at
message.body = 'new body';
message.$save(function() {
  // Do stuff after save
});

// To update a newly instantiated or existing message in place.
// If updated successfully, the message is updated in place
// with the attributes id, created_at and updated_at
message.$update({ body: 'new body' }, function() {
  // Do stuff after update
});

// To destroy a message
message.$destroy(function() {
  // Do stuff after destroy
});
```

All functions above will interact with your server's controllers in real time.

### Validations
Objects from the Entangled constructor automatically receive ActiveRecord's error messages from your model when you `$save()`. An additional property called `errors` containing the error messages is available, formatted the same way you're used to from calling `.errors` on a model in Rails.

For example, consider the following scenario:

```ruby
# Message model (Rails)
validates :body, presence: true
```

```javascript
// Front end
message.$save(function() {
  console.log(message.errors);
  // => { body: ["can't be blank"] }
});
```

You could then display these error messages to your users.

To check if a resource is valid, you can use `$valid()` and `$invalid()`. Both functions return booleans. For example:

```javascript
message.$save(function() {
  // Check if record has no errors
  if (message.$valid()) { // similar to ActiveRecord's .valid?
    alert('Yay!');
  }

  // Check if record errors
  if (message.$invalid()) { // similar to ActiveRecord's .invalid?
    alert('Nay!');
  }
});
```

Note that `$valid()` and `$invalid()` should only be used after $saving a resource, i.e. in the callback of `$save`, since they don't actually invoke server side validations. They only check if a resource contains errors.

### Persistence
Just as with ActiveRecord's `persisted?` method, you can use `$persisted()` on an object to check if it was successfully stored in the database.

```javascript
message.$persisted();
// => true or false
```

### Associations
Entangled currently supports one-to-many associations.

Inform your parent about the association:

```javascript
var Parent = new Entangled('ws://localhost:3000/parents');

// Set up association  
Parent.hasMany('children');
```

This makes a `children()` function available on your parent records on which you can chain all other functions to fetch/manipulate data:

```javascript
Parent.find(1, function(parent) {
  parent.children().all(function(children) {
    // children here all belong to parent with id 1
  });

  parent.children().find(1, function(child) {
    // child has id 1 and belongs to parent with id 1
  });

  parent.children().create({ foo: 'bar' }, function(child) {
    // child has been persisted and associated with parent
  });

  // etc
});
```

This is the way to go if you want to fetch records that only belong to a certain record, or create records that should belong to a parent record. In short, it is ideal to scope records to parent records.

Naturally, all nested records are also synced in real time across all connected clients.

## Contributing
This repo is only a mirror for bower. Contribution happens in the gem's [main repo](https://github.com/dchacke/entangled#contributing).
