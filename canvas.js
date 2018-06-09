const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//星系
let galaxy = [
    //太阳
    {
        radius: 35,
        x: canvas.width/2,
        y: canvas.height/2,
        gradColor: {
            colorStart: '#ffac0e',
            colorEnd: '#f30'
        },
        shadowData: {
            blur: 20,
            color: '#fd6c15'
        },
        speed: 0,
        arr: [],
        long: 0,
        short: 0,
        z: 0
    },
    //水星
    {
        radius: 5,
        x: canvas.width/2 - 130,
        y: canvas.height/2,
        gradColor: {
            colorStart: '#9d652a',
            colorEnd: '#623714'
        },
        shadowData: {
            blur: 10,
            color: '#ce9b59'
        },
        speed: 7,
        arr: [],
        long: 130,
        short: 40,
        z: 0
    },
    //金星
    {
        radius: 10,
        x: canvas.width/2 - 200,
        y: canvas.height/2,
        gradColor: {
            colorStart: '#ffd179',
            colorEnd: '#67360d'
        },
        shadowData: {
            blur: 10,
            color: '#d69f42'
        },
        speed: 6,
        arr: [],
        long: 200,
        short: 70,
        z: 0
    },
    //地球
    {
        radius: 10,
        x: canvas.width/2 - 250,
        y: canvas.height/2,
        gradColor: {
            colorStart: '#3680aa',
            colorEnd: '#020b2b'
        },
        shadowData: {
            blur: 10,
            color: '#2f78d4'
        },
        speed: 5,
        arr: [],
        long: 250,
        short: 90,
        z: 0
    },
    //火星
    {
        radius: 9,
        x: canvas.width/2 - 300,
        y: canvas.height/2,
        gradColor: {
            colorStart: '#ce6f47',
            colorEnd: '#774a45'
        },
        shadowData: {
            blur: 9,
            color: '#da7942'
        },
        speed: 4,
        arr: [],
        long: 300,
        short: 110,
        z: 0
    },
    //木星
    {
        radius: 25,
        x: canvas.width/2 - 360,
        y: canvas.height/2,
        gradColor: {
            colorStart: '#ad6a35',
            colorEnd: '#7d4223'
        },
        shadowData: {
            blur: 20,
            color: '#d49e4c'
        },
        speed: 1,
        arr: [],
        long: 360,
        short: 130,
        z: 0
    },
    //土星
    {
        radius: 18,
        x: canvas.width/2 - 430,
        y: canvas.height/2,
        gradColor: {
            colorStart: '#e3a246',
            colorEnd: '#c79242'
        },
        shadowData: {
            blur: 10,
            color: '#241c09'
        },
        speed: 3,
        arr: [],
        long: 430,
        short: 150,
        z: 0
    },
    //天王星
    {
        radius: 14,
        x: canvas.width/2 - 500,
        y: canvas.height/2,
        gradColor: {
            colorStart: '#83c9eb',
            colorEnd: '#043f9f'
        },
        shadowData: {
            blur: 20,
            color: '#1886dc'
        },
        speed: 2,
        arr: [],
        long: 500,
        short: 190,
        z: 0
    },
    //海王星
    {
        radius: 12,
        x: canvas.width/2 - 600,
        y: canvas.height/2,
        gradColor: {
            colorStart: '#446ffc',
            colorEnd: '#1d2151'
        },
        shadowData: {
            blur: 5,
            color: '#3d58e7'
        },
        speed: 1,
        arr: [],
        long: 600,
        short: 230,
        z: 0
    }
];

//星球绘制
class Star {
    constructor(props){
        this.props = props;
    }

    draw(){
        //创建径向渐变
        let gradient = ctx.createRadialGradient(this.props.x, this.props.y, this.props.radius/6, this.props.x, this.props.y, this.props.radius);
        gradient.addColorStop(0, this.props.gradColor.colorStart);
        gradient.addColorStop(1, this.props.gradColor.colorEnd);
        //绘制原型
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.shadowBlur = this.props.shadowData.blur;
        ctx.shadowColor = this.props.shadowData.color;
        ctx.arc(this.props.x, this.props.y, this.props.radius, 0, 2*Math.PI);
        ctx.fill();
    }
}

//轨道绘制
class Tack{
    constructor(x, y, a, b){
        this.x = x; //椭圆中心点x
        this.y = y; //椭圆中心点y
        this.a = a; //椭圆长半径
        this.b = b; //椭圆短半径
    }
    draw(){
        let ox = 0.5 * this.a, oy = 0.6 * this.b;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.moveTo(0, this.b);
        ctx.bezierCurveTo(ox, this.b, this.a, oy, this.a, 0);
        ctx.bezierCurveTo(this.a, -oy, ox, -this.b, 0, -this.b);
        ctx.bezierCurveTo(-ox, -this.b, -this.a, -oy, -this.a, 0);
        ctx.bezierCurveTo(-this.a, oy, -ox, this.b, 0, this.b);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
}

//公转周期
const revolation = (obj) => {
    for(let i=0; i<360; i++){
        let radian = (Math.PI/180)*i,
            x1 = obj.long*(Math.sin(radian)) + canvas.width/2,
            y1 = canvas.height/2 - (Math.cos(radian)*obj.short);
        obj.arr[i] = [];
        obj.arr[i][0] = x1 - 2;
        obj.arr[i][1] = y1 - 2;
    }
}


galaxy.map(i => {
    new Star(i).draw();
    new Tack(canvas.width/2,canvas.height/2,i.long,i.short).draw();
    revolation(i);
})

const start = setTimeout(function fn(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    galaxy.map(i => {
        if(i.z >= 360){
            i.z = 0;
        }
        i.x = i.arr[i.z][0];
        i.y = i.arr[i.z][1];
        i.z += i.speed;
        new Tack(canvas.width/2,canvas.height/2,i.long,i.short).draw();
        new Star(i).draw();
    })
    setTimeout(fn,20);
},20)