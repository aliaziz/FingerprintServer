/**
 * Created by aliziwa on 8/4/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var delayedSessionActivationModel = new Schema({
    employeeCode:String,
	date: String,
    sessionDelayedPeriod: String
});

module.exports = mongoose.model('delayedActivation',delayedSessionActivationModel);
