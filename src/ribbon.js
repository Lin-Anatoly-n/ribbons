const canvas = document.getElementById('mycanvas')
const ctx = canvas.getContext('2d')
//消除锯齿
var width =canvas.width
var height =canvas.height
canvas.style.width=width+'px'
canvas.style.height=height+'px'
canvas.height=height*2
canvas.width=width*2
ctx.scale(2,2)


//创建初始三角形位置
function CreatTriangle(fx, fy, sx, sy, tx, ty) {
    const cos = {}
        cos.p1X = fx,
        cos.p1Y = fy,
        cos.p2X = sx,
        cos.p2Y = sy,
        cos.p3X = tx,
        cos.p3Y = ty,
        cos.resultNum=0
    return cos
}

//创建第一个三角形的路径 
//取值示例：cosCol='123,412,231' 
//fps 淡入淡出帧数 几毫秒执行一次 = 1000/fps ！！fps不能为0 当fps=1时，不使用drawSeries中的settimeout即可获得静态丝带
//ops 透明度峰值  建议在 0.1 -- 0.01 之间取值

function drawOne(traingle,cosCol,fps,life,opc) {
    //使用Path2D储存每个三角形的路径 让各个三角形透明度的变化出现时间差
    const objC = new Path2D()
    objC.moveTo(traingle.p1X, traingle.p1Y)
    objC.lineTo(traingle.p2X, traingle.p2Y)
    objC.lineTo(traingle.p3X, traingle.p3Y)
    //赋予淡入效果
    for (let i = 1; i < fps+1; i++) {
        setTimeout(() => {
            // ctx.fillStyle =my_gradient;
            ctx.fillStyle = `rgba(${cosCol},${opc/fps*i})`;
            ctx.fill(objC);
            ctx.strokeStyle = 'rgba(255,255,255,1)';
            ctx.stroke(objC)
        }, i * 1000/fps);
    }
    //赋予淡出效果
    setTimeout(() => {
        for (let i = 1; i < fps+1; i++) {
            setTimeout(() => {
                ctx.fillStyle = `rgba(255,255,255,${1/fps*(fps-i)})`;
                ctx.fill(objC);
                ctx.strokeStyle = `rgba(255,255,255,1)`;
                ctx.stroke(objC)
                // console.log(i)
            }, (fps - i) * 1000/fps);
        }
    }, life);
}
// 函数返回介于 min 和 max（都包括）之间的随机数：
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
//通过控制第三个角的角度值来控制三角形
function degContr(traingle){
    const po={}
        po.x=traingle.p1X,
        po.y=traingle.p1Y
    const pt={}
        pt.x=traingle.p2X,
        pt.y=traingle.p2Y 
    const ptr={}
    if(getRndInteger(1,12)>9){
      ptr.x=(traingle.p2X+traingle.p1X)/2+getRndInteger(1,150),
      ptr.y=(traingle.p2Y+traingle.p1Y)/2+getRndInteger(10,100)  
    }else if(getRndInteger(1,12)>6){
      ptr.x=(traingle.p2X+traingle.p1X)/2+getRndInteger(1,150),
      ptr.y=(traingle.p2Y+traingle.p1Y)/2-getRndInteger(10,100)  
    }else if(getRndInteger(1,12)>3){
      ptr.x=(traingle.p2X+traingle.p1X)/2+getRndInteger(1,150),
      ptr.y=(traingle.p2Y+traingle.p1Y)/2-getRndInteger(10,100)  
    }else{
      ptr.x=(traingle.p2X+traingle.p1X)/2+getRndInteger(1,150),
      ptr.y=(traingle.p2Y+traingle.p1Y)/2+getRndInteger(10,100)  
    }
    let thirdLine=jisuanchangdu(po,pt)
    let firstLine=jisuanchangdu(pt,ptr)
    let secondLine=jisuanchangdu(po,ptr)
    let result=calCos(cosX(thirdLine,firstLine,secondLine))
    if(30<result<100&&traingle.resultNum<120){
      traingle.resultNum=0
      traingle.p3X=ptr.x
      traingle.p3Y=ptr.y
    }else if(traingle.resultNum===120){
      traingle.resultNum=0
      traingle.p3X=ptr.x
      traingle.p3Y=ptr.y
    }else{      
        traingle.resultNum++
    }
}
//计算边的长度
function jisuanchangdu(a,b){
    let distant=Math.sqrt(Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2))
    return distant
}
//计算cos值
function cosX(a,b,c){
    let cosA=(Math.pow(c,2)+Math.pow(b,2)-Math.pow(a,2))/(2*b*c)
    return cosA
}
//将cos值转化为角度
function calCos(cosNum) {
    let radiansA=Math.acos(cosNum)
    let cosDegrees=radiansA*180/Math.PI
    return cosDegrees
}
//将前一个三角形的点坐标赋予后面一个三角形
function changePoints(traingle){
    //新的三角形路径的第1个点等于上一个三角形的第2个点，新的三角形路径的第2个点等于上一个三角形的第3个点
    traingle.p1X = traingle.p2X
    traingle.p1Y = traingle.p2Y
    traingle.p2X = traingle.p3X
    traingle.p2Y = traingle.p3Y    
    //通过控制新三角形第3个点的位置控制丝带走向
    degContr(traingle)
}
//创建一条三角形“丝带”
function drawSeries(traingle) {
    drawOne(traingle,'123,412,231',24,3000,0.04)
    // drawOne(a,'123,412,231',1,3000,1)
    changePoints(traingle)
    // drawSeries(a))

    setTimeout(() => {        
        if(traingle.p2X < ctx.canvas.width+100 && traingle.p2X > 0){
            drawSeries(traingle)
        }else{
            //第一条消失后第二条开始渲染
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            drawSeries(CreatTriangle(getRndInteger(0, 50), getRndInteger(400, 500), 198+getRndInteger(0, 50), 341-getRndInteger(0, 50), 343+getRndInteger(0, 50), 334+getRndInteger(0, 50)))
        }
    }, 100);
}
drawSeries(CreatTriangle(getRndInteger(0, 50), getRndInteger(400, 500), 198, 341, 343, 334))


    
