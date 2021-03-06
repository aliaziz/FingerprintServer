/**
 * Created by aliziwa on 8/13/16.
 */
var express = require('express');
var router = express.Router();
var loginDetails = require('../models/UserLoginDetailsModel');
var cron = require('node-cron');

var task = cron.schedule('*/600 * * * *', function() {
    loginDetails.update({isLoggedIn:true}, {isLoggedIn: false}, {multi: true},
        function(err, num) {
            console.log("cron job updated "+num);
        }
    );
});

router.get('/userLoginDetails/:empCode',function(req, res){
    loginDetails.findOne({ 'empCode' : req.params.empCode},function(err, userLoginDetails){
        if(err){
            res.json({
                "success":false,
                "content":err
            });
        }else if(userLoginDetails==null){
            res.json({
                "success":false,
                "content":userLoginDetails
            });
        }else{
            res.json({
                "success":true,
                "content":userLoginDetails
            });
        }
    });
});

router.get('/userLoginDetails',function(req, res){
    loginDetails.find(function(err, userLoginDetails){
        if(err){
            res.json({
                "success":false,
                "content":err
            });
        }
        res.json({
            "success":true,
            "content":userLoginDetails
        });
    });
});

router.post('/userLoginDetails',function(req,res){
    var bodyContent = req.body;
    var userLoginDetailsInstance  = new loginDetails(req.body);
    loginDetails.findOne({'empCode':req.body.empCode},
        function(err, userLoginDetailsContent){
        if(err){
            if (error) {
                return res.json(error);
            }
        }else if(userLoginDetailsContent==null){
            userLoginDetailsInstance.save(function(error, doc) {
                if (error) {
                    return res.json(error);
                }
                else {
                    res.json({
                        "success":true,
                        "content":doc
                    });

                }
            });
        }else{
            loginDetails.findOneAndUpdate({'empCode': bodyContent.empCode},
                bodyContent, {new: true},

                function(errorDetails, docDetails){
                    if(errorDetails){
                        console.log("Something wrong when updating data!");
                    }else{
                        res.json({
                            "success":true,
                            "content":docDetails
                        });
                    }
                });
        }
        });
});

module.exports = router;