/**
 * Created by aliziwa on 9/15/16.
 */
var express = require('express');
var router = express.Router();
var branchModel = require('../models/branchModel');
var branchCodesModel = require('../models/branchCodesModel');
var id;

function saveFirstBranchCode(req,res){
    var branchCodesModelInstance  = new branchCodesModel({"branchCode":"BR-0001"});
    branchCodesModelInstance.save(function (err, doc) {
        if (err) {
            return res.json(err);
        }
        else {
            //send all existing fingerprints
            branchCodesModel.find(function (err, details) {
                if (err) {
                    console.log(err);
                }
                res.json({
                    "content":details
                });

                console.log(details+" saving new code");

            });
        }
    });
}

router.put('/getBranches/updateBranch/:branchCode',function(req, res){
    console.log(req.body.branchName+" "+req.body.branchAddress1+" "+req.body.branchAddress2);
    branchModel.findOneAndUpdate({'branchCode':req.params.branchCode},{
        $set:{
            'branchCode'        :req.params.branchCode,
            'branchName'        :req.body.branchName,
            'branchAddressOne'    :req.body.branchAddress1,
            'branchAddressTwo'    :req.body.branchAddress2,
            'branchSupervisor'  :req.body.branchSupervisor,
            'branchTel'         :req.body.branchTel
        }
    },{new:true},function(err, response){
        if(err){
            res.json({
                "success": false,
                "message": "failed",
                "content": err
            });
        }else if(response!=null){
            res.json({
                "success": true,
                "message": "updated",
                "content": response
            });
        }else{
            res.json({
                "success": false,
                "message": "failed",
                "content": "no content"
            });
        }
    });
});

router.delete('/getBranches/removeBranch/:id',function(req, res){
    branchModel.remove({_id:req.params.id},function(err, succ){
        if(err) console.log(err);
        res.json({
            content:succ
        });
    });
});

router.post('/addNewBranch', function(req, res){
    var branchModelInstance = new branchModel(req.body);
    branchModelInstance.save(function(err, succ){
        if(err) console.log(err);

        res.json({

            //update supervisor table with branch linked to
            message:"Added successfully"
        })
    });
});

router.get('/getBranches/getAllBranches',function(req, res){
    branchModel.find(function(err, doc){
        res.json({
            "content":doc
        });
    });
});

router.get('/getBranches/getNewBranchCode', function(req, res){

    branchCodesModel.findOne({}, {}, { sort: { '_id' : -1 } }, function(err, post) {
        if(err){
            return err;
        }else{
            if(post==null){

                //save branch ID
                saveFirstBranchCode(req, res);

            }else{

                //generate new branch ID and save it
                console.log(post.branchCode+"===>>>>");
                if(post.branchCode == undefined){
                    saveFirstBranchCode(req, res);
                }else{
                    generateNewBranchCode(post.branchCode, req, res);
                }

            }
        }
    });
});

router.get('/getBranches/getOneBranch/:id',function(req, res){
    branchModel.findOne({_id:req.params.id},function(err, response){
        if(err) console.log(err);

        if(response!=null){
            res.json({
                content:response
            });
        }

    });
});

router.get('/getSupervisor/:branchName', function(req, res){
    branchModel.findOne({branchName:req.params.branchName}, function (err, response) {
        if (err) console.log(err);

        res.json({
            content:response
        });
    });
});

function generateNewBranchCode(branchCodeGenerated, req, res){

    //increment current branchCode
    var currentID = parseInt(branchCodeGenerated.replace(/[^0-9\.]/g, ''), 10);
    var newID = currentID+1;
    console.log(newID+" new id");

    var branchCodesModelInstance  = new branchCodesModel({"branchCode":"BR-000"+newID});
    branchCodesModel.findOne({'branchCode':newID},function(err, response) {
        if (err) {
            res.json({
                "success": false,
                "message": "failed",
                "content": err
            });
        } else if (response != null) {
            res.json({
                "success": false,
                "message": "Branch code already exists",
                "content": null
            });
        } else {
            branchCodesModelInstance.save(function (err, doc) {
                if (err) {
                    return res.json(err);
                }
                else {
                    //send all existing fingerprints
                    branchCodesModel.find(function (err, details) {
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