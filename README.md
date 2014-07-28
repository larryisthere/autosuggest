#### 描述

为普通 input 输入框加入自动提示功能的前端组件。

#### 特色

* 可配置数据请求接口
* 可以配置选择一项的后续操作的回调函数
* 可以配置对返回数据进行处理的回调函数
* 支持丰富的键盘操作
* 使用了兼容 Bootstrap 的 class

#### 截图
![image](http://www.zhxl.me/wp-content/uploads/2014/02/B8C26632-FCB0-41C2-AE4B-8303DBACE8C3-1024x663.jpg)

![image](http://www.zhxl.me/wp-content/uploads/2014/02/EC9191D5-E5B0-4FAC-B163-74D5B4A0C24E-1024x663.jpg)

#### 用法

1. 输入框 input 加上 data-keyup="fetchData"，建议也加上 autocomplete="off"

2. 然后通过如下代码实例化 AutoSuggest

        var suggest = new AutoSuggest({
        // 容器的 id 或 class
        container: '.suggest-container',
        // 输入框的 id 或 class 或 jQuery object
        id: 'stock',
        // 输入几个字符的时候触发请求
        minInputLen: 2,
        // 列表一次显示的最大条目数
        row: 10,
        // 请求的地址，{%input%} 是用户输入的字符
        url: 'http://suggest3.sinajs.cn/suggest/?name=info&key={%input%}',
        // 请求的方式，对应 jQuery 的 script 或 json
        dataType: 'script',
        /**
         * 当用户选中一个列表项时进行的操作
         * @param {string} value 用户选定项的值，如果没有指定该值，则同该项显示的内容
         */
        pick: function(value) {
          alert('你选择了' + value);
        },
        /**
         * 获取到数据后对数据进行过滤及格式化处理
         * @param {string} inputValue 用户当前输入的字符串
         * @param {string|json} data 服务器返回的数据
         * @return {array} 处理后的传回组件用于显示的数据。数组中可以为 string 或 json。
         *                 若为 json，display 为显示的值；param 为数据库返回的值, menuitem 为构成菜单的 html 代码。
         */
        processData: function(inputValue, data) {
          if(window.info) {
            var result = [];
            var stock_arry;
            data = window.info.split(';');
            data.forEach(function(stock){
              stock_arr = stock.split(',');
              if(inputValue.match(/\d+/) !== null) {
                match = stock_arr[2];
              } else {
                match = stock_arr[0];
              }
              result.push({
                'menuitem': match.replace(inputValue, '<strong>' + inputValue + '</strong>') + ', ' + stock_arr[4],
                'display': stock_arr[4] + '(' + stock_arr[2] + ')'
              });      
            });
            return result;
          }
        }