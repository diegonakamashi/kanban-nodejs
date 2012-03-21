var Step = require('step');
var users = require('../model/user');
var kanbans = require('../model/kanban');
var spots = require('../model/spot');
var postits = require('../model/postit');
var Util = require('util');

module.exports.create = function(req, res){
	var postit = new Object();
	postit.text=req.body.new_postit_text;
	postit.spotId=req.body.new_postit_spot;

	Step(
		function savePostIt(){
			postits.save(postit, this);
		},
		function redirectToKanban(err, result){
			if(err)
				throw err;
			res.redirect('/kanban/'+req.body.new_postit_kanbanId);
		}
	);
}

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

module.exports.del = function(req, res){
	
}
