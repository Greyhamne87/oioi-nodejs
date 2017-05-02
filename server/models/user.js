var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator')

//Define our schema
var schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    dateJoined: { type: Date, default: Date.now },
    gender: {type: String},
    lat: {type: Number},
    long: {type: Number},
    dob: {type: String},
    alias: {type: String, unique: true},
    listings: {type: Schema.Types.ObjectId, ref:'Listing'}
});

schema.plugin(mongooseUniqueValidator);

//We cant access this blue print so we assign it to a model
//it expects 2 arguements 
module.exports = mongoose.model('User', schema);

