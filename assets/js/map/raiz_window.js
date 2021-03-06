
var window_height = $(window).height();
var window_width = $(window).width();
var top_offset = $(".navbar").height() + $(".raiz-controller").height();
var bottom_offset = $(".map-footer").height();

var window_on_left = {
  "height" : window_height - top_offset - bottom_offset,
  "width" : "500px",
  "left" : '0',
  "top" : top_offset
};

var window_on_right = {
  "height" : window_height - top_offset - bottom_offset,
  "width" : "500px",
  "right" : '0',
  "top" : top_offset
};

var window_on_top = {
  "height" : window_height - top_offset - bottom_offset,
  "width" : "100vw",
  "left" : '0',
  "top" : top_offset
}

function lifeToWindow(Rwindow){
  $(".raiz-window-container").not(this).css('z-index' , '15');
  $(".raiz-window-container .raiz-window-top").css('background-color', '#636161');
  Rwindow.css('z-index' , '20');
  Rwindow.find('.raiz-window-top').css('background-color' , '#2d2d2d');

  Rwindow
  .resizable({
    handles: "n, e, s, w, ne, se, sw, nw",
    containment : 'parent',
    minWidth: 100,
    minHeight: 100,
    resize: function(event, ui){
      // camera.aspect = 1;
      // camera.updateProjectionMatrix();
      // renderer.setSize( $(this).width(), $(this).height() );
    },
    stop: function(event, ui){
      $(this).removeClass('full-screen');
    }
  });

  var prevWidth, prevHeight;
  var prevOffset;
  Rwindow
  .draggable({
    containment : $("#map"),
    start: function(event, ui){
      prevWidth = Rwindow.width();
      prevHeight = Rwindow.height();
      prevOffset = Rwindow.offset();
    },
    drag: function(event, ui){
      if(event.pageX <= 0 ){
        $(this).animate(window_on_left, 20)
        .addClass("opac");
      }
      // else if(event.pageX >= $(window).width()){
      //   console.log('on the right');
      //   $(this).animate(window_on_right, 20)
      //   .addClass("opac");
      // }
      else if(event.pageY - top_offset + 40 <= 0){
        $(this).animate(window_on_top, 20)
        .addClass("opac").addClass('full-screen');
      }
      else{
          $(this).addClass("opac").height(prevHeight).width(prevWidth);
      }
    },
    stop: function(event, ui){
      // console.log('event2');
      $(this).removeClass("opac");
      $(this).removeClass("full-screen");
      prevWidth = $(this).width();
      prevHeight = $(this).height();
      prevOffset = $(this).offset();
      $(this).trigger('resize');
    }
  })
  .draggable( 'disable' );
  Rwindow.find(".raiz-window-top, .header").on("dblclick", function(e){
    // console.log('dblclick');
    Rwindow.find(".ti-layers").trigger("click");
  });
  Rwindow.find(".raiz-window-top, .header").on("mousedown", function(e){
    if(e.target !== e.currentTarget) {
      Rwindow.draggable( 'disable' );
      return false;
    }
    $( this ).addClass("move-cursor");
    Rwindow.draggable( 'enable' );
  })
  .on("mouseleave", function(){
    Rwindow.draggable( 'disable' );
  });

  Rwindow.on("mousedown", function(e){
    $(".raiz-window-container").not(this).css('z-index' , '15');
    $(".raiz-window-container .raiz-window-top").css('background-color', '#636161');
    Rwindow.css('z-index' , '20');
    Rwindow.find('.raiz-window-top').css('background-color' , '#2d2d2d');

  });

  Rwindow.find( " .ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se ")
  .removeClass("ui-icon-gripsmall-diagonal-se")
  .removeClass("ui-icon");

  Rwindow.find(".ti-minus").on("click", function(e){
    e.stopPropagation();
    //if there are more than 10 windows open, return;
    if(Rwindow.find(".map-footer").children().length >= 10){
      alert('Too many windows');
      return;
    }
    Rwindow.hide(
      "drop",
      { direction: "down" }, 100
    ,function(){

      var target = Rwindow.find(".header").text();
      // var tab = $(`
      //   <div class="footer-tab-container">
      //     <div>${target}</div>
      //     <span class="ti-close"></span>
      //   </div>
      //   `);

      var tab = $(
        " <div class='footer-tab-container'>"
        +  "<div class='tab-name'>" + target + "</div>"
        +  "<span class='ti-close'></span>"
        + "</div>"
        );


      $(".map-footer").append(tab);
      tab.find('div').tooltip({
        'animation': true,
        'title' : target,
        'placement' : 'top'
      });
      tab.show('highlight', { color: "#27b874" }, 50);
      tab.find('.tab-name').click(function(){
        $(".raiz-window-container").not(this).css('z-index' , '15');
        $(".raiz-window-container .raiz-window-top").css('background-color', '#636161');
        Rwindow.css('z-index' , '20');
        Rwindow.find('.raiz-window-top').css('background-color' , '#2d2d2d');
        Rwindow.show('normal');
        tab.remove();
      });
      // tab.find('div').hover(function(){
      //   $(this).tooltip();
      // });
      tab.find('.ti-close').click(function(){
        Rwindow.remove();
        tab.hide('slide', {direction:'left'}, function(){ tab.remove() });
      })

    });

  });

  Rwindow.find(".ti-layers").on("click", function(e){
    e.stopPropagation();
    if($(this).parent().parent().parent().hasClass('full-screen')){
      $(this).parent().parent().parent()
      .animate({
        "height" : prevHeight,
        "width" : prevWidth,
        "left" : prevOffset.left,
        "top" : prevOffset.top
      }, 100, function(){
        $(this).trigger('resize');
      })
      .removeClass('full-screen');
    }
    else{
      prevWidth = $(this).parent().parent().parent().width();
      prevHeight = $(this).parent().parent().parent().height();
      prevOffset = $(this).parent().parent().parent().offset();
      $(this).parent().parent().parent()
      .animate(window_on_top, 100, function(){
        $(this).trigger('resize');
      })
      .addClass('full-screen');
    }

  });
  Rwindow.find(".ti-close").on("click", function(e){
    e.stopPropagation();

    Rwindow.fadeOut('normal', function(){
      Rwindow.detach();
      $(".raiz-window-container").css('z-index' , '15');
      $(".raiz-window-container .raiz-window-top").css('background-color', '#636161');
      var nextRwindow = $(".raiz-window-container").last();
      console.log(nextRwindow);
      nextRwindow.css('z-index' , '20');
      nextRwindow.find('.raiz-window-top').css('background-color' , '#2d2d2d');
    })

  });

  Rwindow.find(".raiz-mouse-control").on("click", function(e){
    Rwindow.find('.raiz-mouse-control-info').toggle('fast', 'linear');
  });

  Rwindow.find(".raiz-mouse-control").tooltip({
    'animation': true,
    'title' : '컨트롤',
    'placement' : 'right'
  });

  Rwindow.find(".raiz-mouse-control").on("click", function(e){
    $(this).tooltip();
  });

  Rwindow.find(".raiz-info-icon").not('.raiz-reset').on("click", function(e){
    if(!Rwindow.find(".raiz-window-info").is(':visible')){

      var width_to_move = Rwindow.find(".raiz-window-info").width();
      Rwindow.find(".raiz-info-icon").css('right', width_to_move + 30);

      // Rwindow.width(Rwindow.width() + 300);
      Rwindow.animate({width: Rwindow.width() + 300}, 'fast' , function(){

        Rwindow.find(".raiz-window-info").show('slide', {direction:"right"}, 200, function(){

            Rwindow.trigger('resize');

        });

      });

    }
  });

  Rwindow.find(".raiz-window-info").find(".raiz-window-info-return").on("mouseover", function(e){
    $(this).effect('shake', {
      distance: 1
    });
  });

  Rwindow.find(".raiz-window-info").find(".raiz-window-info-return").on("click", function(e){

      Rwindow.find(".raiz-window-info").hide('slide', {direction:"right"}, 200, function(){
          Rwindow.animate({width: Rwindow.width() - 300}, 'fast', function(){
              Rwindow.trigger('resize');
          });

          Rwindow.find(".raiz-info-icon").css('right', 30);

      });
  });

  Rwindow.find(".raiz-reset").tooltip({
    'animation' : true,
    'title': '3D 초기화',
    'placement' : 'left'
  });

  Rwindow.find(".raiz-reset").on("mouseover", function(e){
    $(this).tooltip();
  });

}
