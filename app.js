var express=require('express'); // express모듈을 불러옴
var path=require('path'); // 파일 경로를 설정하는 모듈을 불러옴
var favicon=require('serve-favicon'); // favicon처리를 하는 모듈을 불러옴
var bodyParser=require('body-parser'); // req를 파싱해주는 모듈을 불러옴
var session = require('express-session'); // session을 만들어주는 모듈을 불러옴
var MongoStore = require('connect-mongo')(session); // db에 session을 저장하는 모듈을 불러옴
var cron=require('node-cron'); // 타이머 역할을 하는 모듈을 불러옴

var index=require('./router/index'); // router처리한 js파일을 불러옴

var app=express(); // express객체를 불러와 http메소드 함수를 처리

app.set('views',path.join(__dirname,'views')); // views파일 위치를 지정
app.set('view engine','ejs'); // view엔진을 ejs로 설정

app.use(express.static(path.join(__dirname,'public'))); // 정적파일 위치를 public으로 지정
app.use(bodyParser.json()); // req.body가 json형식일 때 파싱 가능하게 함 
app.use(bodyParser.urlencoded({extended:false})); // 중첩된 객체 표현을 허용하지 않음
app.use(express.static(path.join(__dirname,'public'))); // 정적 파일들의 파일 위치 지정
app.use(favicon(path.join(__dirname,'public/favicon','favicon.ico'))); // favicon의 파일 위치를 지정

app.use(session({ // 세션생성, azure로 서비스하는 mongodb를 받아옴
    secret:'secret',
    resave:false,
    saveUninitialized:true,
    store:new MongoStore({
        url:'mongodb://woskaangel:8P84GBrdcn0c2pvE3J8XtcLnB0Excmp7EsB0pqaHPUd4rSruus7lBWinXYL9xy3kSkwPac8Tsgvat36GmMAZsg==@woskaangel.documents.azure.com:10255/TimeTable?ssl=true',
        ttl: 60*60
    })
}));

app.use('/',index); // '/'이후에 붙는 url이 들어올 때 handler(router)를 index로 지정

cron.schedule('0 0 * * 1',function(){ // 월요일 0시 0분 0초에 실행함
    model.resetTimeTable(); // db.js파일에 있는 함수를 실행함
    console.log('reset tables');
}).start();

app.listen(8080); // 8080포트로 호스팅함