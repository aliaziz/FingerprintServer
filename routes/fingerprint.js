/**
 * Created by aliziwa on 8/4/16.
 */
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var fingerPrintModel = require('../models/fingerprintmodel');
var randomPasswordModel = require('../models/randomPasswordModel');
var delayedSessionModel = require('../models/delayedSessionActivationModel');
var lateEmployeesModel = require('../models/lateModels');
var configureLoginTimeModel = require('../models/loginTimesModel');
var companyModel = require('../models/companyModel');
var defaultMessage = require("./defaultReturnMessage");

router.get('/fingerprint/getCompanies',function(req, res){
    companyModel.find(function(err, doc){
        if (err) return(err);
        else{
            res.json(defaultMessage.returnMessage(true,"success",doc));
        }
    });
});

router.post('/fingerprint/addCompanies',function(req,res){
	console.log(req.body);
    var companyModelInstance = new companyModel(req.body);
    companyModelInstance.save(function(err,doc){
        if(err) return(err);
        else{
            res.json(defaultMessage.returnMessage(true, "success",doc));
        }
    });
});

router.delete('/fingerprint/deleteCompany/:id',function(req, res){
    companyModel.remove({_id:req.params.id},function(err, doc){
        if(err) return(err);
        else{
            res.json(defaultMessage.returnMessage(true, "success",doc));
        }
    });
});

router.get('/fingerprint/getLoginTime',function(req, res){
    configureLoginTimeModel.find(function(err, doc){
        if (err) return(err);
        else{
            res.json({
				"success": true,
				"content": doc
			});
        }
    });
});

router.post('/fingerprint/setLoginTime',function(req,res){
	configureLoginTimeModel.findOneAndUpdate({"loginName": req.body.loginName}, 
	{$set: {'loginTime': req.body.loginTime}}, function(err, doc) {
		if (err) return(err);
		else if (doc != null){
			res.json({
				"success": true
			});
		}else {
			var loginTimesModelInstance = new configureLoginTimeModel(req.body);
			loginTimesModelInstance.save(function(err,doc){
				if(err) return(err);
				else{
					res.json({
						"success": true, 
						"content": doc
					});
				}
			});
		}
	});
});

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
			var promises = [];
			
			for (var pos = 0; pos < doc.length; pos++) {
				var empCode = doc[pos].employeeCode;
				promises.push(getEmployee(empCode));
			}

			Promise.all(promises)    
			 .then(function(data){ 
				res.json({
					"success": true, 
					"empDetails": data,
					"empDelays": doc
				});
			 }).catch(function(err){ 
				res.json({
					"success": false
				});
			 });    
		}else {
            res.json({
                "success": true,
                "content": doc
            });
        }
	})
});

router.post('/fingerprint/lateEmployees', function(req, res) {

	lateEmployeesModel.findOne({'empCode': req.body.empCode}, function (err, lateEmpDoc) {
		if (err) {
			res.json({
				'success': false
			});
		}else if (lateEmpDoc != null && lateEmpDoc.date == req.body.date){
			res.json({
				'success': true
			});
		}else {
			//new day
			var lateLoginThreshold = parseInt("0930");
			configureLoginTimeModel.findOne(function(timeErr, timeDoc) {
				console.log(timeDoc);
				if (timeErr) return timeErr;
				else if (timeDoc != null){
					lateLoginThreshold = parseInt((timeDoc.loginTime).replace(':',''));
				}
				var lateEmployeeInstance =  new lateEmployeesModel(req.body);
				if (lateLoginThreshold < parseInt((req.body.time).replace(':',''))) {
					lateEmployeeInstance.isLate = true;
				}
				console.log(lateEmployeeInstance);
				
				lateEmployeeInstance.save(function(err, doc) {
					if (err) {
						res.json({
							'success': false
						});
					}else {
						res.json({
							'success': true,
							'content': doc
						});
					}
				});
			});
		}
	});

	
});
function getDate(daysAgo) {
	var today = new Date();
	today.setDate(today.getDate() - daysAgo);
	
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!

	var yyyy = today.getFullYear();
	if(dd<10){
		dd='0'+dd;
	} 
	if(mm<10){
		mm='0'+mm;
	} 
	var today = dd+'-'+mm+'-'+yyyy;	
	return today;
}

