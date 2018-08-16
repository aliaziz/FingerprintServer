var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fingerprintCore = require('./routes/fingerprint');
var sessionsCore = require('./routes/sessions');
var commentsCore = require('./routes/supervisorComment');
var timeAtWorkCore = require('./routes/TimeAtWork');
var userLoginDetailsCore = require('./routes/userLoginDetails');
var employeeCodeCore = require('./routes/employeeCode');
var branchesCore = require('./routes/branchRoute');
var ipsCore = require('./routes/fingerprintIPRoute');
var app = express();

//connecting to mongoose database
var FingerPrintDB = 'FingerPrintDB';
var connectionString = 'mongodb://127.0.0.1:27017'+FingerPrintDB;

mongoose.connect(connectionString);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/fingerprintCore', express.static(__dirname + '/public/'));
app.use('/fingerprintCore/viewSessions', express.static(__dirname + '/public/employeeSessions.html'));
app.use('/fingerprintCore/viewTimeAtWork', express.static(__dirname + '/public/employeeTimeAtWork.html'));
app.use('/fingerprintCore/viewSupervisorTimeAtWork', express.static(__dirname + '/public/employeeSupervisorTimeAtWork.html'));
app.use('/fingerprintCore/viewComments', express.static(__dirname + '/public/SupervisorComments.html'));
app.use('/fingerprintCore/viewLoginDetails', express.static(__dirname + '/public/viewLoginDetails.html'));
app.use('/fingerprintCore/viewSupervisors', express.static(__dirname + '/public/viewSupervisors.html'));
app.use('/fingerprintCore/viewBranches', express.static(__dirname + '/public/createBranch.html'));
app.use('/fingerprintCore/setupIps', express.static(__dirname + '/public/setupIPs.html'));
app.use('/fingerprintCore/setupLoginTime', express.static(__dirname + '/public/setupLateTime.html'));
app.use('/fingerprintCore/setupCompany', express.static(__dirname + '/public/setupCompany.html'));
app.use('/fingerprintCore/workHoursSummary', express.static(__dirname + '/public/workHoursSummary.html'));
app.use('/fingerprintCore/lateEmployeesSummary', express.static(__dirname + '/public/lateEmployees.html'));
app.use('/fingerprintCore/tabsLink', express.static(__dirname + '/public/tabsLink.html'));

app.use('/fingerprintCore',fingerprintCore);
app.use('/fingerprintCore',sessionsCore);
app.use('/fingerprintCore',commentsCore);
app.use('/fingerprintCore',timeAtWorkCore);
app.use('/fingerprintCore',userLoginDetailsCore);
app.use('/fingerprintCore',employeeCodeCore);
app.use('/fingerprintCore',branchesCore);
app.use('/fingerprintCore',ipsCore);

app.listen(3000,function(){
    console.log("running...");
});
module.exports = app;
