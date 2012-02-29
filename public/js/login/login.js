$(function(){
	$('#login_btn').click(function(){
		var name = $('#login_username').val();
		var password = $('#login_password').val();		
		var hash_password = hex_md5(password);
		$.post('/session', { username: name, password: hash_password}, function(data){
		alert(data);
		});
	});
});

