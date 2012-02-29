var conn = require('./mysql-conn');

module.exports.findByUsername = function(username){
	var query = 'SELECT * FROM user WHERE username = \'' + username + '\' ';
	console.log('Executing query : ' + query)
	var result = conn.execute(query);
	
	console.log('RESULT: ' +result) ;

	if(result && result.length > 0)
		return result[0];

	return null;
}
