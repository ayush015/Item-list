const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todolist", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const itemSchema = new mongoose.Schema({
  Name: String
});
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  Name: "Welcome to the Todolist"
});
const item2 = new Item({
  Name: "hit + to add a new item"
});
const item3 = new Item({
  Name: "<-- to delete the item "
});

const customSchema=new mongoose.Schema({
  Name:String,
  items:[itemSchema]
});
const CustomList=new mongoose.model("List",customSchema);

const defaultItems = [item1, item2, item3];

const day = date.getDate();


// let items=[];
// let workItems=[];

app.set('view engine', 'ejs');

app.get("/", function(req, res) {


  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err)
        } else {
          console.log("Successfully added to the database");
        }
      });
    } else {
      res.render('index', {

        listTitle: day,
        newItems: foundItems
      });
    }
  });
});

app.post("/", function(req, res) {
  let itemName = req.body.itemList;
    const listName =req.body.list;
     const item=new Item({
      Name: itemName
    });
    if(listName === day)
    {
      itemName.save();
      res.redirect("/");
    }
else{
  CustomList.findOne({Name:listName},function(err,foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/"+listName);
  })
}
});
app.post("/delete", function(req, res) {
  const checkboxItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkboxItemId, function(err) {
    if (!err) {
      console.log("Successfully deleted item from the list")
    }
  });
  res.redirect("/");
});
app.get('/:customListName', function (req, res) {
const customListName=req.params.customListName;

 CustomList.findOne({Name:customListName},function(err,results){
   if(!err){
     if(!results){
       // console.log("Does not Exist");
       // Creat a new List
       const item=new CustomList({
         Name:customListName,
         items:defaultItems
       });
       item.save();
       res.redirect("/"+customListName);
        }
        else{
          // If existing list is found
          // console.log("Exist");
          res.render('index', {

            listTitle: results.Name,
            newItems: results.items
          });
        }
   }
 });
});

// app.get("/work", function(req, res) {
//   res.render('index', {
//     listTitle: "Work Items",
//     newItems: workItems
//   });
//
// });


app.post("/work", function(req, res) {
  let item = req.body.itemList;

})

app.listen(3000, function() {
  console.log("Server 3000 is up and running");
});
