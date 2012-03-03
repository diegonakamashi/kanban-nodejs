var conn = require('./mysql-conn');
var Step = require('step');
var Util = require('util');

module.exports.save = function(spot, callback)
{
	var query = 'INSERT INTO spot SET TITLE = ' + spot.title + ', DESCRIPTION = ' + spot.description + ',KANBAN_ID = ' + spot.kanban_id;
	Step(
		function execQuery(){
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
