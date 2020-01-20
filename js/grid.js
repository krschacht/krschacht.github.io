/*
  Pinterest Grid Plugin
  Copyright 2014 Mediademons
  @author smm 16/04/2014

  Modified by John Avis 16/11/2017

  usage:

    $(document).ready(function() {
    $('#blog-landing').pinterest_grid({
      no_columns: 4
    });
  });
*/
; (function ($, window, document, undefined) {
  var pluginName = 'pinterest_grid',
    defaults = {
      padding_x: 10,
      padding_y: 10,
      no_columns: 4,
      margin_bottom: 50,
      breakpoints: [
        [250, 1],
        [690, 2],
        [1050, 3]
      ]
    },
    columns,
    $article,
    article_width;

  function Plugin(element, options) {
    this.element = element;
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype.init = function () {
    var self = this,
      resize_finish;

    $(this.element).find("img").load(function () {
      $(window).resize();
    });

    $(window).resize(function () {
      clearTimeout(resize_finish);
      resize_finish = setTimeout(function () {
        self.make_layout_change(self);
      }, 11);
    });

    self.make_layout_change(self);

    setTimeout(function () {
      $(window).resize();
    }, 500);
  };

  Plugin.prototype.calculate = function (columns) {
    var self = this,
      tallest = 0,
      row = 0,
      $container = $(this.element),
      container_width = $container.width();
    $article = $(this.element).children();

    if (columns === 1) {
      article_width = $container.width();
    } else {
      article_width = ($container.width() - self.options.padding_x * (columns - 1)) / columns;
    }

    $article.each(function () {
      $(this).css('width', article_width);
    });

    var columnTop = [];
    for (var i = 1; i <= columns; i++) {
      columnTop[i] = 0;
    }

    $article.each(function (index) {
      var current_column,
        left_out = 0,
        top = 0,
        $this = $(this);

      current_column = 0;
      var minColumnTop = -1;
      for (var i = 1; i <= columns; i++) {
        if (minColumnTop == -1 || columnTop[i] < minColumnTop) {
          current_column = i;
          minColumnTop = columnTop[i];
        }
      }

      top = columnTop[current_column];

      columnTop[current_column] += $(this).outerHeight() + self.options.padding_y;

      if (columns === 1) {
        left_out = 0;
      } else {
        left_out = ((current_column - 1) % columns) * (article_width + self.options.padding_x);
      }

      $this.css({
        'left': left_out,
        'top': top
      });
    });

    var paddingy = this.options.padding_y;
    largest = Math.max.apply(Math, columnTop) - paddingy;
    $container.css('height', largest + this.options.margin_bottom);
  };

  Plugin.prototype.make_layout_change = function (_self) {
    columns = _self.options.no_columns;

    for (var i = 0; i < _self.options.breakpoints.length; i++) {
      if ($(this.element).width() <= _self.options.breakpoints[i][0]) {
        columns = _self.options.breakpoints[i][1];
        break;
      }
    }

    _self.calculate(columns);
  };

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName,
          new Plugin(this, options));
      }
    });
  }

})(jQuery, window, document);
