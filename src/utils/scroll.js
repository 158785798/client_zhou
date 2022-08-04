function scrollListener(){

    //获取操作元素最顶端到页面顶端的垂直距离
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    if (scrollTop >= 480) {
      this.isVisable = true; //大于480时显示元素
    }
    if (scrollTop < 480) {
      this.isVisable = false; //小于480时隐藏元素
    }

}
