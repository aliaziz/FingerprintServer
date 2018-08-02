/**
 * Created by aliziwa on 8/8/16.
 */
var express = require('express');
var router = express.Router();
var supervisorComment = require('../models/supervisorComment');


router.get('/submitSupervisorComment/:employeeCode',function(req, res){
    var employeeCode = req.params.employeeCode;
    supervisorComment.findOne({'employeeCode':employeeCode},
        function(err, commentDetails){
            if(err){
                res.json(err);
            }
            res.json(commentDetails);
    });
});

router.get('/submitSupervisorComment/',function(req, res){

    supervisorComment.find(function(err, commentDetails){
            if(err){
                res.json(err);
            }
            res.json(commentDetails);
        });
});

router.post('/submitSupervisorComment',function(req,res){
    var supervisorCommentInstance  = new supervisorComment(req.body);

    supervisorCommentInstance.save(function(err, doc) {
        if (err) {
            res.json({
                "message": "Failure",
                "error": true,
                "content": err
            });
        }
        else {
            res.json({
                "message": "Success",
                "error": false,
                "content": doc
            });
        }
    });
});

module.exports = router;