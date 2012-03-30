function KanbanHtml(_kanban){
	if (! (this instanceof arguments.callee)) {
    	return new arguments.callee(arguments);
  	}
  	var self = this; 	
  	var kanban = _kanban;

	self.movePostId = function(id, left, top) {	
	    var coord = {
		    left: left,
		    top: top
	    };
		if('#'+id)
	    	$('#'+id).offset(coord);
    };
	
	self.addPostIt = function(){
		//TODO
	}

	self.deletePostIt = function(id){
		var self = this;
		var postItObj = kanban.getPostIt(id);
        var spotObj = postItObj.getSpot();//?	
	    
	    spotObj.removePostIt(postItObj);
	   	$('#'+id).remove();
	}
	self.onDropPostIt = function(id, newSpotId) {	
        var self = this;
        var postItElem = $('#'+id);
        var postItObj = kanban.getPostIt(id);
	    var newSpotHtml = $('#'+newSpotId);
        var newSpotObj = kanban.getSpotByName(newSpotId);
        var oldSpotObj = postItObj.getSpot();//?	
        
	    postItElem.appendTo(newSpotHtml);	

	  	postItElem.removeAttr("style");
	    newSpotObj.addPostIt(postItObj);
	    oldSpotObj.removePostIt(postItObj);
    };

    self.deleteSpot = function(){
    	//TODO
    }

    self.createSpot = function(){
    	//TODO
    }

	

}

