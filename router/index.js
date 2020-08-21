var express=require('express'); // express모듈을 불러옴
var crypto=require('crypto'); // 비밀번호 암호화 모듈을 불러옴

var router=express.Router(); // express의 router 객체를 불러옴

var model=require('../models/db'); // db처리하는 파일을 불러옴
var gradeNum=new Object(); // ejs파일로 최근에 본 시간표를 저장하는 객체
var key='secretkey';// 비밀번호 암호화 키

router.get('/',function(req,res){
    res.redirect('/view'); // '/'로 들어오는 url을 /view으로 넘겨줌 (/view가 main페이지)
});
router.get('/signup',function(req,res){
    if(req.session.user){ // 이미 로그인 되어있다면 main으로 redirect해줌
        res.redirect('/');
    }
    res.render('signup',{id:true,pw:true,pwo:true,ido:true}); // signup.ejs파일을 render함
});
router.get('/login',function(req,res){
    if(req.session.user){ // 이미 로그인 되어있다면 main으로 redirect해줌
        res.redirect('/');
    }
    res.render('login',{pass:true}); // login.ejs파일을 render함
});
router.get('/logout',function(req,res){
    req.session.destroy(); // 세션을 삭제함
    res.redirect('/'); // main으로 redirect해줌
});
router.get('/view',function(req,res){
    if(!req.session.gr||!req.session.cl){
        gradeNum.gr="1";
        gradeNum.cl="1";
    } // 세션이 존재하지 않는다면 최근에 본 시간표를 1학년 1반으로 설정함
    else{
        gradeNum.gr=req.session.gr;
        gradeNum.cl=req.session.cl;
    } // 세션이 존재한다면 최근에 본 시간표를 세션에 저장된 값으로 설정함
    if(!req.session.name){
        gradeNum.name="로그인을 해주세요.";
    }
    else{
        gradeNum.name=req.session.name;
    }
    model.viewTimeTable(gradeNum.gr,gradeNum.cl,function(err,docs){ // db.js파일에 있는 함수를 실행함
        if(err){ 
            res.redirect('/404'); // db파일을 서버에서 찾을 수 없으므로 404에러를 렌더해줌
        } // err를 콜백 받았다면 err처리함
        else if(docs){
            if(req.session.user) res.render('view',{table:docs,gradeNum,log:true});
            else res.render('view',{table:docs,gradeNum,log:false});
        } // docs파일을 db에서 받았다면 table변수에 docs를 저장하여 뿌림 
        else{
            if(req.session.user) res.render('view',{table:null,gradeNum,log:true});
            else res.render('view',{table:null,gradeNum,log:false});
        } // db파일이 없다면 table을 출력하지 않음
    });
});
router.get('/edit',function(req,res){
    if(req.session.user<2||req.session.user===undefined){
        res.render('edit',{table:null,acess:false,gradeNum});
    } // 계정이 선생님 및 관리자 레벨이 아닐경우 alert를 띄우는 변수를 true로 함
    else{
        if(!req.session.gr||!req.session.cl){
            gradeNum.gr="1";
            gradeNum.cl="1";
        } // 세션이 존재하지 않는다면 최근에 본 시간표를 1학년 1반으로 설정함
        else{
            gradeNum.gr=req.session.gr;
            gradeNum.cl=req.session.cl;
        } // 세션이 존재한다면 최근에 본 시간표를 세션에 저장된 값으로 설정함
        if(!req.session.name){
            gradeNum.name="로그인을 해주세요.";
        }
        else{
            gradeNum.name=req.session.name;
        }
        model.viewTimeTable(gradeNum.gr,gradeNum.cl,function(err,docs){ // db.js파일에 있는 함수를 실행함
            if(err){
                res.redirect('/404'); // db파일을 서버에서 찾을 수 없으므로 404에러를 렌더해줌
            } // err를 콜백 받았다면 err처리함
            else if(docs){
                res.render('edit',{table:docs,acess:true,gradeNum});
            } // docs파일을 db에서 받았다면 table변수에 docs를 저장하여 뿌림 
            else{
                res.render('edit',{table:null,acess:true,gradeNum}); 
            } // db파일이 없다면 table을 출력하지 않음
        });
    }
});
router.get('/manager',function(req,res){
    if(req.session.user<3||req.session.user===undefined){
        res.render('manager',{table:null,acess:false,gradeNum});
    } // 계정이 관리자 레벨이 아닐경우 alert를 띄우는 변수를 true로 함
    else{
        if(!req.session.gr||!req.session.cl){
            gradeNum.gr="1";
            gradeNum.cl="1";
        } // 세션이 존재하지 않는다면 최근에 본 시간표를 1학년 1반으로 설정함
        else{
            gradeNum.gr=req.session.gr;
            gradeNum.cl=req.session.cl;
        } // 세션이 존재한다면 최근에 본 시간표를 세션에 저장된 값으로 설정함
        if(!req.session.name){
            gradeNum.name="로그인을 해주세요.";
        }
        else{
            gradeNum.name=req.session.name;
        }
        model.viewOriginalTimeTable(gradeNum.gr,gradeNum.cl,function(err,docs){ // db.js파일에 있는 함수를 실행함
            if(err){
                res.redirect('/404'); // db파일을 서버에서 찾을 수 없으므로 404에러를 렌더해줌
            } // err를 콜백 받았다면 err처리함
            else if(docs){
                res.render('manager',{table:docs,acess:true,gradeNum});
            } // docs파일을 db에서 받았다면 table변수에 docs를 저장하여 뿌림 
            else{
                res.render('manager',{table:null,acess:true,gradeNum});
            } // db파일이 없다면 table을 출력하지 않음
        });
    }
});

