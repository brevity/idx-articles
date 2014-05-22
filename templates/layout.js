if(Meteor.isClient){
  Template.layout.active = function(path){
    var current;
    try{
      current = Router.current().path ;
    } catch(e){
      current = "/";
    }
    if(path == current){
    return 'active';
    } else {
      return '';
    }
  };
}
