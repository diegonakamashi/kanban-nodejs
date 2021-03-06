var POSTIT_CLASS='post-it';
function PostIt(id, txt)
{
	if (! (this instanceof arguments.callee)) {
    	return new arguments.callee(arguments);
  	}

  	var self = this;

  	var _id = id;
  	var _txt = txt;
  	var _spot ;
  	var priority;
  	
  	self.getId = function(){
  	    var self = this;
  	    return _id;
  	}
  	
  	self.getSpot = function() {
  	    var self = this;
	    return _spot;
    };
    
    self.setSpot = function(spot) {        
        var self = this;
        _spot = spot;
    };
    
    self.getHtml = function() {
        var self = this;
        var links = '<span>' +
        				'<label onclick=\'deletePostIt('+self.getId()+');\'>Delete</label>'+
        			'</span>';
        var html = '<div id="'+_id+'" class="'+POSTIT_CLASS+'" ;\" ><label>'+_txt+'</label>' +links+'</div>';
	    return html;
    };

    self.getText = function(){
      var text = 'Post-it ' + _id + '\n';
      return text;
    }

    self.getContentToSave = function(){
    	var self = this;
    	var pit = new Object();
    	pit.id = self.getId();
    	return pit;
    };

    self.del = function(){
    	var self = this;
    	$.post('/postit/'+self.getId()+'/delete', function(data) {
    		var spot = self.getSpot();
    		var kanban = spot.getKanban();
 			kanban.sendDeletePostItMsg(self.getId());
   	    });
    }
}
