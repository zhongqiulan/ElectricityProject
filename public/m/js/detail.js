var letao;
var id;
var num;
var size;
$(function () {
    letao = new Letao();
    letao.initslide();
    letao.getProdctDetail(1);
    /*调用初始化区域滚动的方法*/
    letao.initScroll();
    id = letao.getQueryString('id');
    letao.addCart();
    letao.getSize();

})

var Letao = function () {

}
Letao.prototype = {
    // 轮播图初始化代码
    initslide: function () {
        //获得slider插件对象
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
    },
    //调用商品详情的数据
    getProdctDetail: function (id) {
        $.ajax({
            url: '/product/queryProductDetail',
            data: {
                id: 1
            },
            success: function (data) {
                var sizeString = data.size;
                var n = sizeString.split('-');
                var n1 = parseInt(n[0]);
                var n2 = parseInt(n[1]);
                var mySize = [];
                for (var i = n1; i <= n2; i++) {
                    mySize.push(i);
                }
                data.size = mySize;
                var html = template('detailSlideTmp', data);
                $('#main .slide').html(html);
                var first = $('.mui-slider-item').first().clone();
                $('.slide .mui-slider-group').append(first);
                var last = $('.mui-slider-item').last().clone();
                $('.slide .mui-slider-group').prepend(last);
                $('.mui-slider-item').first().addClass('.mui-slider-item-duplicate');
                $('.mui-slider-item').last().addClass('.mui-slider-item-duplicate');
                letao.initslide();
                var html1 = template('detailProductTmp', data);
                $('.products').html(html1);
                letao.setNewNum();
                letao.getValue();

            }
        })
    },
    // 初始化区域滚动
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
    // 获取url中参数的值
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    },
    // 设置数字输入框新值
    setNewNum: function () {
        mui('.mui-numbox').numbox();
        
    },
    // 取当前值
    getValue: function () {

        num = mui('.mui-numbox').numbox().getValue();
        
    },
    // 加入购物车
    addCart: function () {
        $('#footer .mui-row .add-cart').click(function () {
            letao.getValue();
            $.ajax({
                url: '/cart/addCart',
                type: 'post',
                data: {
                    productId: id,
                    num: num,
                    size: size
                },
                success: function (data) {
                    console.log(data);
                    console.log(num);
                    if(data.success){
                        window.location.href = "http://localhost:3000/m/cart.html";
                    }else{
                        window.location.href = "http://localhost:3000/m/login.html";
                    }
                }
            })
        })

    },
    // 获取当前尺码
    getSize: function () {
        $('.products').on('click', '.product-size > span', function () {
            $('.product-size > span').removeClass('active');
            $(this).addClass('active');
            size = $(this).data('size');
        })
    }
}