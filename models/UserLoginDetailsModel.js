/**
 * Created by aliziwa on 8/13/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var loginDetails = new Schema({
    empCode: String,
    isLoggedIn:Boolean
});

module.exports = mongoose.model('loginDetails',loginDetails);