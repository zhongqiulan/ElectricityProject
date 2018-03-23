/*创建乐淘对象*/
var letao;
/*初始化*/
$(function () {
    /*创建乐淘对象*/
    letao = new Letao();
    /*调用初始化区域滚动的方法*/
    letao.initScroll();
    /*调用ajax的方法*/
    letao.getCategoryLeft();
})

/*定义一个构造函数*/
var Letao = function () {

}

Letao.prototype = {
    initScroll: function () {
        /*初始化区域滚动，初始化父元素*/
        mui('.mui-scroll-wrapper').scroll({
            scrollY: true, //是否竖向滚动
            scrollX: false, //是否横向滚动
            startX: 0, //初始化时滚动至x
            startY: 0, //初始化时滚动至y
            indicators: false, //是否显示滚动条
            deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
            bounce: true //是否启用回弹
        });
    },
    getCategoryLeft: function () {
        /*1.发送ajax请求一级分类数据*/
        $.ajax({
            type: 'GET',
            url: '/category/queryTopCategory',
            /*回调函数*/
            success: function (data) {
                /*2.调用模板引擎的方法渲染页面*/
                var html = template('categoryLeftTmp', data);
                $('.category-left ul').html(html);
                $('.category-left ul li').eq(0).addClass('active');
                letao.getCategoryRight(1);
                /*3.给左侧分类加点击事件*/
                $('.category-left ul').on('click', function (e) {
                    $('.category-left ul li').removeClass('active');
                    /*4.获取当前点击的li*/
                    var li = $(e.target);
                    li.addClass('active');
                    /*5.获取当前点击li自定义属性的id*/
                    var id = li.data('id');
                    /*通过全局的乐淘对象调用获取右侧的二级分类数据*/ 
                    letao.getCategoryRight(id);
                })
            }

        })
    },
    /*获取左侧分类的数据*/
    getCategoryRight: function (id) {
        /*1.发送ajax请求二级分类数据*/
        /*2.根据左侧点击的分类id调用获取右侧的api*/
        $.ajax({
            type: 'GET',
            url: '/category/querySecondCategory',
            data:{
                id:id
            },
            /*回调函数*/
            success: function (data) {
                /*2.调用模板引擎的方法渲染页面*/
                var html = template('categoryRightTmp', data);
                $('.mui-scroll .mui-row').html(html);
               
            }

        })
    }
}