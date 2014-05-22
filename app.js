Router.configure({ layoutTemplate: 'layout' });
Router.map(function(){
  this.route('allArticles', {
    path:'/', 
    data: { articles: Articles.find({})}
  });
  this.route('graph', {
    path:'/graph',
    data: {articles: Articles.find({})}
  });
  this.route('lens', {
    path:'/lens',
    data: {}
  });
  this.route('graph.json', {
    path: '/graph.json',
    where: 'server',
    action: function () {
      var graph = {};
      graph.Vertices = idx.graphs.articles.Vertices;
      graph.Edges = idx.graphs.articles.Edges;
      this.response.setHeader('Content-Type', 'application/json');
      this.response.end(JSON.stringify(graph));
    }
  });
});

if(Meteor.isServer){
  Meteor.startup(function startup() {
    Articles.remove({});
  });

}
if(Meteor.isClient){
  Meteor.startup(function clientStartup(){
    if (Articles.find({}).count() === 0) {
      var articleCount = 0;
      //Meteor.setTimeout(function wait5Seconds(){
        var articleAdder = Meteor.setInterval(function addAnArticle(){
          var article = { pii: Meteor.testids.shift()[0]};
          articleCount++;
          if(articleCount > 0){
            Meteor.clearInterval(articleAdder);
          }
          Articles.insert(article);
        },5);
     // },5000);
    }
  });
}
