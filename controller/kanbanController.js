var Step = require('step');
var users = require('../model/user');
var kanbans = require('../model/kanban');

module.exports.renderList = function(req, res){
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
	);
}

module.exports.renderForm = function(req, res){
	res.render('kanban/new', {locals:{
		title: 'New Kanban'
	}});
}

module.exports.create = function(req, res){
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

}
