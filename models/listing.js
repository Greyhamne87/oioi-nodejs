var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//Define our schema
var schema = new Schema({
    title: { type: String, required: true, unique: true },
    subtitle: { type: String, required: true },
    category: { type: String, required: true },
    added: { type: Date, default: Date.now },
    description: { type: String, required: true },
    cost: { type: String, required: true },
    ono: { type: Boolean, required: true },
    postage: { type: Boolean, required: true },
    postageCost: { type: Number },
    user: { type: Schema.Types.ObjectId, ref: 'User' }

});

//We cant access this blue print so we assign it to a model
//it expects 2 arguements 
module.exports = mongoose.model('Listing', schema);