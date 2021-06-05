let mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  passportLocalMongoose = require('passport-local-mongoose');

  const User = new Schema ({
      score: { type: Number, default: 0 },
      avatar: { type: String, default: 'none'}
  });

  User.plugin(passportLocalMongoose);

  module.exports = mongoose.model('User', User);