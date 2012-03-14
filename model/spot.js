var conn = require('./mysql-conn');
var Step = require('step');
var Util = require('util');

module.exports.save = function(spot, callback)
{
	var validateQuery = 'SELECT count(*) as count FROM spot WHERE title = \"' + spot.title + '\" AND kanban_id = ' + spot.kanbanId;
	var query = 'INSERT INTO spot SET TITLE = \"' + spot.title + '\", DESCRIPTION = \"' + spot.description + '\",KANBAN_ID = ' + spot.kanbanId;
	Step(
		function validate(){
			conn.execute(validateQuery, this);
		},
		function execQuery(err, count){
			console.log('COUNT ' + Util.inspect(count));
			var count = count[0].count;
			if(count > 0)
			{
				var err = new Object();
				err.type = 'DUPLICATED';
				err.message = 'Spot already exisit',
				callback(err, count);
			}
			else
				conn.execute(query, this);
		},
		function callcallback(err, result){
			callback(err, result);
		}
	);
}

module.exports.findByKanbanId = function(kanbanId, callback){
	var query = 'SELECT s.* FROM spot s WHERE s.kanban_id = ' + kanbanId;
	Step(
		function executeQuery(){
			conn.execute(query, this);
		},
		function callcallback(err, spots){
			callback(err, spots);
		}
	);
}
