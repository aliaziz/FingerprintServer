/**
 * Created by aliziwa on 3/31/17.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var companyModel = new Schema({
    name: String,
    location: String
});

module.exports = mongoose.model("companyModel",companyModel);