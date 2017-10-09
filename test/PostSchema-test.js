var expect = require('expect.js');
var sinon = require('sinon');
var _bind = require('lodash/bind');
var PostSchema = require('../src/PostSchema');

describe('pre-save middleware', function() {
  it('should set slug based on name', function() {
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