router.post('/signup',function(req,res){
    if(req.body.spwo!=req.body.spw){
        res.render('signup',{id:true,pwo:true,pw:false,ido:true});
    } // 비밀번호와 비밀번호 확인이 일치하지않은 경우 비밀번호가 다르다는 alert를 띄우는 변수를 true로함
    else if(req.body.sid.length<4||req.body.sid.length>16){
        res.render('signup',{pw:true,pwo:true,id:false,ido:true});
    } // 아이디가 4~16자가 아닌 경우 아이디가 짧다는 alert를 띄우는 변수를 true로함
    else if(req.body.spw.length<4||req.body.spw.length>16){
        res.render('signup',{pw:true,id:true,pwo:false,ido:true});
    } // 비밀번호가 4~16자가 아닌 경우 비밀번호가 짧다는 alert를 띄우는 변수를 true로함
    else{
        var cipher=crypto.createCipher('aes192',key); // 암호화 알고리즘을 변수에 담음
        cipher.update(req.body.spw,'utf8','base64'); // 받은 비밀번호를 base64형태로 암호화함
        req.body.spw=cipher.final('base64'); // 암호화를 마친 값을 변수로 다시 넘김
        model.insertUser(req.body,function(err,overap){ // db.js파일에 있는 함수를 실행함
            if(err){
                res.redirect('/404'); // db파일을 서버에서 찾을 수 없으므로 404에러를 렌더해줌
            } // err를 콜백 받았다면 err처리함
            else if(overap){
                res.render('signup',{ido:false,pw:true,id:true,pwo:true})
            } // docs파일을 db에서 받았다면 table변수에 docs를 저장하여 뿌림 
            else{
                res.render('login',{pass:true});
            } // db파일이 없다면 table을 출력하지 않음
        });
    }
});
router.post('/login',function(req,res){
    var id=req.body.id; // ejs에서 받은 아이디정보를 변수에 저장함
    var pw=req.body.pw; // ejs에서 받은 비밀번호정보를 변수에 저장함
    // 중간에 가로채기를 방지하기 위해 비밀번호를 암호화하여 비교함
    var cipher=crypto.createCipher('aes192',key); // 암호화 알고리즘을 변수에 담음
    cipher.update(pw,'utf8','base64');  // 비밀번호를 base64형태로 암호화함
    pw=cipher.final('base64'); // 암호화를 마친 값을 변수로 다시 넘김
    model.authUser(id,pw,function(err,docs){ // db.js파일에 있는 함수를 실행함
        if(err){
            res.redirect('/404'); // db파일을 서버에서 찾을 수 없으므로 404에러를 렌더해줌
        } // err를 콜백 받았다면 err처리함
        else if(docs){
            if(req.session.user===undefined){
                req.session.user=JSON.parse(JSON.stringify(docs.level));
                req.session.name=JSON.parse(JSON.stringify(docs.name));
            } // 세션에 회원 정보가 없다면 회원 정보를 세션에 담음
            res.redirect('/');
        } // docs파일을 db에서 받았다면 table변수에 docs를 저장하여 뿌림
        else{
            res.render('login',{pass:false});
        } // db파일이 없다면 table을 출력하지 않음
    });
});
router.post('/view',function(req,res){
    if(!req.session.name){
        gradeNum.name="로그인을 해주세요.";
    }
    else{
        gradeNum.name=req.session.name;
    }
    var gr=req.body.grade;
    var cl=req.body.class;
    model.viewTimeTable(gr,cl,function(err,docs){ // db.js파일에 있는 함수를 실행함
        if(err){
            res.redirect('/404'); // db파일을 서버에서 찾을 수 없으므로 404에러를 렌더해줌
        } // err를 콜백 받았다면 err처리함
        else if(docs){
            gradeNum.gr=gr; 
            gradeNum.cl=cl; // post로 받은 학년, 반 정보를 넘겨줌
            if(req.session.user) res.render('view',{table:docs,gradeNum,log:true});
            else res.render('view',{table:docs,gradeNum,log:false});
        } // docs파일을 db에서 받았다면 table변수에 docs를 저장하여 뿌림
        else{
            if(req.session.user) res.render('view',{table:null,gradeNum,log:true});
            else res.render('view',{table:null,gradeNum,log:false});
        } // db파일이 없다면 table을 출력하지 않음
    });
    req.session.gr=JSON.parse(JSON.stringify(gr));
    req.session.cl=JSON.parse(JSON.stringify(cl)); // session에 학년, 반 정보를 저장함
});
router.post('/edit',function(req,res){
    if(!req.session.name.length){
        gradeNum.name="로그인을 해주세요.";
    }
    else{
        gradeNum.name=req.session.name;
    }
    var gr=req.body.grade;
    var cl=req.body.class;
    model.viewTimeTable(gr,cl,function(err,docs){ // db.js파일에 있는 함수를 실행함
        if(err){
            res.redirect('/404'); // db파일을 서버에서 찾을 수 없으므로 404에러를 렌더해줌
        } // err를 콜백 받았다면 err처리함
        else if(docs){
            gradeNum.gr=gr;
            gradeNum.cl=cl; // post로 받은 학년, 반 정보를 넘겨줌
            res.render('edit',{table:docs,acess:true,gradeNum});
        } // docs파일을 db에서 받았다면 table변수에 docs를 저장하여 뿌림
        else{
            res.render('edit',{table:null,acess:true,gradeNum});
        } // db파일이 없다면 table을 출력하지 않음
    });
    req.session.gr=JSON.parse(JSON.stringify(gr));
    req.session.cl=JSON.parse(JSON.stringify(cl)); // session에 학년, 반 정보를 저장함
});
router.post('/edit2',function(req,res){
    var gr=req.session.gr;
    var cl=req.session.cl;
    var week=req.body.week; // 요일
    var time=req.body.time; // 교시
    var edit=req.body.edit; // 수정할 과목명
    model.editTimeTable(gr,cl,week,time,edit,function(err,docs){ // db.js파일에 있는 함수를 실행함
        if(err){
            res.redirect('/404'); // db파일을 서버에서 찾을 수 없으므로 404에러를 렌더해줌
        } // err를 콜백 받았다면 err처리함
        res.redirect('/edit'); // 아니면 db에서 처리를 하고 edit으로 redirect해줌
    });
});
router.post('/manager',function(req,res){
    if(!req.session.name){
        gradeNum.name="로그인을 해주세요";
    }
    else{
        gradeNum.name=req.session.name;
    }
    var gr=req.body.grade;
    var cl=req.body.class;
    model.viewOriginalTimeTable(gr,cl,function(err,docs){ // db.js파일에 있는 함수를 실행함
        if(err){
            res.redirect('/404'); // db파일을 서버에서 찾을 수 없으므로 404에러를 렌더해줌
        } // err를 콜백 받았다면 err처리함
        else if(docs){
            gradeNum.gr=gr;
            gradeNum.cl=cl;
            res.render('manager',{table:docs,acess:true,gradeNum});
        } // docs파일을 db에서 받았다면 table변수에 docs를 저장하여 뿌림
        else{
            res.render('manager',{table:null,acess:true,gradeNum});
        } // db파일이 없다면 table을 출력하지 않음
    });
    req.session.gr=JSON.parse(JSON.stringify(gr));
    req.session.cl=JSON.parse(JSON.stringify(cl)); // session에 학년, 반 정보를 저장함
});
router.post('/manager2',function(req,res){
    var gr=req.session.gr;
    var cl=req.session.cl;
    var table=new Array(); // 바뀐 table정보를 저장할 임시 배열
    // 순서에 맞게 req.body 내용을 배열에 저장함
    table[0]=req.body.a0;table[1]=req.body.a1;table[2]=req.body.a2;table[3]=req.body.a3;table[4]=req.body.a4;table[5]=req.body.a5;table[6]=req.body.a6;table[7]=req.body.a7;table[8]=req.body.a8;table[9]=req.body.a9;
    table[10]=req.body.a10;table[11]=req.body.a11;table[12]=req.body.a12;table[13]=req.body.a13;table[14]=req.body.a14;table[15]=req.body.a15;table[16]=req.body.a16;table[17]=req.body.a17;table[18]=req.body.a18;table[19]=req.body.a19;
    table[20]=req.body.a20;table[21]=req.body.a21;table[22]=req.body.a22;table[23]=req.body.a23;table[24]=req.body.a24;table[25]=req.body.a25;table[26]=req.body.a26;table[27]=req.body.a27;table[28]=req.body.a28;table[29]=req.body.a29;
    table[30]=req.body.a30;table[31]=req.body.a31;table[32]=req.body.a32;table[33]=req.body.a33;table[34]=req.body.a34;table[35]=req.body.a35;table[36]=req.body.a36;table[37]=req.body.a37;table[38]=req.body.a38;table[39]=req.body.a39;
    table[40]=req.body.a40;table[41]=req.body.a41;table[42]=req.body.a42;table[43]=req.body.a43;table[44]=req.body.a44;table[45]=req.body.a45;table[46]=req.body.a46;table[47]=req.body.a47;table[48]=req.body.a48;table[49]=req.body.a49;
    model.editOriginalTimeTable(gr,cl,table,function(err,docs){ // db.js파일에 있는 함수를 실행함
        if(err){
            res.redirect('/404'); // db파일을 서버에서 찾을 수 없으므로 404에러를 렌더해줌
        } // err를 콜백 받았다면 err처리함
        res.redirect('/manager'); // 아니면 db에서 처리를 하고 manager으로 redirect해줌
    });
});
router.all('*',function(req,res){ // '/','/login','/signup'...등 get방식으로 선언되지 않은 url이 들어오면 404에러를 렌더함 
    res.render('404');
});

module.exports=router;