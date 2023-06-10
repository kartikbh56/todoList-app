//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/todoListDB');

const ItemSchema=mongoose.Schema({
  item:String
});

app.get("/",(req,res)=>{
  res.send("home")
})

let listName=""
app.get("/:param",(req,res)=>{
  listName=req.params.param;
  const userList=mongoose.model(listName,ItemSchema)
  userList.find().then(foundItems=>{
    res.render("list", {listTitle: listName, newListItems: foundItems});})

  app.post("/"+listName,(req,res)=>{
    const item=req.body.newItem
    userList.insertMany({item:item});
    res.redirect("/"+listName)
  })

  app.post("/delete",function(req,res){
    const checkedBodyItem=req.body.checkbox
    const deletion=mongoose.model(listName,ItemSchema)
    deletion.findByIdAndRemove(checkedBodyItem)
      .catch(error => console.log(error))
      res.redirect("/"+listName)
  });

 
})




app.listen(3000, function() {
  console.log("Server started on port 3000");
});

