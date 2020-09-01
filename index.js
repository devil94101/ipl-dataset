const csv=require('csvtojson');
const fs=require('fs');
const { parse } = require('path');
const path="./csv_data/matches.csv";
const path3="./csv_data/deliveries.csv"
const path2='./public/data.json';
csv().fromFile(path).then(ele=>{
    // console.log(ele[0]);
    let year=perYear(ele);
    let win=winner(ele);
    let year15=y15(ele,2015);
    let year16=y15(ele,2016);
    // console.log(year16)
    csv().fromFile(path3).then(data=>{
        let data16=solve16(year16,data);
        let data15=solve15(year15,data);
        let j={
            year,
            win,
            data16,
            data15
        }
        save(j);
    })
    
})
function y15(data,year){
    let res={}
    for(let x of data){
        if(x.season==year){
            res[x.id]=1;
        }
    }
    return res;
}
function solve16(year,data){
    let res={};
    for(let x of data){
        if(year[x['match_id']]==1){
            if(res[x['batting_team']]){
                res[x['batting_team']]+=parseInt(x['extra_runs']);
            }
            else{
                res[x['batting_team']]=parseInt(x['extra_runs']);
            }
        }
    }
    return res;
}
function solve15(year,data){
    let res={}
    for(let x of data){
        if(year[x['match_id']]==1){
            if(res[x['bowler']]){
                res[x['bowler']]['totalruns']+=parseInt(x['total_runs']);
                let xx=res[x['bowler']]['over'];
                if(x['over']!=res[x['bowler']]['curOver']){
                    res[x['bowler']]['over']=parseInt(xx)+1;
                    res[x['bowler']]['curOver']=x['over'];
                }
            }
            else{
                res[x['bowler']]={
                    'totalruns':parseInt(x['total_runs']),
                    'over':1,
                    'curOver':x['over']
                }
            }
        }
    }
    let rrr=[];
    for(x in res){
       rrr.push({name:x,rate:parseFloat(res[x]['totalruns'])/parseFloat(res[x]['over'])});
    }
    rrr.sort((a,b)=>{
        return a.rate-b.rate;
    })
    console.log(rrr.slice(0,10));
    return rrr.slice(0,10);
}
function perYear(data){
    let res={};
    for(let x of data){
        let seasons=x.season;
        if(res[seasons]){
            res[seasons]++;
        }
        else{
            res[seasons]=1;
        }
    }
    return res;
}
function winner(data){
    let res={};
    for(let x of data){
        let win=x.winner;
        if(res[win]){
            res[win]++;
        }
        else{
            res[win]=1;
        }
    }
    return res;
}
function save(j){
    let str=JSON.stringify(j);
    fs.writeFile(path2,str,'utf8',(err)=>{
        if(err)
            console.log(err);
    });

}