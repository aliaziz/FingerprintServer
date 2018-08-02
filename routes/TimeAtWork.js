/**
 * Created by aliziwa on 8/13/16.
 */
var express = require('express');
var moment = require('moment');
var router = express.Router();
var timeAtWorkModel = require('../models/TimeAtWorkModel');
var firstLoginTimePerDay;
var timeDifferenceHours = 0;
var timeDifferenceHMinutes = 0;
var timeDifferenceSeconds = 0;
var timeDifferenceCombined;

router.get('/timeAtWork/:empCode',function(req, res){
    timeAtWorkModel.findOne({'empCode':req.params.empCode},function(err, timeAtWorkDetails){
        if(err){
            res.json(err);
        }
        res.json(timeAtWorkDetails);
    });
});

router.get('/timeAtWork/',function(req, res){
    timeAtWorkModel.find(function(err, timeAtWorkDetails){
        if(err){
            res.json(err);
        }
        res.json(timeAtWorkDetails);
    });
});
router.get('/timeAtWorkSupervisor/',function(req, res){
    timeAtWorkModel.find({'isSuperVisor': true}, function(err, timeAtWorkDetails){
        if(err){
            res.json(err);
        }
        res.json(timeAtWorkDetails);
    });
});

router.post('/timeAtWorkSupervisor',function(req,res){
    var timeAtWorkModelSupervisorInstance  = new timeAtWorkModel(req.body);
    timeAtWorkModelSupervisorInstance.save(function(err, doc) {
        if (err) {
            return res.json(err);
        }
        else {
            console.log(req.body.empCode+" time at work supervisor "+doc);
            res.json({
                "success":true,
                "content":doc
            });

        }
    });
});

router.post('/timeAtWork',function(req,res){
    var timeAtWorkModelInstance  = new timeAtWorkModel(req.body);
    timeAtWorkModelInstance.save(function(err, doc) {
        if (err) {
            return res.json(err);
        }
        else {
            res.json({
                "success":true,
                "content":doc
            });

        }
    });
});

router.get('/workHours/:empCode/:dateOnly',function(req, res){

    var dateOnly = req.params.dateOnly;

    timeAtWorkModel.find(
        { "loginTime": { "$regex": dateOnly, "$options": "i" }, "empCode":req.params.empCode },'loginTime',
        function(err,docs) {

            if(docs.length<1){
                timeDifferenceCombined = "Not logged out today";
            }
            else if(docs.length == 1){
                firstLoginTimePerDay = docs[0].loginTime;
                timeDifferenceCombined = "Not logged out yet today";
            }else{

                firstLoginTimePerDay = docs[0].loginTime;

                for(var x=0; x<docs.length; x++){
                    var timeDiffCalculated = timeCalculator(firstLoginTimePerDay, docs[x].loginTime).split(":");

                    var hours = timeDiffCalculated[0];
                    var minutes = timeDiffCalculated[1];
                    var seconds = timeDiffCalculated[2];

                    timeDifferenceHours = timeDifferenceHours + parseInt(hours);
                    timeDifferenceHMinutes = timeDifferenceHMinutes + parseInt(minutes);
                    timeDifferenceSeconds = timeDifferenceSeconds + parseInt(seconds);

                    timeDifferenceCombined = "Hours "+timeDifferenceHours+" Minutes "+timeDifferenceHMinutes +" Seconds "+timeDifferenceSeconds
                    firstLoginTimePerDay = docs[x].loginTime;
                    console.log(timeDifferenceCombined+" time diff\n "+firstLoginTimePerDay+" first login time\n");
                }
            }
            res.json({
                size:docs.length,
                time:timeDifferenceCombined
            });
        }
    );
});

var timeCalculator = function(loginTime, logoutTime){

    return moment.utc(moment(logoutTime,"YYYY-MM-DD HH:mm:ss").diff(moment(loginTime,"YYYY-MM-DD HH:mm:ss")))
        .format("HH:mm:ss");

};

module.exports = router;