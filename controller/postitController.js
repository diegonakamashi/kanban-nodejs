var Step = require('step');
var users = require('../model/user');
var kanbans = require('../model/kanban');
var spots = require('../model/spot');
var postits = require('../model/postit');
var Util = require('util');

module.exports.create = function(req, res){
	var postit = new Object();
	postit.text=req.body.txt;
	postit.spotId=req.body.spotId;

	Step(
		function savePostIt(){
			postits.save(postit, this);
		},
		function redirectToKanban(err, result){
			var response = {
					title: 'Kanban',
					kanbanId: postit.kanbanId,
					postItId: result.insertId,
					save_error:  err ? err.msg : ''
				}
			res.send(response);
		}
	);
}

/*
module.exports.edit = function(req, res){
	Step(		
		function getPostIt(){
			postits.findById(req.params.id, this);
		},
		function renderEditPostit(err, result){
			res.render('postit/edit', {
				title: 'Post-It',
				postIt: result[0]
			});
		}
	);
}

module.exports.update = function(req, res){
	var postit = new Object();
	postit.id = req.params.id;
	postit.text = req.body.postit_txt;
	Step(
		function update(){
			postits.update(postit, this);
		},
		function backToKanban(err, result){
			res.redirect('back');
		}
	);
}
*/

module.exports.del = function(req, res){
	Step(		
		function getPostIt(){
			postits.deleteById(req.params.id, this);
		},
		function renderEditPostit(err, result){
			var response = {code: 'ok'};
			res.send(response);
		}
	);
}
