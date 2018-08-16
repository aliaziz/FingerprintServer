/**
 * Created by aliziwa on 8/4/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fingerPrintModel = new Schema({
    first_name: String,
    last_name: String,
    emp_phoneNumber: String,
    emp_NSSFNumber: String,
    email: String,
    employeeCode:String,
    image_blob: String,
    image_size: String,
    image_hex:String,
    emp_branch:String,
	emp_company: String,
    isSuperVisor:Boolean,
    supervisedBranches : {
        type: Array
    },
    time_at_work:[{type:mongoose.Schema.Types.ObjectId, ref:'timeAtWorkModel'}]
});

module.exports = mongoose.model('fingerPrintModel',fingerPrintModel);