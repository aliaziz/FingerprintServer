/**
 * Created by aliziwa on 9/30/16.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lateEmployeesModel = new Schema({
    empCode: String,
    date: String,
    time: String,
    isLate: Boolean
});

module.exports = mongoose.model('lateEmployeesModel',lateEmployeesModel);