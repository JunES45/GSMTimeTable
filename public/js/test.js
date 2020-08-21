var express=require('express');
var path=require('path');

var app=express();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.get('/signup',function(req,res){
    res.render('signup',{id:true,pw:true,pwo:true});
});
app.get('/login',function(req,res){
    res.render('login',{pass:true});
});

app.listen(8080);