/**
 * Created by aliziwa on 9/30/16.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var branchModel = new Schema({
    branchCode: String,
    branchName: String,
    branchAddressOne:String,
    branchAddressTwo:String,
    branchSupervisor:String,
    branchTel:String
});

module.exports = mongoose.model('branchModel',branchModel);