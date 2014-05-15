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
          var article = { pii: Meteor.testPiis.shift()};
          articleCount++;
          if(articleCount > 5){
            Meteor.clearInterval(articleAdder);
          }
          Articles.insert(article);
        },500);
     // },5000);
    }
  });
}


