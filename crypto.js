const crypto = require('crypto');

function createpw(userpw){
    const cryptopw = crypto.createHmac('sha256',Buffer.from(userpw).toString())
                            .digest('base64')
                            .replace('==','').replace('=','');                            

    return cryptopw
}  

module.exports=createpw;