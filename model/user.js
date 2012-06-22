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
	

