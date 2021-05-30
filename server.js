const express=require('express');
const nunjucks=require('nunjucks');
const cookieParser = require('cookie-parser');
const bodyParser=require('body-parser');
const app = express();
const ctoken = require('./jwt');
const auth = require('./middleware/auth');
const mysql = require('mysql')
const session = require('express-session')
const crypto = require('./crypto')

app.use(session({
    secret:'aaa',
    resave:true,
    secure:false,
    saveUninitialized:false,
}))

app.set('view engine', 'html');
nunjucks.configure('views',{
    express:app,
})

let connection = mysql.createConnection({
    host:'localhost',
    user:'user',
    password:'wnsqls2',
    database:'sha256'
})

connection.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false,}));
app.use(cookieParser());
app.use(express.static('public'));

app.get('/',(req,res)=>{
    let {msg} = req.query;
    res.render('index.html');
})

app.get('/user/info',auth,(req,res)=>{
    let userid = req.userid;
    res.send(`hello ${req.userid}`)
})


app.post('/auth/local/login', (req, res) => {
    let { userid, userpw } = req.body;
    let result = {
        result: false,
        msg: '아이디와 비밀번호를 확인해주세요.'
    };
    
    let sql = `select * from user where userid='${userid}'`;
    connection.query(sql, (error, results) => {
        if (error || results=='') {
            console.log(error);
        } else {
            let DB_userid = results[0].userid; 
            let DB_userpw = results[0].userpw; 
            let cryptoUserpw = cryptopw(userpw); 
            if (userid == DB_userid && cryptoUserpw == DB_userpw) {
                let token = ctoken(userid);
                res.cookie('Accesstoken', token, { httpOnly: true, secure: true, });
                result = {
                    result: true,
                    msg: '로그인 성공'
                }
            }
        }
        req.session.userid = userid;
        res.json(result)
    })
})

app.get('/login',(req,res)=>{
    let {id,pw} = req.query;    

app.get('/user/join',(req,res)=>{
    res.render('join.html')
})
})           
                     

app.post('/user/join_success',(req,res)=>{
    let {userid,userpw,username} =req.body;
    let sql=`insert into user (userid,userpw,username) values ('${userid}', '${userpw}','${username}')`;
    connection.query(sql,(error,results)=>{
        if(error){
            console.log(error)
        }else{
            console.log(results);
        }
    })
    res.redirect('/');
})



app.listen(3000,()=>{
    console.log('server start port 3000')
})