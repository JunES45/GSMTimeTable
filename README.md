# GSMTimeTable

Welcome
=
![Alt text](https://img.shields.io/badge/node-v10.15.3-blue.svg)
![Alt text](https://img.shields.io/badge/npm-v6.4.1-red.svg)
![Alt text](https://img.shields.io/badge/mongo-v4.0.10-blueviolet.svg)  
```
This project is an online timetable web using nodejs and mongodb.
Made during school performance evaluations.
all codes are free to use.
```
install
=
```
npm i express 
npm i body-parser 
npm i ejs 
npm i morgan 
npm i serve-favicon
npm i mongodb
npm i express-session
npm i connect-mongo 
npm i node-cron
```
File structure
=
```
├─models
├─node_modules
├─public
│  ├─css
│  ├─favicon
│  ├─imaze
│  └─js
├─router
├─views
└─app.js
```
File Information
=
```
models : Save database function
node_modules : Save node packages and modules
public : Save static files such as css, favicon, imaze, javascript, etc.
router : Save detached router object
views : Save visual files such as ejs, etc.
app.js : Files that run the server
```
Direction for use
=
***If you don't create the database, errors occurs. So, complete the sequence below***
```
1. Create the database name as TimeTable in mongodb.
2. Create the collection name as users, table in TimeTable.
3. Enter your school schedule in the table collection.
4. Modify the code to suit your conditions.
5. Run app.js. (command : node app.js)
6. Connect "http://localhost:8080" or "http://127.0.0.1:8080"
```
DB Creation Form
=
***table***  
```
original : ' '(bool format)  
grade : ' '(string format)  
class : ' ' (string format)  
Table : (Array)  
    1: " "(string) mon 1period  
    2: " "(string) mon 2period  
    .  
    .  
    .  
```
Edit Codes
=
***app.js***
```javascript
26 lines
store:new MongoStore({
    url:'Insert your db url/TimeTable',
    ttl: 'Insert the retention time you want'
})
```
If you want to keep it for three hours, write 60 * 60 * 3. The unit is in seconds.
```javascript
34 lines
cron.schedule('Insert the time you want to run',function(){
    model.resetTimeTable(); 
    console.log('reset edit tables');
}).start();
```
If you want to initialize Tuesday at 3 p.m., write '0 15 * * 2' like this. 'minutes hours days month day of the week'  
Please refer to here for more details.
**[cron](https://www.npmjs.com/search?q=cron)**
**[MongoStore](https://www.npmjs.com/package/connect-mongo)**  

***index.js***
```javascript
8 lines
var key='Insert any sentence you want';
```
```javascript
268 lines
table[0]=req.body.a0;table[1]=req.body.a1;table[2]=req.body.a2;table[3]=req.body.a3;table[4]=req.body.a4;
.
.
.
```
Insert index of your arrangement. "table[YourMaxIndex]=req.body.aYourMaxIndex"in this form.

***db.js***
```javascript
3 lines
const url='Insert your db url';
```
```javascript
71 lines
var value=(time-1)+((week-1)*X);
```
Insert the number of paces in your timetable in X
```javascript
88 lines
for(var i=1;i<=X;i++){
    for(var j=1;j<Y;j++){
        ...
    }
}
```
insert the number of grades in your school in X, insert the number of classes in your school in Y

***edit.ejs, view.ejs, manager.ejs***
```
This content is too long and large to explain.
So, modify it to match the length of your school timetable, grade, and classes.
```
Please refer to here for more details.
**[ejs1](https://www.npmjs.com/package/ejs)**
**[ejs2](https://ejs.co/)** 
