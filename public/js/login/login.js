$(function(){
	$('#login_btn').click(function(){
		var name = $('#login_username').val();
		var password = $('#login_password').val();		
		$('#login_hashpassword').val(hex_md5(password));
		document.login_form.submit();
	});
});

