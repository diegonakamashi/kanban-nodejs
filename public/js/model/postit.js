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
        var html = '<div id="'+_id+'" contenteditable="true" class="'+POSTIT_CLASS+'">'+_txt+'</div>';
	    return html;
    };

    self.getText = function(){
      var text = 'Post-it ' + _id + '\n';
      return text;
    }
}
