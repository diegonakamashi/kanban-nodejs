var Step = require('step');
var users = require('../model/user');
var kanbans = require('../model/kanban');
var spots = require('../model/spot');
var postits = require('../model/postit');
var Util = require('util');

module.exports.create = function(req, res){
	var spot = new Object();
	spot.title=req.body.new_spot_title;
	spot.description=req.body.new_spot_description;
	spot.kanbanId=req.body.new_spot_kanbanId;

	Step(
		function saveSpot(){
			spots.save(spot, this);
		},
		function redirectToKanban(err, result){
			res.redirect('/kanban/'+spot.kanbanId);
		}
	);
}

