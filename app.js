require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

//install mongoose and require it
const mongoose = require("mongoose");

const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const Address = process.env.Database_ID;

//Connect to a new database
mongoose.set("strictQuery", true);
//mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {useNewUrlParser: true});
mongoose.connect("mongodb+srv://"+ Address +"/blogDB", {useNewUrlParser: true});

//Create a new postSchema that contains a title and content.
const postSchema = {
  title: String,
  content: String
};

//Create a new mongoose model using the schema to define your posts collection.
const Post = mongoose.model("Post", postSchema);

//To see the posts created in the compose page.
//delete --> let posts = [];

app.get("/", function(req, res){

  //To find all the posts in the posts collection and render that in the home.ejs file.
  Post.find({}, function(err,posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  //Create a new post document using your mongoose model.
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  //Add a call back to the mongoose save() method.
  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });
});

//change the express route parameter to postId instead.
app.get("/posts/:postId", function(req, res){

  //store the postId parameter value
  const requestedPostId = req.params.postId;

  //Find the post with a matching id in the posts collection.
  Post.findOne({_id: requestedPostId}, function(err, post){ 

    //Once a matching post is found, you can render its title and content in the post.ejs page.
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 2000;
};

app.listen(port, function() {
  console.log("Server has started successfully");
});