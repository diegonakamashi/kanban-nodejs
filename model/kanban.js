var conn = require('./mysql-conn');
var Step = require('step');


module.exports.save = function(kanban){
	conn.execute('INSERT INTO kanban SET TITLE= ' + kanban.title + ', DESCRIPTION = ' + kanban.description);
}


module.exports.findByUserId = function(userId, callBack){
	var query = 'SELECT * FROM kanban k, user_kanban uk WHERE k.id = uk.kanban_id AND uk.user_id = ' + userId;
	Step(
		function executeQuery(){
			conn.execute(query, this);
		},
		function callCallback(err, results){
			callBack(err, results);
		}
	);
}

module.exports.create = function(kanban){
	kanbans.push(kaban);
}


