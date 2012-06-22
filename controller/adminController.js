var Step = require('step');
var users = require('../model/user');
var kanbans = require('../model/kanban');
var spots = require('../model/spot');
var postits = require('../model/postit');
var Util = require('util');

module.exports.renderIndex = function(req, res){
	res.render('admin/index', {locals:{
		title: 'Admin'
	}});
}



