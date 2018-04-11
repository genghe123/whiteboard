var canvas = document.getElementsByTagName("canvas")[0];
canvas.width = 1000;
canvas.height = 1000;
var cubes = 3;
var ctx = canvas.getContext("2d");
ctx.fillStyle = "#d9bf9a";

var areaSize = 1000 / cubes;
var cubeSize = areaSize * 0.96;
ctx.translate(areaSize * 0.02, areaSize * 0.02);
var rats = [];
var points;
var hp;
var interval;
var t, t2;

window.onload = function () {
    drawPannel();//游戏中的方格是用canvas画的
    initGame();//初始化游戏
};

function initGame() {
    points = 0;
    hp = 3;
    interval = 100;
    document.getElementsByTagName("h2")[0].innerHTML = "得分:" + points;
    document.getElementsByTagName("h2")[1].innerHTML = "剩余机会:" + hp;
    t = setInterval(function () {
        generateRats();//产生地鼠的方法
        maintanceRats();//维护地鼠的方法
    }, interval);
}

function drawPannel() {//画出方格，每个方格放一个地鼠并且隐藏
    for (var i = 0; i < cubes; i++) {
        for (var j = 0; j < cubes; j++) {
            ctx.fillRect(i * areaSize, j * areaSize, cubeSize, cubeSize);//画一个方格
            var img = new Image();
            img.src = "images/hitmouse/ds.png";
            img.style.left = i * 33.33 + "%";
            img.style.top = j * 0.3333 * canvas.clientHeight + "px";
            img.addEventListener("mousedown", clicked);//两种事件是为了适配不同的移动设备
            img.addEventListener('touchstart', touched);
            document.getElementsByTagName("div")[0].appendChild(img);//每个方格放地鼠
            rats.push(img);//地鼠放入队列中，用于后面维护
        }
    }
}

function touched() {//触摸中了
    chosen(this);
    //var touch = event.touches[0];
    //var rect = canvas.getBoundingClientRect();
    //checkArea(touch.pageX - rect.left,touch.pageY - rect.top);
}

function clicked() {//点击中了
    chosen(this);
    //var rect = canvas.getBoundingClientRect();
    //checkArea(event.clientX - rect.left,event.clientY - rect.top);
}

function chosen(rat) {
    if (rat.className == "active") {//如果地鼠显示出来了
        rat.classList.remove("active");//隐藏
        points++;//加分
        document.getElementsByTagName("h2")[0].innerHTML = "得分:" + points;//更新分数显示
        interval -= interval * 0.03 > 2 ? interval * 0.03 : interval * 0.015;//增加游戏难度
    }
}

function generateRats() {//产生地鼠的方法
    if (parseInt(Math.random() * 100) % parseInt(((interval / 12) > 2 ? (interval / 12) : 2)) == 0) {//产生的几率越来越大
        var ID = Math.ceil(Math.random() * 8);
        if (rats[ID].className == "") {//如果没有出现
            t2 = setTimeout(function () {//出现
                rats[ID].classList.add("active");
                rats[ID].id = interval / 4;//用id表示地鼠自动消失的时间，和游戏难度相关
            }, 500);
        }
    }
}

function maintanceRats() {//维护地鼠的方法
    var activeRats = document.getElementsByClassName("active");//获取所有出现的地鼠
    for (var i = 0; i < activeRats.length; i++) {//用id表示剩余时间
        activeRats[i].id--;
        if (activeRats[i].id < 0) {//如果到时间了
            activeRats[i].classList.remove("active");//当前地鼠隐藏
            hp--;//掉血
            interval *= 1.08;//回退一点游戏难度
            document.getElementsByTagName("h2")[1].innerHTML = "剩余机会:" + hp;//更新血量显示
            if (hp == 0) {
                lose();
            }
        }
    }
}

function lose() {//如果输了
    clearInterval(t);//停止计时器，等待游戏重新开始
    clearTimeout(t2);

    setTimeout(function () {//延时一点
        alert("您输了，共打了" + points + "只地鼠。");
        for (var i = 0; i < rats.length; i++) {
            rats[i].classList.remove("active");//全部地鼠隐藏
        }
        setTimeout(function () {
            initGame();//重新开始游戏
        }, 500);//延时，等待地鼠隐藏的动画效果结束
    }, 10);
}