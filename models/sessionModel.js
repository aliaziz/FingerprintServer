/**
 * Created by aliziwa on 8/5/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sessionModel = new Schema({
    first_name: String,
    last_name: String,
    logoutTime:String,
    empCode:String
});

module.exports = mongoose.model('sessionModel',sessionModel);