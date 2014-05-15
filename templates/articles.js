
if (Meteor.isClient){
  Template.allArticles.articles = Articles;
  Template.allArticles.tableSettings = { 
    rowsPerPage: 10, 
    fields: [
              'pii',
              {
                key:'pmc id',
                label:'pmc id', 
                fn: function(resolution, object){
                  return resolution;
                  // return Template.allArticles.showResolution(resolution);
                }
              },
              'doi',
              'publish date',
              'title',
              {
                key:'pii',
                label: 'scrape',
                fn: function(value, object){return new Spacebars.SafeString('<a id="scrape" _id="' + object._id + '">' + value + '</a>');}
              },
              {
                key:'reports',
                label: 'pmc:ok',
                fn: function(value, object){
                  if(object.reports){
                    return new Spacebars.SafeString( value[value.length -1]['pmc:ok'] );
                  }
                }
              },
              {
                key:'reports',
                label: 'stamp',
                fn: function(value, object){
                  if(object.reports){
                    return new Spacebars.SafeString( value[value.length -1].stamp );
                  }
                  else {return "wait on report";}
                }
              }
            ] };

  Template.addArticle.events({
    keypress: function(e){
      console.log(e);
      if (e.keyCode == 13 && !e.altKey){
        try{
          var article = JSON.parse(e.target.value);
          
         Articles.insert(article);
          console.log(article);
        }catch(err){
          console.log("Error: invalid JSON input");
        } 
      }
    }
  });
  Template.allArticles.events({
    'click #scrape': function(e, template){
      var _id = $(e.target).attr('_id');
      console.log(_id);
      Articles.update(_id, {$set: {scrape:true}});
    }
  });
  Template.allArticles.showResolution = function showResolution(resolution){
    var error;
    try{
      error = resolution.error;
    } catch(e){
      error = false;
    }
    if(error){
      console.log(error);
      console.log(resolution);
      return new Spacebars.SafeString('error');
    //  return new Spacebars.SafeString(error);
    } else {
      console.log(resolution);
      return new Spacebars.SafeString(resolution);
    }
  };
}

