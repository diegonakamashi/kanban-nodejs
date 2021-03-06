var conn = require('./mysql-conn');
var Step = require('step');
var Util = require('util');


module.exports.findByUserId = function(userId, callBack){
	var query = 'SELECT k.* FROM kanban k, user_kanban uk WHERE k.id = uk.kanban_id AND uk.user_id = ' + userId;
	Step(
		function executeQuery(){
			conn.execute(query, this);
		},
		function callCallback(err, results){
			callBack(err, results);
		}
	);
}

module.exports.findById = function(id, callBack){
	var query = 'SELECT k.* FROM kanban k WHERE k.id = ' + id;
	Step(
		function executeQuery(){
			conn.execute(query, this);
		},
		function callCallback(err, results){
			callBack(err, results);
		}
	);
}

module.exports.create = function(kanban, user, callback){
	var kanbanQuery = 'INSERT INTO kanban SET title = \"' + kanban.title + '\", description = \"' + kanban.description + '\"';

	Step(
		function executeKanbanQuery(){
			conn.execute(kanbanQuery, this);
		},
		function insertUserKanban(err, results){
			var query = 'INSERT INTO user_kanban SET user_id = ' + user.id + ', kanban_id = ' + results.insertId;
			conn.execute(query, this);
		},
		function callcallback(err, results){
			callback(err, results);
		}
	);
}

module.exports.removeAllUsers = function(id, callback){
	var query = 'DELETE from user_kanban WHERE kanban_id = ' + id + ' and user_id in (SELECT user.id FROM user where user.role = 0)';
	Step(
		function executeQuery(){
			conn.execute(query, this);
		},
		function callCallback(err, results){
			callback(err, results);
		}
	);
}

module.exports.relateUsers = function(id, users, callback){
	Step(
		function updateUser(){
			while(users.length > 0){
				var user = users.pop();
				var query = 'INSERT INTO user_kanban SET user_id = ' + user + ', kanban_id = '+ id;
				conn.execute(query, this);
			}
		},
		function loop(err, result){
			if(users.length == 0){
				callback(err, result);
			}
		}
	);
}
