/**
 * Created by aliziwa on 3/31/17.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var loginTimesModel = new Schema({
    loginTime: String,
	loginName: String
});

module.exports = mongoose.model("loginTimesModel", loginTimesModel);