;(function($){
  // 定义插件全局变量，可以在其他的函数中引用
    var setting,$this;
    //鼠标相对于drag元素对象偏移量
    var range = { x: 0, y: 0 };
    //拖拽对象时的x,y坐标相对于产生滚动的div  
    var lastPos = { x: 0, y: 0, x1:0, y1:0 };
    //目标对象的位置x,y
    var tarPos = { x: 0, y: 0, x1: 0, y1: 0 };
    // 目标元素对象的坐标初始化，theDiv:拖拽对象,itemDiv:item对象 move:拖拽状态, 
    // theDivHeight:高度，theDivHalf：一半高度 ，tarFirstY:第一个item距离产生滚动条的div的距离
    var theDiv = null, itemDiv = null, move = false, theDivHeight = 0, theDivHalf = 0; tarFirstY = 0;
    //产生的滚动条高度
    var scrollTop;
    // item对象名,drag对象名,tempDiv虚框的对象名,tarFirst第一个item
    var item,drag,temp,tempDiv,tarFirst;
    // 执行的方法
    var methods = {
      // 初始化变量
      init:function(options) {
        return this.each(function() {
          // 判断目标DOM是否存在
          $this = $(this);
          if($this.length < 1) {
              return false;
          }

          var defaults = {
              'itemDiv':null,
              'dragDiv':null,
              // 虚框默认的样式
              'tempSty':{
              "position":"relative", 
              "width":"100%", 
              "height":"105px", 
              "margin-bottom":"5px", 
              "border":"1px dashed #f00"
            },
                    // 拖曳的item的默认样式
            'itemdashSty':{
              "position":"absolute", 
              "width":"100%", 
              "height":"100px",
              "margin-bottom":"5px", 
              "border":"1px solid blue", 
              "background":"#ccc",
              "z-index":"999"
            },
            // 鼠标进入drag的div的默认样式
            'dragSty':{
              "background-color":"#aaa",
              "filter":"alpha(opacity=50)", 
              "-moz-opacity":"0.5", 
              "opacity":"0.5",
              "text-align":"center"
            },
            // 按下鼠标时默认的动态设置的drag的div样式
            'theDivSty':{
              'position':"absolute",
              'width':"100%",
              'height':"calc(100%)",//获取父级的高度
              "z-index":"1000",
              "background-color":"#aaa",
              "filter":"alpha(opacity=50)", 
              "-moz-opacity":"0.5", 
              "opacity":"0.5"
            },

            'msg':'按下鼠标拖曳'
        };

          options.tempSty = $.extend(defaults.tempSty,options.tempSty);

          options.itemdashSty = $.extend(defaults.itemdashSty,options.itemdashSty);
    
          options.dragSty = $.extend(defaults.dragSty,options.dragSty);

          options.theDivSty = $.extend(defaults.theDivSty,options.theDivSty);
    
          setting = $.extend(defaults,options);
          //获取类名字符串 
          item = '.'+setting.itemDiv;
          drag = '.'+setting.dragDiv;
          //执行函数
          methods['drag']();
          return ;
        });
         
      },

      //拖曳函数
      drag:function() {
        // 鼠标移到drag的div
        $this.find(drag).on('mouseover',function(){
              $(this).css(setting.dragSty).text(setting.msg);

            }).on('mouseout',function(){
              $(this).removeAttr("style").text(''); 

            }).on('mousedown',function(event){
              // 判断是否存在虚框
            if(!$this.find('.dash').length) {  
              // 拖曳的this对象
              theDiv = $(this);

              // 拖曳的this对象对应的item对象
              itemDiv = theDiv.parent();

              //鼠标相对于该元素偏移量  
              range.x = event.pageX - theDiv.offset().left;  
              range.y = event.pageY - theDiv.offset().top;

              // div产生的滚动条高度
              scrollTop = $this.scrollTop();

              //item相对于父级元素(产生滚动条的div)的左边距离和顶部距离
              var preleft = itemDiv.position().left + 10;  
              var pretop = itemDiv.position().top + scrollTop + 10;

              //获取item的高度
              theDivHeight = itemDiv.height();
              // item的高度的一半
              theDivHalf = theDivHeight/2;

              // 动态设置拖曳框的样式
              theDiv.css(setting.theDivSty).text('');

              itemDiv.attr('class','item-dash').css(setting.itemdashSty).css({
                left: preleft+'px',
                top:pretop+'px'
              });

              /** 
              *创建新元素 插入拖拽元素之前的位置(虚线框)
              *在选中元素之前插入一个新的div
              */
            
              $("<div class='dash'></div>").insertBefore(itemDiv).css(setting.tempSty);  
            
                // 获取虚框对象
              tempDiv = $('.dash');
              // 准备移动状态
              move = true;
          }

        }).on('mousemove',function(event){
          //只是按下鼠标，没有移动，退出
          if (!move) return false;
          var parent_left = $this.offset().left;
          var parent_top = $this.offset().top;
          // 移动产生的滚动条距离div的顶部会不断变化,在这里重新计算
          scrollTop = $this.scrollTop();
          /** 
          *拖曳位置，item相对于$this的左边距离和顶部距离
          *鼠标的移动产生不同的位置(这里是可以移动的原因)
          */
          lastPos.x = event.pageX - parent_left - range.x;  
          lastPos.y = event.pageY - parent_top - range.y + scrollTop;
          
          // 设定比较值
          lastPos.y1 = lastPos.y + theDivHeight - scrollTop;

          // 鼠标移动，拖拽元素随机改变位置移动
          itemDiv.css({
              left: lastPos.x + 'px',
              top: lastPos.y + 'px'
          });

          //循环排序，计算距离，插入虚框
          //获取虚框对象，通过下面的循环计算，再插入对应位置
          $(item).each(function(){
            var tarDiv = $(this);
            tarPos.x = tarDiv.position().left;  
            tarPos.y = tarDiv.position().top;  
            tarPos.y1 = tarPos.y + tarDiv.height()/2;
            // 获得第一个元素
            tarFirst = $(item).eq(0);   
              tarFirstY = tarFirst.position().top + theDivHalf;

            //拖拽对象 移动到第一个位置  
            if (lastPos.y <= tarFirstY) {  
                tempDiv.insertBefore(tarFirst);  
            }

            //判断要插入目标元素的坐标后,直接插入  
            if (lastPos.y >= tarPos.y - theDivHalf && lastPos.y1 >= tarPos.y1){  
                tempDiv.insertAfter(tarDiv);  
            } 
          });

        }).on('mouseup',function(event){
          //恢复对象的初始样式 
          itemDiv.removeAttr("style").attr("class",setting.itemDiv);            
          // 拖拽元素插入到 虚线div的位置之前
          itemDiv.insertBefore(tempDiv);
          //移除动态设置的样式
          theDiv.removeAttr("style");
          // 删除新建的虚线div   
          tempDiv.remove();
          move = false;
          return ; 
        });      
      }

    }
    // 定义暴露函数
    $.fn.Jsdrag = function(){
        var method = arguments[0];
        if(methods[method]) {
            method = methods[method];
            //将含有length属性的数组获取从第下标为1的之后的数组元素，并返回数组
            arguments = Array.prototype.slice.call(arguments,1);
        }else if(typeof(method)=="object" || !method) {
            method = methods.init;
        }else{
            $.error( 'Method ' +  method + ' does not exist plug on jQuery.Jsdrag' );
            return this;
        }
        //jquery的实例对象将拥有执行method的能力,并且arguments为method的参数
        return method.apply(this,arguments);
    }
})(jQuery);