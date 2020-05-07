const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js");
// console.log(date());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
let items=[];
let workItems=[];

app.set('view engine', 'ejs');

app.get("/", function(req, res) {
  let day = date.getDate();
 res.render('index', {

    listTitle: day, newItems: items});
  });
app.post("/" ,function(req,res){
  console.log(req.body);

  let item=req.body.itemList;
  if(req.body.list==="Work")
  {
    workItems.push(item);
    res.redirect("/work");
  }
  else{
  items.push(item);
  res.redirect("/");
  // console.log(item);
}
});

app.get("/work",function(req,res){
  res.render('index', {
     listTitle: "Work Items", newItems:workItems});

});


app.post("/work",function(req,res){
  let item=req.body.itemList;

})

app.listen(3000, function() {
  console.log("Server 3000 is up and running");
});
