/**
 * Created by aliziwa on 8/13/16.
 */
/**
 * Created by aliziwa on 8/8/16.
 */
var mongoose = require('mongoose');
var textSearch = require('mongoose-text-search');
var Schema = mongoose.Schema;

var timeAtWorkModel = new Schema({
    loginTime: String,
    logoutTime: Number,
    empCode: String,
    first_name:String,
    last_name:String,
    isLoggedIn:Boolean,
    emp_branch:String,
    isSuperVisor: Boolean
});


// give our schema text search capabilities
timeAtWorkModel.plugin(textSearch);

// add a text index to the tags array
timeAtWorkModel.index({ loginTime: 'text'});

module.exports = mongoose.model('timeAtWorkModel',timeAtWorkModel);