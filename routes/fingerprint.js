/**
 * Created by aliziwa on 8/4/16.
 */
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var fingerPrintModel = require('../models/fingerprintmodel');
var randomPasswordModel = require('../models/randomPasswordModel');
var delayedSessionModel = require('../models/delayedSessionActivationModel');


router.put( '/fingerprint/delayedActivation/:empCode/:date/:hoursAway', function(req, res) {
	
	delayedSessionModel.findOne({'employeeCode': req.params.empCode, 'date': req.params.date}, function(err, doc) {
		if (err) {
			res.json({
				'success':false
			});
		}else {
			if (doc == null || doc.length < 1) {
				var delayedActivation = mongoose.model('delayedActivation');
				var delayedModelInstance = new delayedActivation({ employeeCode: ''});
				delayedModelInstance.employeeCode = req.params.empCode;
				delayedModelInstance.date = req.params.date;
				delayedModelInstance.sessionDelayedPeriod = req.params.hoursAway;
				delayedModelInstance.save(function(err, doc) {
					if (err) {
						res.json({
							"success": false
						})
					}else {
						res.json({
							"success": true
						})
					}
				});
			} else {
				delayedSessionModel.findOneAndUpdate({'employeeCode': req.params.empCode, 'date': req.params.date}, {
				$set: {sessionDelayedPeriod: req.params.hoursAway}
				}, {new: true}, function(err, response) {
					if (err) {
						res.json({
							'success':false
						});
					} else if (response != null) {
						res.json({
							"success": true
						})
					}else {
						
						res.json({
							"success": true
						});
					}
				})
			}
		}
	});
});

router.get('/fingerprint/getDelayedActivation/:empCode', function(req, res) {
	delayedSessionModel.findOne({'employeeCode': req.params.empCode}, function(err, doc) {
		if (err) {
			return 0;
		}else {
			res.json({
				"content": doc
			});
			return doc;
		}
	})
});

router.get('/fingerprint/getDelayedActivation', function(req, res) {
	delayedSessionModel.find(function(err, doc) {
		if (err) {
			res.json({
				"success": false
			});
		}else if (doc.length > 0){
            getEmployee(doc.employeeCode, function(err, response) {
                if(err) {
                    res.json({
                        "success": false
                    });
                } else {
                    var updatedResponse = {
                                    "firstName": response.first_name,
                                    "lastName": response.last_name,
                                    "phoneNumber": response.phone_number,
                                    "employeeCode": doc.employeeCode,
                                    "sessionDelayedPeriod": doc.sessionDelayedPeriod
                                }
                    res.json({
                        "success": true,
                        "content": updatedResponse
                    });
                }
            });
		}else {
            res.json({
                "success": true,
                "content": doc
            });
        }
	})
});

router.get('/fingerprint',function(req, res){
    fingerPrintModel.find(function(err, fingerprintDetails){
        if(err){
            res.json({
                "success":false,
                "message":"failed",
                "content":err
         });
        }
        res.json(
            {
                "message":"passed",
                "success":true,
                "content":fingerprintDetails
            });
    });
});

router.get('/fingerprint/supervisorByCode/:empCode',function(req, res){
    fingerPrintModel.findOne({employeeCode:req.params.empCode, isSuperVisor: true}, function(err, response){
        if(err) {
            res.json({
                "success":false,
                "message":"failed",
                "content":err
            });
        }else{
            if(response==null){
                res.json({
                    "success":false,
                    "message":"failed",
                    "content":response
                });
            }else{
                res.json({
                    "success":true,
                    "message":"success",
                    "content":response
                });
            }

        }
    });
});

//password returned to system after it has made a request
router.get('/fingerprint/getPasswordSystem', function(req, res){

    randomPasswordModel.findOne({}, {}, { sort: { '_id' : -1 } }, function(err, post) {
        if(err){
            res.json({
                "success":false,
                "message":"failed",
                "content":err
            });
        }else{
            res.json({
                "success":true,
                "message":"passed",
                "content":post
            });
        }
    });
});

