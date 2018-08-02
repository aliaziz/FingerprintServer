/**
 * Created by aliziwa on 9/30/16.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var branchCodesModel = new Schema({
    branchCode: String
});

module.exports = mongoose.model('branchCodesModel',branchCodesModel);