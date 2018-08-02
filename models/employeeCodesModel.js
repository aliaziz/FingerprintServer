/**
 * Created by aliziwa on 9/15/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var employeeCodeModels = new Schema({
    empCode: String
});

module.exports = mongoose.model('employeeCodesModel',employeeCodeModels);