router.get('/fingerprint/getMonthLateEmployees', function(req, res){
	var fromDate = getDate(20);
	var toDate = getDate(0);
	lateEmployeesModel.find({'isLate': true, 'date': {
		'$gte': fromDate,
		'$lte': toDate,
	}}, function(err, doc) {
		
		if (err) {
			res.json({
				"success": false
			});
		}else if (doc.length > 0){
			var promises = [];
			
			for (var pos = 0; pos < doc.length; pos++) {
				var empCode = doc[pos].empCode;
				promises.push(getEmployee(empCode));
			}

			Promise.all(promises)    
			 .then(function(data){ 
				res.json({
					"success": true, 
					"empDetails": data,
					"empDelays": doc
				});
			 }).catch(function(err){ 
				res.json({
					"success": false
				});
			 });    
		}else {
            res.json({
                "success": true,
                "content": doc
            });
        }
	})
});

router.get('/fingerprint/getWeekLateEmployees', function(req, res){
	var fromDate = getDate(7);
	var toDate = getDate(0);
	lateEmployeesModel.find({'isLate': true, 'date': {
		'$gte': fromDate,
		'$lte': toDate,
	}}, function(err, doc) {
		
		if (err) {
			res.json({
				"success": false
			});
		}else if (doc.length > 0){
			var promises = [];
			
			for (var pos = 0; pos < doc.length; pos++) {
				var empCode = doc[pos].empCode;
				promises.push(getEmployee(empCode));
			}

			Promise.all(promises)    
			 .then(function(data){ 
				res.json({
					"success": true, 
					"empDetails": data,
					"empDelays": doc
				});
			 }).catch(function(err){ 
				res.json({
					"success": false
				});
			 });    
		}else {
            res.json({
                "success": true,
                "content": doc
            });
        }
	})
});

router.get('/fingerprint/getLateEmployees', function(req, res){
	lateEmployeesModel.find({'isLate': true}, function(err, doc) {
		
		if (err) {
			res.json({
				"success": false
			});
		}else if (doc.length > 0){
			var promises = [];
			
			for (var pos = 0; pos < doc.length; pos++) {
				var empCode = doc[pos].empCode;
				promises.push(getEmployee(empCode));
			}

			Promise.all(promises)    
			 .then(function(data){ 
				res.json({
					"success": true, 
					"empDetails": data,
					"empDelays": doc
				});
			 }).catch(function(err){ 
				res.json({
					"success": false
				});
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
	var promise = getEmployee(req.params.empCode);
	promise.then(function(result) {
		res.json({
			"success": true,
			"message": "passed",
			"content": result
		});
	}, function (err) {
		res.json({
			"success": false,
			"message": "failed",
			"content": err
		});
	});
});

function getEmployee(code){
	return new Promise(function(resolve, reject) {
		fingerPrintModel.findOne({'employeeCode':code},function(err, response){
			if(err){
				reject(err)
			}else if(response!=null){
				console.log(response);
				resolve(response)
			}else{
				reject(err)
			}
		});
	});
}

//get supervisors only
router.get('/fingerprint/supervisorOnly/getSupervisors', function(req, res){
    fingerPrintModel.find({'isSuperVisor':true},function(err, response){
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

//update user from database
router.put('/fingerprint/disable/:id/:reason',function(req, res){
    var id = req.params.id
	var reason = req.params.reason
    fingerPrintModel.findOneAndUpdate({_id : id },
		{$set: {isEnabled: false, terminationReason: reason}},
		function(err){
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

    return text;
}

module.exports = router;