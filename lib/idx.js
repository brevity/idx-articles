// Graph description. This is where we define the info we want to collect about each collection item
// This stuff will occur in code requireing the module.

Articles = new Meteor.Collection("articles");

if(Meteor.isServer){
  var articleProto = idx.createGraph(Articles);
  articleProto.addVertices([
    { name:'pii', immutable:true },
    { name:'pii plus 1', immutable:true},
    { name:'article info'},
    { name:'title', immutable:true },
    { name:'doi', immutable:true },
    { name:'publish date', immutable:true },
    { name:'pmc id', immutable:true },
    { name:'pmc scrape'},
    { name:'pmc:ok', status:true}
  ]);
  articleProto.addEdge({
    start:"pmc scrape",
    end:"doi",
    type:"local",
    resolve: function doiFromPmcScrape(json){
      if(json.status == "ok"){
        return json.records.doi;
      } else {
        return {error:'not found with pmc scrape'};
      }
    }
  });
  articleProto.addEdge({
    start: 'pmc id',
    end: 'pmc scrape',
    type: 'json',
    url: 'http://www.pubmedcentral.nih.gov/utils/idconv/v1.0/?ids=[start]&format=json',
    resolve: function pmcScrape(json){ 
      return json;
    }
  });
  articleProto.addEdge({
    start: 'pmc scrape',
    end: 'pmc:ok',
    type: 'local',
    resolve: function pmcOk(json){ 
      if(json.status == 'ok'){
        return "true";
      }
      return "false";
    }
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
    start:'article info',
    end: 'pmc id',
    type: 'local',
    resolve: function (start){
      var id = start.pmcid;
      if(id){
        return id;
      }else{
        return {error:"not found"};
      }
    }
  });
  articleProto.addEdge({
    start:'article info',
    end: 'doi',
    type: 'local',
    resolve: function titleFromPublisherJson(start){
      var id =  start.doi;
      if(id){
        return id;
      } else{
        return {error: "not found"};
      }
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
