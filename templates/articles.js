
if (Meteor.isClient){
  Template.allArticles.articles = Articles;
  Template.allArticles.tableSettings = { 
    rowsPerPage: 100, 

    fields: [
              'pii',
              'pm id',
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
                    return new Spacebars.SafeString("<span data-livestamp='" + value[value.length -1].stamp.toISOString() + "'></span>");
                  }
                  else {return "wait on report";}
                }
              }
            ] };

  Template.addArticle.events({
    keypress: function(e){
      if (e.keyCode == 13 && !e.altKey){
        try{
          var article = JSON.parse(e.target.value);
          
         Articles.insert(article);
        }catch(err){
        } 
      }
    },
    'click .add-article-json': function(e, template){
      var article = {},
          json = template.$('#addArticle').val();
      console.log("add-article-json", json);
      if(json === ""){
        article['pmc id'] = Meteor.testids.shift()[2];
      } else {
        try{
          article = JSON.parse(json);
        } catch(err) {
          console.log("Error: Your JSON is malformed");
        }
      }
      Articles.insert(article);
    },
    'click .add-article-by-id': function(e, template){
      for(var i = 0; i < 5; i++){
        var idName = e.target.outerText,
            article = {};

        if (idName == "pii"){
          article[idName] = Meteor.testids.shift()[0];
        } else if (idName == "doi") {
          article[idName] = Meteor.testids.shift()[1];
        } else if (idName == "pm id") {
          article[idName] = Meteor.testids.shift()[2];
        } else if (idName == "pmc id") {
          article[idName] = Meteor.testids.shift()[3];
        }
        Articles.insert(article);
      }
    },
    'click #clear-articles': function(e, template){
      var _ids = Articles.find({}, {_id:1}).map(function(item){ return item._id; });
      for (var _id in _ids){
        Articles.remove(_ids[_id]);
      }
    }
  });
  Template.allArticles.events({
    'click #scrape': function(e, template){
      var _id = $(e.target).attr('_id');
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
      return new Spacebars.SafeString('error');
    //  return new Spacebars.SafeString(error);
    } else {
      return new Spacebars.SafeString(resolution);
    }
  };
}

