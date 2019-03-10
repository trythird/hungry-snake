//Tools
;(function (window,undefined) {
    var Tools = {
        getRandom: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }
    //暴露Tools
    window.Tools = Tools
})(window,undefined);
//---------------------------------------Parent---------------------------------------------------
;(function (window) {
    function Parent(options) {
        options = options || { };
        this.width = options.width || 20;
        this.height = options.height || 20;
    }
    Parent.prototype.test = function () {
        console.log("test");
    }
    window.Parent = Parent;
})(window,undefined)
//------------------------------------------foods-----------------------------------------------------------
;(function (window,undefined) {
    var position = "absolute";
//数组存储食物元素
    var elements = [];
    function Food(options) {
        options = options || { };
        this.x = options.x || 0;
        this.y = options.y || 0;

       /* this.width = options.width || 20;
        this.height = options.height || 20;*/
       //借用构造函数
        Parent.call(this,options);

        this.color = options.color || 'green';
    }
    //原型继承
    Food.prototype = new Parent();
    Food.prototype.constructor = Food;
//渲染
    Food.prototype.render= function(){
        //删除之前创建的食物
        remove();
        //随机设置x和y的值
        //生成食物位置不能与蛇位置重复，做判断

        this.x = Tools.getRandom(0,map.offsetWidth/this.width - 1)* this.width;
        this.y = Tools.getRandom(0,map.offsetHeight/this.height - 1)* this.height;
        /*for(var i= snake.body.length-1;i>=0;i--){
            do {
                this.x = Tools.getRandom(0,map.offsetWidth/this.width - 1)* this.width;
                this.y = Tools.getRandom(0,map.offsetHeight/this.height - 1)* this.height;
            }
            while((this.x == snake.body[i].x || this.y == snake.body[i].y));
        }*/
        //动态生成div，在页面上显示的食物
        var div = document.createElement('div');
        map.appendChild(div);
        elements.push(div);
        //设置div的样式
        div.style.position = position;
        div.style.top = this.y + "px";
        div.style.left = this.x + "px";
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        div.style.backgroundColor = this.color;
    }

    function remove() {
        for(var i=elements.length-1;i>=0;i--){
            //删除div
            elements[i].parentNode.removeChild(elements[i]);
            //删除数组中的元素
            elements.splice(i,1);
        }
    }
//使Food构造函数，让外部可以使用
    window.Food = Food;
})(window,undefined);
/*
//测试代码
var map = document.getElementById("map");
var food = new Food();
food.render(map);*/
//------------------------------------------------snake--------------------------------------------
;(function (window,undefined) {
    var position = "absolute";
    var elements = [];
    function Snake(options) {
        options = options || { };
        //蛇节大小
        /*this.width = options.width || 20;
        this.height = options.height || 20;*/
        //借用构造函数
        Parent.call(this,options);

        //蛇移动的方向
        this.direction = options.direction || 'right';
        //蛇的身体（蛇节） 第一个元素是蛇头
        this.body = [
            {x:3,y:2,color:'red'},
            {x:2,y:2,color:'blue'},
            {x:1,y:2,color:'blue'}
        ];
    }
    Snake.prototype = new Parent();
    Snake.prototype.constructor = Snake;
    Snake.prototype.render = function ( map ) {
        //删除之前的蛇
        remove();
        //把每一个蛇节渲染到地图上
        for(var i=0,len=this.body.length;i<len;i++){
//蛇节
            var object = this.body[i];
            var div =document.createElement('div')
            map.appendChild(div);
            elements.push(div);
            //设置样式
            div.style.position = position;
            div.style.width = this.width + 'px';
            div.style.height = this.height + 'px';
            div.style.left =  object.x * this.width + 'px';
            div.style.top =  object.y * this.height + 'px';
            div.style.backgroundColor = object.color;
        }
    }
    Snake.prototype.move = function ( food ) {
        //控制蛇的身体移动(当前蛇节到上一个蛇节的位置)
        for(var i = this.body.length-1;i>0;i--){
            this.body[i].x = this.body[i-1].x;
            this.body[i].y = this.body[i-1].y;
        }
        //控制蛇头的移动
        var head = this.body[0];
        switch (this.direction){
            case "right":
                head.x += 1;
                break;
            case "left":
                head.x -= 1;
                break
            case "up":
                head.y -= 1;
                break;
            case "down":
                head.y += 1;
                break;
        }
        //判断蛇头位置是否和食物位置一致
        var headX = head.x * this.width;
        var headY = head.y * this.height;
        if(headY == food.y && headX == food.x){
            //让蛇增加一节
            //获取蛇的最后一节
            var last = this.body[this.body.length-1];
            this.body.push({
                x:last.x,
                y:last.y,
                color:last.color
            })
            //随机在地图上生成食物
            food.render();
        }

    }
    ;function remove() {
        for(var i=elements.length - 1;i>=0;i--){
            //删除div
            elements[i].parentNode.removeChild(elements[i]);
            //删除数组中的元素
            elements.splice(i,1);
        }
    }
    //暴露构造函数到全局
    window.Snake = Snake;
})(window,undefined);
/*
//测试代码
var map =  document.getElementById('map');
var snake = new Snake();
snake.render(map);*/
//------------------------------------------------game-------------------------------------------------------------
;(function (window,undefined) {
    var that;//记录游戏对象
    function Game(map) {
        that = this;
        this.food = new Food();
        this.snake = new Snake();
        this.map = map;
    }
    Game.prototype.start = function () {
        //1.把蛇和食物对象，渲染到地图上
        this.food.render(this.map);
        this.snake.render(this.map);
        /*//测试move方法
        this.snake.move();
        this.snake.render(this.map);
        this.snake.move();
        this.snake.render(this.map);
        this.snake.move();
        this.snake.render(this.map);*/
        //2.开始游戏逻辑
        //2.1让蛇移动起来
        runSnake();
        //2.2当蛇遇到边界，游戏结束
        //2.3通过键盘控制蛇移动的方向
        bindKey();
        //2.4当蛇遇到食物做相应的处理
        //
    }
    //私有函数
    function bindKey() {
        //document.onkeydown = function () {};
        document.addEventListener('keydown',function (e) {
            /*console.log(e.keyCode) //测试上下左右的对应的keyCode*/
            // W: 87 PgUp:38 上
            // S: 83 PgDn:40 下
            // A :65 Home:37 左
            // D :68 End :39 右
            switch (e.keyCode){
                case 38 :
                    if(that.snake.direction !='down') {
                        that.snake.direction = 'up';
                    }
                    break;
                case  87:
                    if(that.snake.direction !='down') {
                        that.snake.direction = 'up';
                    }
                    break;
                case 40 :
                    if(that.snake.direction !='up') {
                        that.snake.direction = 'down';
                    }
                    break;
                case 83:
                    if(that.snake.direction !='up') {
                        that.snake.direction = 'down';
                    }
                    break;
                case 37:
                    if(that.snake.direction !='right') {
                        that.snake.direction = 'left';
                    }
                    break;
                case 65:
                    if(that.snake.direction !='right') {
                        that.snake.direction = 'left';
                    }
                    break;
                case 39:
                    if(that.snake.direction !='left') {
                        that.snake.direction = 'right';
                    }
                    break;
                case 68:
                    if(that.snake.direction !='left') {
                        that.snake.direction = 'right';
                    }
                    break;
            }

        },false)
    }
    function runSnake() {
        var timerId = setInterval(function () {
            //让蛇走一格
            //在定时器的function中this是指向window对象的（需要处理）
            that.snake.move(that.food);
            that.snake.render(that.map);
//当蛇遇到边界，游戏结束
            var maxX = that.map.offsetWidth / that.snake.width -1;
            var maxY = that.map.offsetHeight / that.snake.height -1;
            var headX = that.snake.body[0].x;
            var headY = that.snake.body[0].y;
            if(headX<0 ||  headX>maxX || headY<0 || headY>maxY){
                clearInterval(timerId);
                alert("Gome Over 请刷新重来");
            }
        },150);
    }

    window.Game = Game;
})(window,undefined)
//---------------------------------------------调用---------------------------------------
;(function (window,undefined) {
    var map = document.getElementById("map");
    var game = new Game(map);
    game.start();
})(window,undefined)