//password sent to the client after saving
router.get('/fingerprint/getPassword', function(req, res){
    var passwordGenerated = makeid();
    var randomPasswordInstance = new randomPasswordModel({"password":passwordGenerated});

    //save password first
    randomPasswordInstance.save(function(err, doc) {
        if (err) {
            return res.json(err);
        }
        else {
            //send the generated password back to client
            res.json({
                "success":true,
                "message": "passed",
                "content":passwordGenerated
            });
        }
    });

});

router.get('/fingerprint/:empCode', function(req, res){
    getEmployee(req.params.empCode, function(err, response) {
        if(err){
            res.json({
                    "success": false,
                    "message": "failed",
                    "content": err
                });
        }else if(response!=null){
            res.json({
                "success": true,
                "message": "passed",
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

function getEmployee(code, callback){
    fingerPrintModel.findOne({'employeeCode':code},function(err, response){
        if(err){
            callback(err, undefined);
        }else if(response!=null){
            callback(undefined, response);
        }else{
            callback(err, undefined);
        }
    });
}

//get supervisors only
router.get('/fingerprint/supervisorOnly/getSupervisors', function(req, res){
    fingerPrintModel.find({'isSuperVisor':true},function(err, response){
        console.log("response "+response);
        if(err){
            res.json({
                "success": false,
                "message": "failed",
                "content": err
            });
        }else if(response!=null){
            res.json({
                "success": true,
                "message": "passed",
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

router.get('/fingerprint/removeOneBranch/:oneBranch/:_id',function(req, res){
    fingerPrintModel.findOne({_id:req.params._id},function(err, response){
        response.supervisedBranches.remove(req.params.oneBranch);
        response.save(function(err, doc){
            console.log("saved successfully ");
            res.json({
                "success": true,
                "message": "passed",
                "content": response
            });
        });
    });
});
//update employee rights
router.get('/fingerprint/advanceRights/:empCode/:empBranch', function(req, res){

    fingerPrintModel.findOneAndUpdate({'employeeCode':req.params.empCode},{
             $set:{isSuperVisor:true},
             $push: {supervisedBranches: req.params.empBranch }
        },
        {new:true},function(err, response){
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

//update employee rights
router.get('/fingerprint/downgradeRights/:empCode/:empBranch', function(req, res){

    fingerPrintModel.findOneAndUpdate({'employeeCode':req.params.empCode},{
        $set:{isSuperVisor:false}},{new:true},function(err, response){
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


//update employee branch
router.put('/fingerprint/changeBranch/:empCode/:newBranch', function(req, res){

    var branch = req.params.newBranch;
    console.log(branch+" new branch");

    fingerPrintModel.findOneAndUpdate({'employeeCode':req.params.empCode},{
        $set:{emp_branch:branch}},{new:true},function(err, response){
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

//delete user from database
router.delete('/fingerprint/disable/:id',function(req, res){
    var id = req.params.id;
    console.log(id+" ====");
    fingerPrintModel.remove({_id : id }, function(err){
        if(err) return handleError(err);

        res.send({message:"disabled successfully"});
    });
});

//getting fingerprint posts
router.post('/fingerprint',function(req,res){
    var fingerPrintModelInstance  = new fingerPrintModel(req.body);
    fingerPrintModel.findOne({'employeeCode':req.body.employeeCode},function(err, response){
        if(err){
            res.json({
                "success": false,
                "message": "failed",
                "content": err
            });
        }else if(response!=null){
            res.json({
                "success": false,
                "message": "Employee code already exists",
                "content": null
            });
        }else{
            fingerPrintModelInstance.save(function(err, doc) {
                if (err) {
                    return res.json(err);
                }
                else {
                    //send all existing fingerprints
                    fingerPrintModel.find(function(err, fingerprintDetails){
                        if(err){
                            res.json({
                                "message":"failed",
                                "success":false,
                                "content":err
                            });
                        }
                        res.json({
                            "success":true,
                            "message":"success",
                            "content":fingerprintDetails
                        });
                    });
                }
            });
        }
    });

});


function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 8; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    console.log("password generated..."+text);
    return text;
}

module.exports = router;