var conn = require('./mysql-conn');


module.exports.save = function(kanban){
	conn.execute('INSERT INTO kanban SET TITLE= ' + kanban.title + ', DESCRIPTION = ' + kanban.description);
}


module.exports.findByUserId = function(userId){
	var result = conn.execute('SELECT * FROM kanban k, user_kanban uk WHERE k.id = uk.kanbanId AND uk.userId = ' + userId);

	console.log(result);
	return [];
}

module.exports.create = function(kanban){
	kanbans.push(kaban);
}


