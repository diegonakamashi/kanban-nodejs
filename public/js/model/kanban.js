var FAYEPATH_SEND='/faye_channel'
var FAYEPATH_UPDATE='/faye_channel_update'
var FAYE_ADDRESS = '192.168.0.121:3000';
var FAYE_CLIENT='http://'+FAYE_ADDRESS+'/faye'
var SEND_POSTIT_POSITION_INTERVAL = 500;


function Kanban(id){
	if (! (this instanceof arguments.callee)) {
    	return new arguments.callee(arguments);
  	}
  	var self = this; 	
  	var spotList = [];//Lista de Spots
  	var movingPostit; //Postit que esta sendo movido
  	var fayeClient;
  	var kanbanHtml = new KanbanHtml(self);
  	var _id = id;
  	

  	self.getId = function(){
  		return _id;	
  	};

	self.getSpots = function(){
		return spotList;
	};

  	//Add a Spot to the Kanban
  	self.addSpot = function(spot) {
  		if(!spot)
  			return;  		
	    var self = this;
	    spot.setKanban(self);
	    spotList.push(spot);
    };

	self.removeSpot = function(spot){
		if(!spot)
			return;
		var self = this;
        var index = -1;
        for(var i = 0; i < spotList.length; i++){
            if(spot.getId() == spotList[i].getId())
            {
                index = i;
                break;
            }
        }
        
        if(index >= 0)
            spotList.splice(index, 1);

	}
    
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
    self.getSpotByName = function(spotName){
        var self = this;
        var kanbanSpot = null;
        spotList.each(function(spot){
            if(spot.getLabel() == spotName)
                kanbanSpot = spot;
        });
        
        return kanbanSpot;
    }
    
    self.getSpotById = function(spotId){
        var self = this;
        var kanbanSpot = null;
        spotList.each(function(spot){
            if(spot.getId() == spotId)
                kanbanSpot = spot;
        });
        
        return kanbanSpot;
    }

	self.sendNewSpotMsg = function(spot){
		var self = this;
		fayeClient.publish(FAYEPATH_SEND, {
			type: 'new_spot',
			spot: spot
		});
	}

	self.sendNewPostItMsg = function(pit){
		var self = this;
		fayeClient.publish(FAYEPATH_SEND, {
			type: 'new_postit',
			postit: pit
		});
	}

	self.sendDeletePostItMsg = function(id){
		var self = this;
		fayeClient.publish(FAYEPATH_SEND, {
			type: 'delete_pit',
			postitId: id
		});
	}

	self.sendDeleteSpotMsg = function(id){
		var self = this;
		fayeClient.publish(FAYEPATH_SEND, {
			type: 'delete_spot',
			postitId: id
		});
	}


    //Send the postitPosition to the Node Server
    self.sendPostitPosition = function() {
	    var self = this;
	    var x = 0;
	    var y = 0;
    	$(document).mousemove(function(e){
    		if(movingPostit){
			    console.log("Send information " + movingPostit);
			    var p_it = $("#"+movingPostit);
			    var position = p_it.offset();
			    fayeClient.publish(FAYEPATH_SEND, {
				    type: 'moving',
      				x: e.pageX,
      				y: e.pageY,
      				postit: movingPostit
			    });
			}
	    });
    };

    //Initialize the kanban.
    self.init = function(){
	    var self = this;	
		self.addProperties();
	    if(fayeClient == null)       
	    {
		    fayeClient = new Faye.Client(FAYE_CLIENT, {	timeout: 120 });
	        fayeClient.subscribe(FAYEPATH_UPDATE, function(message) {
				    console.log("Receive message");
				    if(message.type == 'moving'){
					    if(movingPostit != message.postit)
						    kanbanHtml.movePostId(message.postit, message.x, message.y);
				    }else if(message.type == 'drop'){				
				        kanbanHtml.onDropPostIt(message.p_id, message.newSpot);			
				    }else if(message.type == 'update'){
				    	
				    }else if(message.type == 'delete_pit'){
				    	kanbanHtml.deletePostIt(message.postitId);
				    }else if(message.type == 'delete_spot'){
				    	kanbanHtml.deleteSpot(message.postitId);
				    }else if(message.type == 'new_spot'){
				    	kanbanHtml.newSpot(message.spot);
				    }else if(message.type == 'new_postit'){
				    	kanbanHtml.newPostit(message.postit);
				    }
					
			    });
		}

		    setInterval(self.sendPostitPosition.bind(self), SEND_POSTIT_POSITION_INTERVAL);
    }

    self.addProperties = function(){
		var self = this; 
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
				    movingPostit = undefined;
			    },
		    });
		
        $( ".spot" ).droppable({
			    activeClass: "ui-state-default",
			    hoverClass: "ui-state-hover",
			    accept: ":not(.ui-sortable-helper)",
			    drop: function( event, ui ) {
				    $( ui.draggable ).appendTo( this );		
				    movingPostit = undefined;
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
    }
    
    self.getText = function(){
    	var text = 'Kanban\n';
    	spotList.each(function(spot){
    		text += '--------------\n';
    		text += spot.getText();
    		text += '\n';
    	});    	
    	return text;
    };

	self.getContent = function(){
		var self = this;
		var kanban = new Object();
		kanban.id = _id;
		kanban.spots = new Array();

		spotList.each(function(spot){
			kanban.spots.push(spot.getContent());
		});

		return kanban;
	}
	
	self.save = function(){
		var self = this;
		var kanban = new Object();
		kanban.spots = new Array();
		var index = 0;
		spotList.each(function(spot){
			kanban.spots[index++] = spot.getContentToSave();
		});

		$.post('/kanban/'+self.getId()+'/content', kanban, function(data){
			if(data){
				window.location ='/kanban/'+self.getId();
			}
		});
	}

	self.showErrorMsg = function(msg){
		alert(msg);//TODO mostrar de forma menos preguiçosa e mais bonita
	}
}

