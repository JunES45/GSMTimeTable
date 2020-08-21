const MongodbClient=require('mongodb');

const url='mongodb://woskaangel:8P84GBrdcn0c2pvE3J8XtcLnB0Excmp7EsB0pqaHPUd4rSruus7lBWinXYL9xy3kSkwPac8Tsgvat36GmMAZsg==@woskaangel.documents.azure.com:10255/?ssl=true&replicaSet=globaldb';
var db;

MongodbClient.connect(url,{useNewUrlParser:true},function(err,client){ //mongodb 연결
    if(err){ 
        console.log(err);
        return;
    } // err처리
    console.log('DB connected');
    db=client.db('TimeTable'); // db변수에 table을 저장
    db.user=db.collection('users');
    db.table=db.collection('timetable');
    db.session=db.collection('session'); // db변수 세부에 collection들을 저장
});

exports.insertUser=function(options,callback){ // signup함수
    var result=db.user.find({"id":options.sid}); // user콜렉션에 아이디가 입력한 아이디를 찾음
    result.toArray(
        function(err,docs){
            if(err){
                callback(err,null);
            } // 에러처리
            else if(docs.length>0){
                callback(null,docs);
            } // docs가 존재하면 callback으로 docs를 넘겨줌
            else{
                db.user.insertOne({name:options.sname,id:options.sid,pw:options.spw,level:1},function(err,result){
                    if(err) console.log(err.message); // 에러처리
                }); // user콜렉션에 아이디, 비밀번호를 저장함
                callback(null,null);
            } // 정보가 존재 하지 않으면
        }
    );
}
exports.authUser=function(aid,apw,callback){ // login함수
    var result=db.user.find({"id":aid,"pw":apw}); // user콜렉션에 아이디
    result.toArray(
        function(err,docs){
            if(err){
                callback(err,null);
            } // 에러처리
            else if(docs.length>0){
                callback(null,docs[0]);
            } // docs가 존재하면 callback으로 docs값을 넘겨줌
            else{
                callback(null,null);
            } // 정보가 존재하지 않으면 아무것도 안함
        }
    );
}
exports.viewTimeTable=function(gr,cl,callback){ // 시간표 출력함수
    var result=db.table.find({"grade":gr,"class":cl,"original":false}); // 학년 반정보를 원본이 아닌 시간표를 탐색
    result.toArray(
        function(err,docs){
            if(err){
                callback(err,null);
            } // 에러처리
            else if(docs.length>0){
                callback(null,docs[0].table);
            } // docs가 존재하면 callback으로 docs안에 table값을 넘겨줌
            else{
                callback(null,null);
            } // 정보가 존재하지 않으면 아무것도 안함
        }
    )
}
exports.editTimeTable=function(gr,cl,week,time,edit,callback){ // 시간표 수정 함수
    var result=db.table.find({"grade":gr,"class":cl,"original":false}); // 학년 반정보를 원본이 아닌 시간표를 탐색
    var value=(time-1)+((week-1)*11); // 배열의 index를 계산함
    result.toArray(
        function(err,docs){
            if(err){
                callback(err,null);
            } // 에러처리
            else{
                docs[0].table[value]=edit; // docs의 table값을 수정된 값으로 바꿈
                db.table.updateOne({"grade":gr,"class":cl,"original":false},{$set:{table:docs[0].table}},function(err,result){
                    if(err) console.log(err);
                }); // 수정된 table을 업데이트함
                callback(null,null);
            }
        }
    );
}
exports.resetTimeTable=function(){ // 시간표를 초기화하는 함수
    for(var i=1;i<=3;i++){ // 3개의 학년
        for(var j=1;j<4;j++){ // 4개의 반
            var result=db.table.find({"grade":i,"class":j,"original":true}); // 원본 시간표를 탐색함
            result.toArray(
                function(err,docs){
                    db.table.updateOne({"grade":i,"class":j,"original":false},{$set:{table:docs[0].table}}); // 원본 시간표가 아닌 시간표를 원본시간표로 업데이트함
                }
            )
        }
    }
}
exports.viewOriginalTimeTable=function(gr,cl,callback){ // 원본 시간표 출력 함수
    var result=db.table.find({"grade":gr,"class":cl,"original":true}); // 원본 시간표 탐색
    result.toArray(
        function(err,docs){
            if(err){
                callback(err,null);
            } // 에러처리
            else if(docs.length>0){
                callback(null,docs[0].table);
            } // docs가 존재하면 callback으로 docs안에 table값을 넘겨줌 
            else{
                callback(null,null);
            } // 정보가 존재하지 않으면 아무것도 안함
        }
    )
}
exports.editOriginalTimeTable=function(gr,cl,tb,callback){ // 원본 시간표 수정 함수
    var result=db.table.find({"grade":gr,"class":cl,"original":true}); // 원본 시간표 탐색
    result.toArray(
        function(err,docs){
            if(err){
                callback(err,null);
            } // 에러처리
            else{
                db.table.updateOne({"grade":gr,"class":cl,"original":true},{$set:{table:tb}},function(err,result){
                    if(err) console.log(err);
                });
                db.table.updateOne({"grade":gr,"class":cl,"original":false},{$set:{table:tb}},function(err,result){
                    if(err) console.log(err);
                }); // 원본 시간표와 아닌 시간표 모두 수정된 것으로 변경
                callback(null,null);
            }
        }
    );
}