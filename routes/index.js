
var Step = require('step');
var kanbanController = require('../controller/kanbanController');
var spotController = require('../controller/spotController');
var users = require('../model/user');

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

app.get('/kanban', preFilter, 
	function(req, res){
		kanbanController.renderList(req, res);
	}
);

app.get('/kanban/new', preFilter, 
	function(req, res){
		kanbanController.renderForm(req, res);
	}
);

app.post('/kanban/new', preFilter, 
	function(req, res){
		kanbanController.create(req, res);
	}
);

app.get('/kanban/:id', preFilter, 	
	function(req, res){
		kanbanController.show(req, res);
	}
);

app.get('/kanban/:id/content', preFilter,
	function(req, res){
		kanbanController.content(req, res);
});

app.post('/spot/new', preFilter,
	function(req, res){
		spotController.create(req, res);
	}
);

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
