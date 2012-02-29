var mysql = require('mysql');
var DATABASE = 'kanban_node';
var client = mysql.createClient({
	user: 'root',
	password: '',
});

client.query('USE ' + DATABASE);

module.exports.execute = function(query, callback){

	console.log('Executing query ' + query);
	client.query(query, function(err, results, fields){
		if(err)
			throw err;
			
	});
}
