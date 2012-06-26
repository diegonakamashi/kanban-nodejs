var Step = require('step');
var users = require('../model/user');
var kanbans = require('../model/kanban');
var spots = require('../model/spot');
var postits = require('../model/postit');
var Util = require('util');

module.exports.renderList = function(req, res){
	Step(
		function findKanbanByUserId(){
			kanbans.findByUserId(req.session.user.id, this);
		},
		function renderKanbanList(err, results){
			res.render('kanban/list', {locals:{
				title: 'Kanbans',
				kanbans: results,
				user: req.session.user
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

module.exports.content = function(req, res){
	var _kanban;
	var _spots = [];
	var _pits = {};
	Step(
		function getKanban(){
			kanbans.findById(req.params.id, this);
		},
		function getSpots(err, kanban){
			//TODO -> Check if the kanban exist
			_kanban = kanban;
			spots.findByKanbanId(kanban[0].id, this);
		},
		function getPostIts(err, spots){
			_spots = spots;
			postits.findBySpots(spots, this);
		},
		function showKanban(err, postIts){
			_pits = postIts;
			var obj = new Object();
			obj.kanban = _kanban;
			obj.spots = _spots;
			obj.pits = _pits;

			var json = JSON.stringify(obj);
			res.json(json); 
		}

	);

}

module.exports.show = function(req, res){
	res.render('kanban/kanbanApp', {
		title: 'Kanban',
		kanbanId: req.params.id
	});
}

module.exports.saveContent = function(req, res){
	Step(
		function updatePostIts(){
			var kanban = req.body;
			console.log('KANBAN: ' + kanban);
			var spots = kanban.spots;
			for(var i = 0; i < spots.length; i++){
				var spot = spots[i];
				var pits = spot.postits;
				postits.updatePostItsSpot(pits, spot.id, this);		
			}
		},
		function showKanban(){
			res.render('kanban/kanbanApp', {
			title: 'Kanban',
			kanbanId: req.params.id,
			save_error: ''
	});

		}
	);

}

module.exports.updateUsers = function(req, res){
	Step(
		var kanban = req.body;
		function removeAllUsers(){
			kanbans.removeAllUsers(kanban.id, this);
		},
		function relateUsers(err, result){
			kanbans.relateUsers(kanban.id, kanban.users, this);
		},
		function redirect(){
			res.redirect('kanban/'+kanban.id+'/users');
		}

	);
}

module.exports.getUsers = function(req, res){
	var kanbanUsers = [];
	Step(
		function getKanbanUsers(){
			users.getKanbanRelatedUsers(req.params.id, this);	
		},
		function getOtherUsers(err, result){
			kanbanUsers = result;
			console.log(result);
			res.render('kanban_users/list',{
				title: 'KanbanUsers',
				users: kanbanUsers,
				kanbanId: req.params.id
			});
		}
	);
}
