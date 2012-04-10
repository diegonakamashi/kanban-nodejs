function KanbanHtml(_kanban){
	if (! (this instanceof arguments.callee)) {
    	return new arguments.callee(arguments);
  	}
  	var self = this; 	
  	var kanban = _kanban;
	
	self.addHtml = function(html){
    	$('#local').append(html);
    }


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

    self.deleteSpot = function(id){
    	var self = this;
    	var spotObj = kanban.getSpotById(id);
		kanban.removeSpot(spotObj);
		$('#new_postit_spot option[value='+id+']').remove();//Remove opção do select
		$('#'+spotObj.getLabel()).remove();
    }

    self.newSpot = function(spot){
    	var self = this;
		$("#new_postit_spot").append('<option value="'+spot.id+'">'+spot.title+'</option>');
    	var spotObj = new Spot(spot.id, spot.title);
		kanban.addSpot(spotObj);
		self.addHtml(spotObj.getHtml());
    }

   self.newPostit = function(pit){
   		var self = this;
   		var pitObj = new PostIt(pit.postItId, pit.txt);
   		var spot = kanban.getSpotById(pit.spotId);
   		spot.addPostIt(pitObj);
		$('#'+spot.getLabel()+'').append(pitObj.getHtml());
   }
}

