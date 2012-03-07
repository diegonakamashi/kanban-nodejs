var Step = require('step');
var users = require('../model/user');
var kanbans = require('../model/kanban');
var spots = require('../model/spot');
var postits = require('../model/postit');
var Util = require('util');

module.exports.create = function(req, res){
	console.log('Tesntado #########################');
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
