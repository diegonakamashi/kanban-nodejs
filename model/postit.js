var Step = require('step');
var Util = require('util');

module.exports.save = function(postit, callback){
	var query = 'INSERT INTO post_it pi SET pi.text = ' + postit.text + ', pi.spot_id = ' + pi.spot_id;
	
	Step(
		function execQuery(){
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

	var query = 'SELECT pi.* FROM post_it pi WHERE pi.spot_id in (' + spots_id + ')';

	Step(
		function executeQuery(){
			conn.execute(query, this);
		},
		function separatePostIt(err, postIts){
			var map = {};
			for(var i = 0; i < postIts.length; i++){
				var array = map[postIts[i].id];
				if(!array){					
					array = new Array();
					map[postIts[i].id] = array;
				}
				array.push(postIts[i]);
			}
			callback(err, map);
		}
	);

}

