
  $(".raiz-window-container")
  .resizable({
    handles: "n, e, s, w, ne, se, sw, nw",
    containment : 'parent',
    minWidth: 100,
    minHeight: 100,
    stop: function(event, ui){
      $(this).removeClass('full-screen');
    }
  });

  var prevWidth, prevHeight;
  var prevOffset;
  $( " .raiz-window-container ")
  .draggable({
    containment : $("#map"),
    start: function(event, ui){
      prevWidth = $(this).width();
      prevHeight = $(this).height();
      prevOffset = $(this).offset();
    },
    drag: function(event, ui){
      if(event.pageX <= 0 ){
        $(this).animate({
          "height" : "90vh",
          "width" : "40vw",
          "left" : "0",
          "top" : "80px"
        }, 20)
        .addClass("opac");
      }
      else if(event.pageX >= $(window).width()){
        $(this).animate({
          "height" : "90vh",
          "width" : "40vw",
          "right" : '0',
          "top" : "80px"
        }, 20)
        .addClass("opac");
      }
      else if(event.pageY - 50 <= 0){
        $(this).animate({
          "height" : "90vh",
          "width" : "100vw",
          "left" : '0',
          "top" : "80px"
        }, 20)
        .addClass("opac").addClass('full-screen');
      }
      else{
          $(this).addClass("opac").height(prevHeight).width(prevWidth);
      }
    },
    stop: function(event, ui){
      $(this).removeClass("opac");
      $(this).removeClass("full-screen");
      prevWidth = $(this).width();
      prevHeight = $(this).height();
      prevOffset = $(this).offset();
    }
  })
  .draggable( 'disable' );

  $(".raiz-window-top").on("mouseover", function(e){
    if(event.target !== event.currentTarget) {
      $( " .raiz-window-container ").draggable( 'disable' );
      return false;
    }
    $( this ).addClass("move-cursor");
    $( " .raiz-window-container ").draggable( 'enable' );
  })
  .on("mouseleave", function(){
    $( " .raiz-window-container ").draggable( 'disable' );
  });

  $( " .ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se ")
  .removeClass("ui-icon-gripsmall-diagonal-se")
  .removeClass("ui-icon");

  $(".raiz-window-container .raiz-window-top .ti-minus").on("click", function(e){
    e.stopPropagation();
    //if there are more than 10 windows open, return;
    if($(".map-footer").children().length >= 10){
      alert('Too many windows');
      return;
    }
    var clickedWindow = $(this).parent().parent().parent();
    $(this).parent().parent().parent()
    .hide(
      "drop",
      { direction: "down" }, 100
    ,function(){

      var target = $(this).parent().parent().find(".header").text();

      $(".map-footer").append(function() {
        return $(`<button class="btn raiz-button">${target}</button>`)
        .show('highlight', { color: "#27b874" }, 50)
        .click(function(e){
          clickedWindow.show( function(){
            $(e.currentTarget)
            .remove();
          });
        });
      });
    });

  });

  $(".raiz-window-container .raiz-window-top .ti-layers").on("click", function(e){
    e.stopPropagation();
    if($(this).parent().parent().parent().hasClass('full-screen')){
      $(this).parent().parent().parent()
      .animate({
        "height" : prevHeight,
        "width" : prevWidth,
        "left" : prevOffset.left,
        "top" : prevOffset.top
      }, 100)
      .removeClass('full-screen');
    }
    else{
      prevWidth = $(this).parent().parent().parent().width();
      prevHeight = $(this).parent().parent().parent().height();
      prevOffset = $(this).parent().parent().parent().offset();
      $(this).parent().parent().parent()
      .animate({
        "height" : "90vh",
        "width" : "100vw",
        "left" : "0",
        "top" : "80px"
      }, 100)
      .addClass('full-screen');
    }
  });
  $(".raiz-window-container .raiz-window-top .ti-close").on("click", function(e){
    e.stopPropagation();
    $(this).parent().parent().parent()
    .detach();
  });
