const express = require('express');
const path = require('path');
const session = require('express-session');
const cp = require('cookie-parser');
const bp = require('body-parser');
const passport = require('./passport.js');
const register = require('./routes/register.js');
const flash = require('connect-flash')
const db = require('./userdb').users;
const dbData = require('./userdb').userData;
const app = express();

app.use(cp('somerandomcharactersthatnooneknowslikechimichonga'));
app.use(session({
	secret: 'somerandomcharactersthatnooneknowslikechimichonga',
	resave: false,
	saveUnitialized: true
}));
app.use(flash());

app.use(bp.urlencoded({extended: true}));
app.use(bp.json());

app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
	console.log(req.user);
	next();
});

app.use('/register',register);

function checkLoggedIn(req,res,next){
	console.log('check logged in');
	if(req.user){
		next();
	}
	else{
		res.status(404).send('unauthorised');
	}
}

app.use('/',express.static(path.join(__dirname,"public")))

app.use('/private',checkLoggedIn,express.static(path.join(__dirname,'private')))


app.post('/login',passport.authenticate('local',{
	failureRedirect: '/',
	successRedirect: '/private',
	failureFlash: "couldn't log in"
}))
app.get('/logout',function(req,res){
	req.logout();
	res.redirect('/')
})


app.listen(3000,function(){
	console.log("magic happens on port 3000");
})

// CODE FOR MANIPULATING VARIOUS DATA AND DATA BASE IN CLIENTJS.

app.get('/datainfo',function(req,res){

    db.findAll({
        where : {
            id : req.user.id
        }
    }).then(function(database){
        console.log(database);
        res.send(database);
    }).catch(function(err){
        console.log(err);
    })
})

app.post('/storeDatabase',function(req,res) {
    console.log(req.body);
    dbData.findOne({
        where : {
            userdbId : req.user.id
        }
    }).then(function(database){
        console.log(database);
        if(database == null){
            console.log("let see")
            dbData.create({
                userdbId: req.user.id,
                userListName: req.body.name,
                userListCounter: req.body.counterList,
                userListData: req.body.Tasks,
                userStats: "let's put some Value Later",
                userListTaskCounter: req.body.counter
            }).then(function () {
                res.send({success: true});
            })
        }
        else
            res.send({success: false});
    })
})

app.post('/updateDatabase',function(req,res) {
    console.log(req.body);
    dbData.findOne({
        where: userdbId = req.user.id
    }).then(function (data) {
        data.update({
            userListName: req.body.name,
            userListCounter: req.body.counterList,
            userListData: req.body.Tasks,
            userStats: "let's put some Value Later",
            userListTaskCounter: req.body.counter
        }).then(function () {
            res.send({success: true});
        })
    })
})

app.post('/updateTasks',function(req,res){
	dbData.findOne({
		where: userdbId = req.user.id
	}).then(function(data){
		data.update({
			userListData: req.body.Tasks,
			userListTaskCounter: req.body.counter
		}).then(function(){
			res.send({success: true});
		})
	})
})

app.get('/retrieveData',function(req,res){
	dbData.findOne({
		where: userdbId = req.user.id
	}).then(function(data){
		if(data != null) {
            console.log(data);
            res.send(data);
        }
	}).catch(function(err){
		console.log(err);
	})
})
////////////////////////////////////////*****************LOHITAKSH********************///////////////////////////////////////////

app.get('/retrievePieChart',function (req,res) {
    db.findOne({
        where: userdbId = req.user.id
    }).then(function(data){
        if(data != null) {
            console.log(data);
            res.send(data);
        }
    }).catch(function(err){
        console.log(err);
    })
})

app.post('/updatePieChart',function (req,res) {
    db.findOne({
        where: userdbId = req.user.id
    }).then(function(data){
        data.update({
            TaskDoneCounter: req.body.done_tasks,
            TaskNotDoneCounter: req.body.pending_tasks
        }).then(function(){
            res.send({success: true});
        })
    })
})

////////////////////////////////////////*****************LOHITAKSH********************///////////////////////////////////////////