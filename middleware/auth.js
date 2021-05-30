require('dotenv').config();
const crypto = require('crypto');
const ctoken = require('../jwt');


module.exports = (req,res,next) => {
    let {Accesstoken} = req.cookies
    if(Accesstoken == undefined){
        res.redirect('/?msg=로그인을 해주세요')
        return 0;
    }


let [header,payload,sign] = Accesstoken.split('.');
let signature = getSignature(header,payload);
console.log(signature)

if(sign == signature){
    console.log('검증된 토큰입니다.')
    let {userid,exp} = JSON.parse(Buffer.from(payload,'base64').toString())
    console.log(userid)
    console.log(exp) 
    let nexp = new Date().getTime();
    if(nexp > exp){
        res.clearCookie('Accesstoken');
        res.redirect('/?msg=토큰만료')
    }

    req.userid = userid;
    next();
} else {
    res.redirect('/?msg=부적합토큰만료')
}
}

function getSignature(header,payload){
    const signature = crypto.createHmac('sha256',Buffer.from(process.env.salt))
                            .update(header+'.'+payload)
                            .digest('base64')        
                            .replace('=','')
                            .replace('==','')

    return signature;
}
