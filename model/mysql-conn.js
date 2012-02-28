var mysql = require('mysql');
var DATABASE = 'kanbanNode';
var client = mysql.createClient({
	user: 'root',
	password: '',
});

client.query('USE ' + DATABASE);

module.exports.execute = function(query){
	client.query(query, function(err, results, fields){
		if(err)
			throw err;

		return results;	
	});
}
