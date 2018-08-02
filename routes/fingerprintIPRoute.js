/**
 * Created by aliziwa on 3/31/17.
 */

var express = require("express");
var router = express.Router();
var fingerprintIPModel = require("../models/fingerprintIPs");
var defaultMessage = require("./defaultReturnMessage");

router.get('/getIPs',function(req, res){
    fingerprintIPModel.find(function(err, doc){
        if (err) return(err);
        else{
            res.json(defaultMessage.returnMessage(true,"success",doc));
        }
    });
});

router.post('/addIps',function(req,res){
    var fingerprintIPModelInstance = new fingerprintIPModel(req.body);
    fingerprintIPModelInstance.save(function(err,doc){
        if(err) return(err);
        else{
            res.json(defaultMessage.returnMessage(true, "success",doc));
        }
    });
});

router.delete('/deleteIps/:id',function(req, res){
    fingerprintIPModel.remove({_id:req.params.id},function(err, doc){
        if(err) return(err);
        else{
            res.json(defaultMessage.returnMessage(true, "success",doc));
        }
    });
});

module.exports = router;