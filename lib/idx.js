// Graph description. This is where we define the info we want to collect about each collection item
// This stuff will occur in code requireing the module.

Articles = new Meteor.Collection("articles");

if(Meteor.isServer){
  var articleProto = idx.createGraph(Articles);
  articleProto.addVertices([
    { name:'pii', immutable:true },
    { name:'pmc id', immutable:true },
    { name:'doi', immutable:true },
    { name:'article info'},
    { name:'title', immutable:true },
    { name:'publish date', immutable:true },
    { name:'pmc status', status: true }
  ]);
  articleProto.addEdge({
    start:'pii',
    end: 'pii plus 1',
    type: 'local',
    resolve: function piiPlus1FromPii(start){return 1 + start;}
  });
  
  articleProto.addEdge({
    start:'article info',
    end: 'publish date',
    type: 'local',
    resolve: function titleFromPublisherJson(start){return start.pubdate_pretty;}
  });
  articleProto.addEdge({
    start:'article info',
    end: 'title',
    type: 'local',
    resolve: function titleFromPublisherJson(start){
      return start.title;
    }
  });
  articleProto.addEdge({
    start: 'pii',
    end: 'article info',
    type: 'json',
    url: 'https://www.landesbioscience.com/api/articles/get_article_json/[start]',
    resolve: function articleInfoFromPii(json){
      return json;
    }
  });
}
