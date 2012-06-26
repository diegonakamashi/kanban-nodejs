var conn = require('./mysql-conn');
var Step = require('step');

module.exports.findAll = function(callback){
	var query = 'SELECT * FROM user';
	Step(
		function executeQuery(){
			conn.execute(query, this);
		},
		function callCallback(err, result){
			callback(err, result);
		}
	);

}



module.exports.findByUsername = function(username, callback){
	var query = 'SELECT * FROM user WHERE username = \'' + username + '\' ';
	console.log('Executing query : ' + query)
	Step(
		function executeQuery(){
			conn.execute(query, this);	
		},
		function callCallback(err, result){
			callback(err, result);
		}
	);
}
	
module.exports.create = function(user, callback){
	console.log(user);
	var query = 'INSERT INTO user SET username = "' + user.username + '", password = "' + user.password + '", role = ' + user.role + ', name = "' + user.username + '"';

	Step(
		function executeQuery(){
			conn.execute(query, this);
		},
		function callCallBack(err, results){
			callback(err, results);
		}
	);
}

module.exports.getByKanbanId = function(id, callback){
	var query = 'SELECT * FROM user, user_kanban WHERE user.id = user_kanban.user_id AND user_kanban.kanban_id = ' + id;

	Step(
		function execQuery(){
			conn.execute(query, this);
		},
		function callCallBack(err, results){
			callback(err, results);
		}
	);
}

module.exports.getKanbanRelatedUsers = function(kanban_id, callback){
	var query = 'SELECT u.id as id, u.username as username, u.role as role, uk.kanban_id as kanban_id, uk.user_id as user_id FROM user u  LEFT OUTER JOIN user_kanban uk ON u.id = uk.user_id and uk.kanban_id=' + kanban_id;
	Step(
		function execQuery(){
			conn.execute(query, this);
		},
		function callCallBack(err, results){
			callback(err, results);
		}
	);

}
