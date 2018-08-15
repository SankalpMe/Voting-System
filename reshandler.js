const fs = require('fs')
const path = require('path')
const candi = ['hboy','hgirl','vhboy','vhgirl']
var mna = function () {
    for(var x= 0;x < candi.length;x++){
        for(var y = 1;y<=4;y++){
            fs.writeFileSync(path.join(process.cwd(),'/result/'+candi[x]+y+'.rm'),'0')
        }
    }
}
var cna = function (data) {

        p = path.join(process.cwd(),'/result/'+candi[0]+data.hboy+'.rm')
        y  = parseInt(fs.readFileSync(p)) +  1
        fs.writeFileSync(p,y+'')

        p = path.join(process.cwd(),'/result/'+candi[1]+data.hgirl+'.rm')
    y  = parseInt(fs.readFileSync(p)) +  1
    fs.writeFileSync(p,y+'')

        p = path.join(process.cwd(),'/result/'+candi[2]+data.vhboy+'.rm')
    y  = parseInt(fs.readFileSync(p)) +  1
    fs.writeFileSync(p,y+'')

        p = path.join(process.cwd(),'/result/'+candi[3]+data.vhgirl+'.rm')
    y  = parseInt(fs.readFileSync(p)) +  1
    fs.writeFileSync(p,y+'')





}
module.exports.saveVote = cna;
module.exports.reset = mna;