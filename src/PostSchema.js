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
