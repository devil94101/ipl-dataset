function read(){
    const res=[];
    fetch('data.json').then(r=>r.json()).then((data)=>{
        extract(data.year);
        wingraph(data.win);
        extraruns(data.data16);
        bestbowler(data.data15);
    });
}
function extraruns(data){
    let ser=[];
    for(let x in data){
        ser.push([x,data[x]]);
    }
    chart(ser,'extra','teams','extra Runs','Extra runs by teams');
}
function bestbowler(data){
    let ser=[];
    for(let x of data){
        ser.push([x.name,x.rate]);
    }
    chart(ser,'bowler','bowler name','economy','Economy of top 10 bowlers');
}
function wingraph(data){
    let ser=[];
    for(let x in data){
        ser.push([x,data[x]]);
    }
    chart(ser,'winner','teams','matches','no of matches each team wins');
}
function extract(data){
    let series=[];
    for(let x in data){
        series.push([x,data[x]]);
    }
    chart(series,'matches-played-per-year',"year",'matches','matches-played-per-year');
}
function chart(series,id,x_label="x_axis",y_label="y_axis",title=""){
    Highcharts.chart(id, {
        chart: {
            type: 'column'
        },
        title: {
            text: title
        },
        subtitle: {
            text:'Source: <a href="https://www.kaggle.com/nowke9/ipldata/data">IPL Dataset</a>'
        },
        xAxis: {
            type: 'category',
            title:{
                text:x_label
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: y_label
            }
        },
        series: [{
            name: 'data',
            data: series
        }]
    });
}
read();