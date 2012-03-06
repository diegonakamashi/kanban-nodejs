var FAYEPATH_SEND='/faye_channel'
var FAYEPATH_UPDATE='/faye_channel_update'
var FAYE_ADDRESS = '192.168.191.196:3000';
var FAYE_CLIENT='http://'+FAYE_ADDRESS+'/faye'
var SEND_POSTIT_POSITION_INTERVAL = 500;


function Kanban(){
	if (! (this instanceof arguments.callee)) {
    	return new arguments.callee(arguments);
  	}
  	var self = this; 	
  	var spotList = [];//Lista de Spots
  	var movingPostit; //Postit que esta sendo movido
  	var fayeClient;
  	
  	//Add a Spot to the Kanban
  	self.addSpot = function(spot) {
	    var self = this;
	    spotList.push(spot);
    };
    
    //TODO -> Refactoring in this code
    self.getPostIt = function(id) {
	    var self = this;
	    var postIt = null;
	    spotList.each(function(spot){
	        var pIt = spot.getPostIt(id);
	        if(pIt != null)
	            postIt = pIt;
	    });
	    return postIt;
    };

    //Build the Kanban. 
    //@local = Html Element Id where the kanban will be build.
    self.build = function(local) {
        var self = this;
        var html = '';
        spotList.each(function(spot){
           html += spot.getHtml();        
        });
        
        var localElem = $('#'+local);
        localElem.html(html);    
        $.getScript('http://'+FAYE_ADDRESS+'/faye.js', function(){         	
        	self.init();
    	});
    };

    //Returns a Spot Object
    self.getSpot = function(spotName){
        var self = this;
        var kanbanSpot = null;
        spotList.each(function(spot){
            if(spot.getLabel() == spotName)
                kanbanSpot = spot;
        });
        
        return kanbanSpot;
    }

    //Send the postitPosition to the Node Server
    self.sendPostitPosition = function() {
	    var self = this;
	    var x = 0;
	    var y = 0;
	    if(movingPostit){
     		$(document).mousemove(function(e){
			    console.log("Send information");
			    var p_it = $("#"+movingPostit);
			    var position = p_it.offset();
			    fayeClient.publish(FAYEPATH_SEND, {
				    type: 'moving',
      				x: e.pageX,
      				y: e.pageY,
      				postit: movingPostit
			    });
		    });
	    }
    };

    //Initialize the kanban.
    self.init = function(){
	    var self = this;	
	    if(fayeClient == null)       
	    {
		    fayeClient = new Faye.Client(FAYE_CLIENT, {	timeout: 120 });
	        fayeClient.subscribe(FAYEPATH_UPDATE, function(message) {
				    console.log("Receive message");
				    if(message.type == 'moving'){
					    if(movingPostit != message.postit)
						    self.movePostId(message.postit, message.x, message.y);
				    }else if(message.type == 'drop'){				
				        self.onDropPostIt(message.p_id, message.newSpot);			
				    }
			    }); 	
		}

	    $( ".post-it" ).draggable({
			    appendTo: "body",
			    helper: "clone",
			    start: function(){
				    movingPostit = this.id;			
			    },
			    drag: function(){	
				    movingPostit = this.id;				
			    },
			    stop: function(){
				    movingPostit = null			
			    },
		    });
		
        $( ".spot" ).droppable({
			    activeClass: "ui-state-default",
			    hoverClass: "ui-state-hover",
			    accept: ":not(.ui-sortable-helper)",
			    drop: function( event, ui ) {
				    $( ui.draggable ).appendTo( this );		
				    movingPostit = null;
				    fayeClient.publish(FAYEPATH_SEND, {
					    type: 'drop',
      					p_id: ui.draggable[0].id,
      					newSpot: this.id
				    });	
			    } 
		    }).sortable({
			    items: "div:not(.placeholder)",
			    sort: function() {
				    $( this ).removeClass( "ui-state-default" );
			    }
		    });

		    setInterval(self.sendPostitPosition.bind(self), SEND_POSTIT_POSITION_INTERVAL);
    }

    //Move the postit in the page
    self.movePostId = function(id, left, top) {	
	    var coord = {
		    left: left,
		    top: top
	    };
		if('#'+id)
	    	$('#'+id).offset(coord);
    };

    self.onDropPostIt = function(id, newSpotId) {	
        var self = this;
        var postItElem = $('#'+id);
        var postItObj = self.getPostIt(id);
	    var newSpotHtml = $('#'+newSpotId);
        var newSpotObj = self.getSpot(newSpotId);
        var oldSpotObj = postItObj.getSpot();//?	
        
	    postItElem.removeAttr("style");
	    postItElem.appendTo(newSpotHtml);	

	    newSpotObj.addPostIt(postItObj);
	    oldSpotObj.removePostIt(postItObj);
    };

    self.addPostIt = function(id) {
	    var self = this;
	    self.postItList.push
    };

    self.getText = function(){
    	var text = 'Kanban\n';
    	spotList.each(function(spot){
    		text += '--------------\n';
    		text += spot.getText();
    		text += '\n';
    	});    	
    	return text;
    }
      
}

