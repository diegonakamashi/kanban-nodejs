var Step = require('step');
var users = require('../model/user');
var kanbans = require('../model/kanban');
var spots = require('../model/spot');
var postits = require('../model/postit');
var Util = require('util');


module.exports.renderList = function(req, res){
	Step(
		function findAllUsers(){
			users.findAll(this);
		},
		function renderUsersList(err, results){
			res.render('user/list', {locals:{
				title: 'Users',
				users: results
			}});
		}
	);
}

module.exports.renderForm = function(req, res){
	res.render('user/new', {locals:{
		title: 'New User'
	}});
}

module.exports.create = function(req, res){
	var user = req.body.user;
	Step(
		function saveUser(){
			users.create(user, this);
		},
		function redirectToUserList(err, result){
			if(err) throw err;

			res.redirect('/users');
		}
	);
}
