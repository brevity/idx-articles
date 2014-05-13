
if (Meteor.isClient){
  Template.allArticles.articles = Articles;
  Template.allArticles.tableSettings = { 
    rowsPerPage: 100, 
    fields: [
              'pii',
              'pii plus 1',
              'doi',
              'pmc id',
              'publish date',
              'title',
              {
                key:'reports',
                label: 'pmc status',
                fn: function(value, object){
                  if(object.reports){
                    return new Spacebars.SafeString( value[value.length -1]['pmc status'] );
                  }
                  else {return "wait on report";}
                }
              },
              {
                key:'pii',
                label: 'scrape',
                fn: function(value, object){return new Spacebars.SafeString('<a id="scrape" _id="' + object._id + '">' + value + '</a>');}
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

