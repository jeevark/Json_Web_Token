const mysql =require ("mysql");

const sqlconn = mysql.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:'ROCKN',
    database:'jwt'
});

sqlconn.connect((err)=>{
    if(err){
        throw err;
    } 
    console.log("MySql Connection Success.......")
})

module.exports = sqlconn;

