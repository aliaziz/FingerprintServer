/**
 * Created by aliziwa on 8/5/16.
 */

var express = require('express');
var router = express.Router();
var sessionModel = require('../models/sessionModel');
var loginDetails = require('../models/UserLoginDetailsModel');


router.get('/sessions',function(req, res){
    sessionModel.find(function(err, sessionDetails){
        if(err){
            res.json(err);
        }
        res.json(sessionDetails);
    });
});

//getting fingerprint posts
router.post('/sessions',function(req,res){
    var sessionModelInstance  = new sessionModel(req.body);

    sessionModelInstance.save(function(err,doc){
        if (err) {
            return res.json(err);
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