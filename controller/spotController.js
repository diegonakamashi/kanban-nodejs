var Step = require('step');
var users = require('../model/user');
var kanbans = require('../model/kanban');
var spots = require('../model/spot');
var postits = require('../model/postit');
var Util = require('util');

module.exports.create = function(req, res){
	console.log('CREATE SPOT ' + Util.inspect(req));
	var spot = new Object();
	spot.title=req.body.title;
	spot.description=req.body.description;
	spot.kanbanId=req.body.kanbanId;

	Step(
		function saveSpot(){
			spots.save(spot, this);
		},
		function redirectToKanban(err, result){
			console.log("TESTE "+Util.inspect(result));
			res.render('kanban/kanbanApp', {
				locals:{
					title: 'Kanban',
					kanbanId: spot.kanbanId,
					spotId: result.insertId,
					save_error:  err ? err.msg : ''
				}}			
			);
		}
	)
}

module.exports.del = function(req, res){
	Step(		
		function deletePostIts(){
			postits.deletePostItsBySpot(req.params.id, this);
		},
		function deleteSpot(err, result){
			spots.del(req.params.id, this);
		},
		function renderEditPostit(err, result){
			var response = {code: 'ok'};
			res.send(response);
		}
	);
}
