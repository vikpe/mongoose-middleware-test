# Mongoose middleware test
Example of how to test mongoose middleware without a database connection and/or triggering a model method (save/update etc).

**Problem**
* Mocking model methods (eg `doc.save()`) prevents registered hooks to be called.

**Solution**
1. Expose the middleware function from the Schema.
2. Rewrite the `this` context during tests.

## Source
(a simple middleware to update the property `slug` on `save`)

```javascript
var mongoose = require('mongoose');
var _kebabCase = require('lodash/kebabCase');

var PostSchema = new mongoose.Schema({
  name: String,
  slug: String,
});

PostSchema._middlewareFunctions = {
  setSlugFromName: function(next) {
    this.slug = _kebabCase(this.name);

    next();
  },
};

PostSchema.pre('save', PostSchema._middlewareFunctions.setSlugFromName);

module.exports = PostSchema;
```

## Test
```javascript
var expect = require('expect.js');
var sinon = require('sinon');
var _bind = require('lodash/bind');
var PostSchema = require('../src/PostSchema');

describe('Middleware', function() {
  it('should set slug before save', function() {
    var postDoc = {
      name: 'Polly is a Black Parrot',
    };

    var thisContext = postDoc;
    var boundMiddlewareFunc = _bind(PostSchema._middlewareFunctions.setSlugFromName, thisContext);
    var next = sinon.spy();

    boundMiddlewareFunc(next);

    expect(postDoc).to.eql({
      name: 'Polly is a Black Parrot',
      slug: 'polly-is-a-black-parrot',
    });

    sinon.assert.calledOnce(next);
  });
});
```

# Installation / Usage
1. Clone/download repo
2. `npm install`
3. `npm run test`
