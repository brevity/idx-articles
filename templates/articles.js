// Set up a collection to contain article information. On the server,
// it is backed by a MongoDB collection named "articles".
//

if (Meteor.isClient){
  Template.allArticles.articles = Articles;
  Template.allArticles.tableSettings = { 
    rowsPerPage: 100, 
    fields: [
              'pii',
              {
                key: 'reports',
                label: 'title',
                fn: function(value, object){
                  if (object.reports){
                  var reports = object.reports,
                      last = reports.length -1,
                      title = object.reports[reports.length -1].title;
                  return new Spacebars.SafeString(title);
                  } else {
                    return new Spacebars.SafeString("Scrape pending");
                  }
                }
              },
              {
                key:'pii',
                label: 'scrape',
                fn: function(value, object){return new Spacebars.SafeString('<a id="scrape" _id="' + object._id + '">' + value + '</a>');}
              }
            ] };

  Template.addArticle.events({
    keypress: function(e){
      if (e.keyCode == 13){
        Articles.insert({pii:e.target.value});
        console.log(e.target.value);

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
}

