var AutoSuggest = function(options){

  var opt = {
    minInputLen: 2,
    ajaxType: 'json',
    row: 5
  }
  var element;
  var container;
  var KEYCODE = {
    BACKSPACE: 8,
    ARROWUP: 38,
    ARROWDOWN: 40,
    TAB: 9,
    ENTER: 13
  }

  var showSuggestionMenu = function(data) {
    var inputValue = element.val();
    container.css({
      position: 'relative'
    });
    prepareSuggestMenu();
    var snippet = [];
    var display;
    var value;
    data.forEach(function(item){
      if(typeof item == 'object') {
        display = item.display;
        value   = item.value;
      } else {
        display = item;
        value   = item;
      }
      snippet.push('<li><a data-keydown="walkSuggestMenu" data-action="pickItem" data-param="' + value + '" href="#">' + display + '</a></li>');
    });
    var snippetHtml = snippet.join('');
    container.children('.dropdown-menu').append($(snippetHtml));
  };

  var prepareSuggestMenu = function() {
    if(container.children('.dropdown-menu').length) {
      container.children('.dropdown-menu').empty();
    } else {
      // TODO: id 随机生成一个 (Larry)
      container.append($('<ul id="suggestMenu" class="dropdown-menu" role="menu"></ul>'));
      setTimeout(function(){
        container.children('.dropdown-menu').show();
      }, 0);
    }
  };

  var removeSuggestMenu = function() {
    if(container.children('.dropdown-menu').length) {
      container.children('.dropdown-menu').remove();
    }
  }

  var eventHandlers = {
    fetchData: function(event, param) {
      var $el = $(event.target);
      var keyCode = event.keyCode;
      var isPicked = $el.data('picked');
      
      if(keyCode == KEYCODE.BACKSPACE && isPicked) {
        $el.val('');
        $el.attr('former-value', '');
        $el.data('picked', '');
        return false;
      }

      if(keyCode == KEYCODE.ARROWUP || keyCode == KEYCODE.ARROWDOWN) {
        var itemValue;
        if(keyCode == KEYCODE.ARROWUP) {
          itemValue = container.find('.dropdown-menu').length && container.find('.dropdown-menu a:last').addClass('focus').focus().data('param') || '';
        }
        if(keyCode == KEYCODE.ARROWDOWN) {
          itemValue = container.find('.dropdown-menu').length && container.find('.dropdown-menu a:first').addClass('focus').focus().data('param') || '';
        }
        if(itemValue) $el.val(itemValue);
        return false;
      }

      if(keyCode == KEYCODE.ENTER) {
        container.find('.dropdown-menu').length && container.find('a[data-keydown]:first').click();
        return false;
      }

      var elementValue = $el.val();
      var formerValue = $el.attr('former-value');
      if( elementValue == formerValue ) {
        return false;
      } else {
        $el.attr('former-value', elementValue);
      }
      
      if( elementValue.length > opt.minInputLen) {
        if(opt.dataType == 'script' || opt.dataType == 'json') {
          url = opt.url.replace('{%input%}', elementValue);
          $.ajax(url, {
            cache: false,
            dataType: opt.dataType,
            success: function(data){
              if(typeof opt.processData == 'function') {
                data = opt.processData(elementValue, data);
              }
              if(typeof data == 'object' && data.length) {
                data = data.splice(0, opt.row);
                showSuggestionMenu(data);
              } else {
                removeSuggestMenu();    
              }
            }
          });
        } else {
          throw "无效的 ajaxType 参数。";
        }
      } else {
        removeSuggestMenu();
      }
    },
    walkSuggestMenu: function(event, param) {
      if(event) event.preventDefault();
      var keyCode = event.keyCode;
      // 在列表项上按退格键可以删除已输入的内容
      if(keyCode == KEYCODE.TAB || keyCode == KEYCODE.ENTER) {
        $(event.target).click();
      } else {
        var $container = $(event.target).parents('ul')
        var $menuItems = $container.find('a[data-keydown]');
        var index  = newIndex = $menuItems.index($container.find('a.focus'));
        var length = $menuItems.length;
        if(keyCode == KEYCODE.ARROWUP) {
          newIndex = index - 1 < 0 ? length - 1 : index - 1;
        }
        if(keyCode == KEYCODE.ARROWDOWN) {
          newIndex = index + 1 == length ? 0 : index + 1;
        }
        $($menuItems[index]).removeClass('focus');
        $($menuItems[newIndex]).addClass('focus').focus();
        element.val($($menuItems[newIndex]).data('param'));
      }
      return false;
    },
    pickItem: function(event, param){
      var obj = event.currentTarget;
      // NOTE: 这句是干啥的 (Larry)
      $(obj).parent().addClass('active');
      setTimeout(function(){
        removeSuggestMenu(obj);
        element.val(param).data('picked', '1');
        $ele.focus();
        if(typeof opt.pick == 'function') {
          opt.pick(param);
        }
      }, 75);
    }
  }

  opt = $.extend({}, opt, options);
  $ele = $(opt.id).length ? $(opt.id) : $('#' + opt.id);
  if($ele.length == 0) {
    throw "指定的元素不存在。";
  }
  element = $ele;
  container = $(opt.container).length ? $(opt.container) : $ele.parent();
  // TODO: 缺少点击在菜单外面的事件，及按 ESC 取消的事件 (Larry)
  container.delegate('[data-action]', 'click', function(event){
    var action = $(this).data('action');
    var param  = $(this).data('param');
    eventHandlers[action](event, param);
  });

  container.delegate('[data-keydown]', 'keydown', function(event){
    var action = $(this).data('keydown');
    var param  = $(this).data('param');
    eventHandlers[action](event, param);
  });

  container.delegate('[data-keyup]', 'keyup', function(event){
    var action = $(this).data('keyup');
    var param  = $(this).data('param');
    eventHandlers[action](event, param);
  });
  
};
