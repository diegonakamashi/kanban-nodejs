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
