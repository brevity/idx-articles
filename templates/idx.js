// Graph description. This is where we define the info we want to collect about each collection item
// This stuff will occur in code requireing the module.

Articles = new Meteor.Collection("articles");

if(Meteor.isServer){
  var articleProto = idx.createGraph(Articles);
  
  articleProto.addVertices([
    { name:'pii' },
    { name:'doi' },
    { name:'author id', status:true },
    { name:'last name', status: true },
    { name:'first name', status: true }
  ]);
  
  articleProto.addEdge({
    start:'author info',
    end: 'last name',
    type: 'local',
    resolution: function titleFromPublisherJson(start){return start.last_name;}
  });
  
  articleProto.addEdge({
    start:'author info',
    end: 'author id',
    type: 'local',
    resolution: function titleFromPublisherJson(start){return start.id;}
  });
  articleProto.addEdge({
    start:'author info',
    end: 'first name',
    type: 'local',
    resolution: function titleFromPublisherJson(start){
      return start.first_name;
    }
  });
  articleProto.addEdge({
    start: 'pii',
    end: 'author info',
    type: 'json',
    url: 'https://www.landesbioscience.com/api/articles/get_article_json/[start]',
    resolution: function publisherJsonFromPii(json){
      return json.authors_hash[0];
    }
  });
  articleProto.addVertex({
    name:'first author info'
  });
}
