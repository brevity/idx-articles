if(Meteor.isServer){
  Meteor.startup(function () {
    Articles.remove({});
    if (Articles.find().count() === 0) {
      for (var i = 0; i < 3; i++){
        var article = { pii: Math.floor(Math.random()*10000)};
        console.log("inserting ->", article);
        Articles.insert(article);
      }
    }
  });
}
