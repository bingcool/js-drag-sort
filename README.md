这是一个基于jQuery实现的可以进行拖曳排序功能的插件！    
实现的功能：
（1）可以随意地拖曳item进行排序，已经整合了包括产生滚动条的情况   
（2）可以自定义各种的样式   
（3）对于一些细节问题进行很好的处理，比如拖曳时，可以防止产生不必要的误击作用   

用法：        
    $("#container").Jsdrag({           
        //item的类名,必须设定            
        itemDiv:string,   
        //drag的div的类名, 必须设定             
        dragDiv:string,       
        //虚框css的样式，选择设置，不设置启用插件默认样式       
        tempSty:{},       
        //按下鼠标时拖曳的item的css样式，选择设置，不设置启用插件默认样式    
        itemdashSty:{},            
        //鼠标进入的drag拖曳框的css样式，选择设置，不设置启用插件默认样式        
        dragSty:{},     
        //拖曳过程中拖曳的item的css样式选择设置，不设置启用插件默认样式        
        theDivSty:{},    
        //鼠标进入的drag拖曳框时显示的信息，默认是:'按下鼠标拖曳'                    
        msg:string       
    });    
    
具体的用法可以参考test下的index.html