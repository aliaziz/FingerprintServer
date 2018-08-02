/**
 * Created by aliziwa on 8/8/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var supervisorModel = new Schema({
    supervisorCode: String,
    employeeCode: String,
    comment:String
});

module.exports = mongoose.model('supervisorModel',supervisorModel);