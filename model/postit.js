var Step = require('step');
var Util = require('util');
var conn = require('./mysql-conn');

module.exports.save = function(postit, callback){
	var query = 'INSERT INTO post_it SET text = \"' + postit.text + '\", spot_id = ' + postit.spotId;
	
	Step(
		function execQuery(){
			conn.execute(query, this);
		},
		function callcallback(err, result){
			callback(err, result);
		}
	);
}

module.exports.findById = function(id, callback){
	var query = "SELECT * from post_it WHERE id = " + id;
	Step(
		function executeQuery(){
			conn.execute(query, this);
		},
		function callcallback(err, result){
			callback(err, result);
		}
	);
}

module.exports.deleteById = function(id, callback){
	var query = "DELETE from post_it WHERE id = " + id;
	Step(
		function executeQuery(){
			conn.execute(query, this);
		},
		function callcallback(err, result){
			callback(err, result);
		}
	);
}

module.exports.update = function(postit, callback){
	var query = "UPDATE post_it SET text = \""+postit.text+"\" WHERE id = " + postit.id;
	Step(
		function executeQuery(){
			conn.execute(query, this);
		},
		function callcallback(err, result){
			callback(err, result);
		}
	);
}

module.exports.findById = function(id, callback){
	var query = "SELECT * from post_it WHERE id = " + id;
	Step(
		function executeQuery(){
			conn.execute(query, this);
		},
		function callcallback(err, result){
			callback(err, result);
		}
	);
}

module.exports.deleteById = function(id, callback){
	var query = "DELETE from post_it WHERE id = " + id;
	Step(
		function executeQuery(){
			conn.execute(query, this);
		},
		function callcallback(err, result){
			callback(err, result);
		}
	);
}

module.exports.deletePostitsBySpot =function(spot, callback){
	var query = "DELETE from post_it WHERE spot_id = " + spot;
	
	Step(
		function executeQuery(){
			conn.execute(query, this);
		},
		function callcallback(err, result){
			callback(err, result);
		}
	);
}

module.exports.findBySpots = function(spots, callback){
	var spots_id = '';
	for(var i = 0; i < spots.length; i++){
		var separator = i == 0 ? '' : ', ';
		spots_id = spots_id + separator + spots[i].id;
	}	

	//TODO Retirar GAMBI
	if(spots_id.length == 0)
		spots_id='-100';

	var query = 'SELECT pi.* FROM post_it pi WHERE pi.spot_id in (' + spots_id + ')';

	Step(
		function executeQuery(){
			conn.execute(query, this);
		},
		function separatePostIt(err, postIts){
			var map = {};
			for(var i = 0; i < postIts.length; i++){
				console.log("Spot_id" + postIts[i].spot_id);
				var array = map[postIts[i].spot_id];
				if(!array){					
					array = new Array();
					map[postIts[i].spot_id] = array;
				}
				array.push(postIts[i]);
			}
			callback(err, map);
		}
	);

}

module.exports.updatePostItsSpot = function(postits, spot_id, callback){
	var ids = '';
	for(var i = 0; i < postits.length; i++){
		var separator = i == 0 ? '' : ', ';
		ids = ids + separator + postits[i].id;
	}
	
	//TODO GAMBI
	if(ids.length == 0)
		ids = '-100';

	var query = 'UPDATE post_it p SET p.spot_id = ' + spot_id + ' WHERE p.id in (' + ids + ')'; 
	Step(
		function executeQuery(){
			conn.execute(query, this);
		},
		function callcallback(err, result){
			callback(err, result);
		}
	);
}

