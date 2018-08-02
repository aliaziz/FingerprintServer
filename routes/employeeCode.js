/**
 * Created by aliziwa on 9/15/16.
 */


var express = require('express');
var router = express.Router();
var employeeCodeModel = require('../models/employeeCodesModel');
var id;

function saveFirstEmployeeID(req, res){
    var employeeCodeModelInstance  = new employeeCodeModel({"empCode":"EMP01"});
    employeeCodeModelInstance.save(function (err, doc) {
        if (err) {
            return res.json(err+" from error 1");
        }
        else {
            //send all existing fingerprints
            employeeCodeModel.find(function (err, details) {
                if (err) {
                    console.log(err+" from error");
                }
                console.log(details+" from details");
                res.json({
                    "success": true,
                    "message": "success",
                    "content": details
                });
            });
        }
    });
}

router.get('/employeeCodeAll',function(req, res){
    employeeCodeModel.find(function(err, doc){
        res.json({
            "content":doc
        });
    });
});

router.get('/employeeCode', function(req, res){

    employeeCodeModel.findOne({}, {}, { sort: { '_id' : -1 } }, function(err, post) {
        if(err){
            saveFirstEmployeeID();
            return err+" returned error";
        }else{
            if(post==null){

                //save employeeID
                saveFirstEmployeeID(req, res);

            }else{

                //generate new empcode and save it
                console.log(post.empCode+"===>>>>");
                generateNewEmpCode(post.empCode, req, res);

            }
        }
    });
});

function generateNewEmpCode(empCodeGenerated, req, res){
    //increment current employeeCode
    var currentID = parseInt(empCodeGenerated.replace(/[^0-9\.]/g, ''), 10);
    var newID = currentID+1;
    console.log(newID+" new id");
    var employeeCodeModelInstance  = new employeeCodeModel({"empCode":"EMP0"+newID});
    employeeCodeModel.findOne({'empCode':newID},function(err, response) {
        if (err) {
            res.json({
                "success": false,
                "message": "failed",
                "content": err
            });
        } else if (response != null) {
            res.json({
                "success": false,
                "message": "Employee code already exists",
                "content": null
            });
        } else {
            employeeCodeModelInstance.save(function (err, doc) {
                if (err) {
                    return res.json(err);
                }
                else {
                    //send all existing fingerprints
                    employeeCodeModel.find(function (err, details) {
                        if (err) {
                            res.json({
                                "message": "failed",
                                "success": false,
                                "content": err
                            });
                        }
                        res.json({
                            "success": true,
                            "message": "success",
                            "content": doc
                        });
                    });
                }
            });
        }
    });
}

module.exports = router;