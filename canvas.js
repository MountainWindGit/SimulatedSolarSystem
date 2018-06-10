const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//星系
let galaxy = [
    //太阳
    {
        radius: 30,
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
        radius: 4,
        x: canvas.width/2 - 110,
        y: canvas.height/2,
        gradColor: {
            colorStart: '#9d652a',
            colorEnd: '#623714'
        },
        shadowData: {
            blur: 10,
            color: '#ce9b59'
        },
        speed: 15,
        arr: [],
        long: 110,
        short: 40,
        z: 0
    },
    //金星
    {
        radius: 8,
        x: canvas.width/2 - 180,
        y: canvas.height/2,
        gradColor: {
            colorStart: '#ffd179',
            colorEnd: '#67360d'
        },
        shadowData: {
            blur: 10,
            color: '#d69f42'
        },
        speed: 11,
        arr: [],
        long: 180,
        short: 65,
        z: 0
    },
    //地球
    {
        radius: 8,
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
        speed: 10,
        arr: [],
        long: 250,
        short: 90,
        z: 0
    },
    //火星
    {
        radius: 7,
        x: canvas.width/2 - 315,
        y: canvas.height/2,
        gradColor: {
            colorStart: '#ce6f47',
            colorEnd: '#774a45'
        },
        shadowData: {
            blur: 9,
            color: '#da7942'
        },
        speed: 8,
        arr: [],
        long: 315,
        short: 120,
        z: 0
    },
    //木星
    {
        radius: 20,
        x: canvas.width/2 - 390,
        y: canvas.height/2,
        gradColor: {
            colorStart: '#ad6a35',
            colorEnd: '#7d4223'
        },
        shadowData: {
            blur: 20,
            color: '#d49e4c'
        },
        speed:2,
        arr: [],
        long: 390,
        short: 150,
        z: 0
    },
    //土星
    {
        radius: 14,
        x: canvas.width/2 - 465,
        y: canvas.height/2,
        gradColor: {
            colorStart: '#e3a246',
            colorEnd: '#c79242'
        },
        shadowData: {
            blur: 10,
            color: '#efe560'
        },
        speed: 1,
        arr: [],
        long: 465,
        short: 180,
        z: 0
    },
    //天王星
    {
        radius: 10,
        x: canvas.width/2 - 530,
        y: canvas.height/2,
        gradColor: {
            colorStart: '#83c9eb',
            colorEnd: '#043f9f'
        },
        shadowData: {
            blur: 20,
            color: '#1886dc'
        },
        speed: 0.5,
        arr: [],
        long: 540,
        short: 220,
        z: 0
    },
    //海王星
    {
        radius: 9,
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
        speed: 0.25,
        arr: [],
        long: 640,
        short: 260,
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
        ctx.closePath();
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
        ctx.strokeStyle = '#101010';
        ctx.shadowBlur = 0;
        ctx.shadowColor = '#000';
        ctx.lineWidth = 1;
        ctx.moveTo(0, this.b);
        ctx.bezierCurveTo(ox, this.b, this.a, oy, this.a, 0);
        ctx.bezierCurveTo(this.a, -oy, ox, -this.b, 0, -this.b);
        ctx.bezierCurveTo(-ox, -this.b, -this.a, -oy, -this.a, 0);
        ctx.bezierCurveTo(-this.a, oy, -ox, this.b, 0, this.b);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
}

//公转周期
const revolation = (obj) => {
    for(let i=0; i<360; i+= 0.25){
        let radian = (Math.PI/180)*i,
            x1 = obj.long*(Math.sin(radian)) + canvas.width/2,
            y1 = canvas.height/2 - (Math.cos(radian)*obj.short);
        obj.arr[i*4] = [];
        obj.arr[i*4][0] = x1 - 1;
        obj.arr[i*4][1] = y1 - 1;
    }
}

//行星位置初始
galaxy.map(i => {
    new Star(i).draw();
    new Tack(canvas.width/2,canvas.height/2,i.long,i.short).draw();
    revolation(i);
})

//公转速度
const start = function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    galaxy.map(i => {
        if(i.z >= 1440){
            i.z = 0;
        }
        i.x = i.arr[Math.floor(i.z)][0];
        i.y = i.arr[Math.floor(i.z)][1];
        i.z += i.speed;
        new Tack(canvas.width/2,canvas.height/2,i.long,i.short).draw();
        new Star(i).draw();
    })
    window.requestAnimationFrame(start);
}
start();