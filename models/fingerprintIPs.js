/**
 * Created by aliziwa on 3/31/17.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var fingerprintIPsModel = new Schema({
    serverName: String,
    serverIp: String
});

module.exports = mongoose.model("fingerprintIPModel",fingerprintIPsModel);