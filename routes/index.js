
var Step = require('step');
var users = require('../model/user');
var kanbans = require('../model/kanban');

module.exports.routes = function(app){
// Routes

app.get('/login', function(req, res){
	res.render('login', {
		locals:{
			title: 'Login'
		},
		layout: false
	});
});

app.post('/session', function(req, res){
	console.log('Searching user : ' + req.body.login_username + ' ' + req.body.login_hashpassword + '\n');
	Step(
		function findUser(){
			users.findByUsername(req.body.login_username, this);
		},
		function comparePassword(err, results){
			if(results.length > 0){
				var user = results[0];
				

				if(user  && req.body.login_hashpassword == user.password){
					req.session.user = user;
					res.redirect('/kanban');
				}else{
					res.redirect('/login');
				}
			}else{
				console.log('User not Found!\n');
				res.redirect('/login');
			}	
		}
	)
});

app.get('/kanban', preFilter, function(req, res){
	Step(
		function findKanbanByUserId(){
		kanbans.findByUserId(req.session.user.id, this);
		},
		function renderKanbanList(err, results){
			res.render('kanban/list', {locals:{
				title: 'Kanbans',
				kanbans: results
			}});
		}
	)
});

app.get('/kanban/new', preFilter, function(req, res){
	res.render('kanban/new', {locals:{
		title: 'New Kanban'
	}});
});

app.post('/kanban/new', preFilter, function(req, res){
	var kanban = new Object();
	kanban.title = req.body.kanban_title;
	kanban.description = req.body.kanban_description;
	
	Step(
		function saveKanban(){
			kanbans.create(kanban, req.session.user, this);
		},
		function redirectToKanbanList(err, result){
			if(err)
				throw err;

			res.redirect('/kanban');	
		}
	);

	
});

app.get('/kanban/:id', preFilter, function(req, res){
	var kanban = kanbans.findById(req.params.id);


});

function preFilter(req, res, next){
	isLogged(req, res, next);
}

function isLogged(req, res, next){
	if(req.session.user){
		next();
	}else{
		res.redirect('/login');
	}
}
};
