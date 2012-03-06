var SPOT_CLASS = 'spot';
function Spot(label)
{
	if (! (this instanceof arguments.callee)) {
    	return new arguments.callee(arguments);
  	}

    var self = this;
  	var _label = label;
  	var _postIts = [];
  	
  	self.getLabel = function(){
  	    var self = this;
        return _label;
    };
    
    self.getHtml = function(){
        var self = this;
        var html = ''+            
                '<h3 class="ui-widget-header">'+_label+'</h3>'+
                '<div class="'+SPOT_CLASS+'" id="'+_label+'">'+
                    self.getPostItsHtml() +
                '</div>';            
        return html;
    };
    
    self.getPostItsHtml = function(){
        var self = this;
        var html = '';
        _postIts.each(function(postIt){
            html += postIt.getHtml();
        });
        
        return html;
    };
    
    //TODO -> Check if The postIt already exist in the list
    self.addPostIt = function(postIt){
        var self = this;
        postIt.setSpot(self);
        _postIts.push(postIt);
    };
    
    self.getPostIt = function(id){
        var self = this;
        var pIt = null;
        _postIts.each(function(postIt){
            if(id == postIt.getId())
                pIt = postIt;
        });
        
        return pIt;
    };
    
    self.removePostIt = function(postIt){
        var self = this;
        var index = -1;
        for(var i = 0; i < _postIts.length; i++){
            if(postIt.getId() == _postIts[i].getId())
            {
                index = i;
                break;
            }
        }
        
        if(index >= 0)
            _postIts.splice(index, 1);
    };

    self.getText = function(){
        var text = 'Spot: ' + _label + '\n';
        text += 'Lista de Post Its:\n';
        text = text + 'Tamanho: ' + _postIts.length + '\n';
        _postIts.each(function(postIt){
            text = text + postIt.getText() + '\n';
        });

        return text;
    }
}
