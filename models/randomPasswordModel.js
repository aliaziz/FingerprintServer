/**
 * Created by aliziwa on 9/2/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var randomPassword = new Schema({
    password: String
});

module.exports = mongoose.model('randomPasswordModel', randomPassword);