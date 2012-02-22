var users = [
	{
		id: 1,
		name: 'admin',
		password: 'teste'
	}
]

module.exports.find_by_name = function(name){
	for(var i = 0; i < users.length; i++){
		if(users[i].name == name)
			return users[i];
	}
	return null;
}
