var kanbans = [
	{
		id: 1,
		user_id: 1,
		name: 'Kanban Teste',
		description: 'Kanban ja criado em memória'
	}
];

module.exports.findByUserId = function(userId){
	var _kanbans = [];
	for(var i = 0; i < kanbans.length; i++){
		var kanban = kanbans[i];
		if(kanban.user_id = userId){
			_kanbans.push(kanban);
		}
	}
	return _kanbans;
}

module.exports.create = function(kanban){
	kanbans.push(kaban);
}


