/*初始化*/
$(function () {
    var letao = new Letao();
    /*调用初始化区域滚动的方法*/
    letao.initScroll();
    /*调用初始化轮播图滚动的方法*/ 
    letao.initSlide();
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
    initSlide: function () {
        //获得slider插件对象
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
    }
}