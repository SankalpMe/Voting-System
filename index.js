const csv = require('csvtojson');
var bodyParser = require('body-parser');
const rh = require('./reshandler');
const path = require('path');
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var con = mysql.createConnection({
    host: "34.210.17.200",
    user: "root",
    password: "root",
    database:"SANKALP"
});

con.connect(function(err) {
    if (err) throw err;

    console.log("Connected!");
});
rh.reset();
function loadCSV(loc,callback) {
    dnd = false;
    table = [];
    csv()
        .fromFile(loc)
        .on('done',(error)=>{
                if(!dnd){
                    callback([]);
                    dnd = true
                }
        })
        .then((jsonObj)=>{

            for(var x =0;x < jsonObj.length;x++){
                child = jsonObj[x];
                nchild = {
                    'name': child['Student Name'],
                    'rno': child['Roll No'][''],
                    'eno': child['Enrollment No']['']
                };
                table.push(nchild)
            }
            if(!dnd){
                callback(table);
                dnd = true}
        })
}
function getPath(c,s) {
    return path.join(process.cwd(),"/data/"+c+s+".csv")
}
/*
loadCSV(function (tb) {
    console.log(tb[0].name)

})
*/
const express = require('express');
app = express();
app.use( bodyParser.json() );
app.use(session({secret: "samkcmp"}));
app.use(cookieParser());// to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.get('/',function (req,res) {
    res.sendFile(path.join(process.cwd(),"/index.html"))
});
app.post('/class',function (req,res) {
    loadCSV(getPath(req.body.class,req.body.section),function (data) {
        if(data.length === 0){
            res.redirect('/')
        }else{
        res.redirect("/vote/6A/1")}
    })
});
app.get('/vote/:class/:r',function (req,res) {
    loadCSV(getPath(req.params.class,''),function (data) {
        if(data.length < parseInt(req.params.r) ){
            res.redirect('/')
        }else {
            req.session.c = req.params.class;
            req.session.r = parseInt(req.params.r) + 1;
            //Sets name = express
            res.sendFile(path.join(process.cwd(), "/confirmVote.html"))
        }
        })
});
app.get('/data/:class/:r',function (req,res) {
    loadCSV(getPath(req.params.class,''),function (data) {
        if(data.length !== 0)
            res.send(data[parseInt(req.params.r) - 1]);
        else
            res.send([])
    })
});
app.post('/poll',function (req,res) {
    res.redirect('/choose/'+req.body.submit)
});
app.post('');
app.get('/choose/:eno',function (req,res) {
    res.sendFile(path.join(process.cwd(),"/poll.html"))
});
app.get('/twg',function (req,res) {
    res.sendFile(path.join(process.cwd(),"/t.jpg"))
});

app.get('/hwg',function (req,res) {
    res.sendFile(path.join(process.cwd(),"/h.jpg"))
});
app.post('/pushVote',function (req,res) {
    console.log(req.body);

    con.query("SELECT * FROM `voters`\n" +
        "WHERE `eno`='"+req.body.rno+"';", function (err, result) {
        if (err) throw err;
        if(result.length === 0){
            con.query("INSERT INTO `voters` (`eno`,`vote`)\n" +
                "VALUES (\""+req.body.rno+"\",\""+req.body.hboy +req.body.hgirl +req.body.vhboy + +req.body.vhgirl+"\");", function (err, result) {
                if (err) throw err;

            });
        }
    });
    res.redirect('/vote/'+req.session.c+'/'+req.session.r)

});
app.get('/result',function (req,res) {
    con.query("SELECT * FROM `voters`", function (err, result) {
        var hboy = [0, 0, 0, 0];
        var hgirl = [0, 0, 0, 0];
        var vhboy = [0, 0, 0, 0];
        var vhgirl = [0, 0, 0, 0];
            for(var x =0;x< result.length;x++){
                cr = result[x].vote;
                for(var y =0;y < cr.length;y++){
                    let ind = parseInt(cr.charAt(y) + "") - 1;

                    switch (y) {
                        case 0:
                            hboy[ind] = hboy[ind] + 1;

                            break;
                        case 1:
                            hgirl[ind] = hgirl[ind] + 1;
                            break;
                        case 2:
                            vhboy[ind] = vhboy[ind] + 1;
                            break;
                        case 3:
                            vhgirl[ind] = vhgirl[ind] + 1;
                            break;
                    }
                }
            }
            res.send({'b':hboy,'g':hgirl,'vb':vhboy,'vg':vhgirl})
    });
});
app.listen(80, '0.0.0.0');