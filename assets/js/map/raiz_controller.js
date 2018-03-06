"use strict";

// $(".raiz-button").on('click', function(){
//   $(".raiz-side-tab-container").toggle("slide", { direction: "left" }, 200);
// });
// $(".raiz-side-tab-container").show();

$(".raiz-side-tab-return").on('mouseover', function(){
  $(this).effect('shake', {
    distance: 1
  });
});

$(".raiz-side-tab-return").on('click', function(){
  console.log('뒤로')
  $(".raiz-side-tab-container").hide("slide", {direction : "left"}, 200);
});

$(".raiz-search-button").on('click', function(){
  console.log('검색');
  $(".raiz-side-tab-container:hidden").show("slide", {direction : "left"}, 200);
  $(".raiz-side-tab ").not(".raiz-search-tab").hide(function(){

      $(".raiz-search-tab:hidden").show();

  });

});

$(".raiz-sil-button").on('click', function(){
  console.log('실거래');
  $(".raiz-side-tab-container:hidden").show("slide", {direction : "left"}, 200);
  $(".raiz-side-tab ").not(".raiz-sil-tab").hide(function(){

    $(".raiz-sil-tab:hidden").show();

  });
});

$(".raiz-junwal-button").on('click', function(){
  console.log('전월');
  $(".raiz-side-tab-container:hidden").show("slide", {direction : "left"}, 200);
  $(".raiz-side-tab ").not(".raiz-junwal-tab").hide(function(){

    $(".raiz-junwal-tab:hidden").show();

  });
});

$(".raiz-stat-button").on('click', function(){
  console.log('통계');
  $(".raiz-side-tab-container:hidden").show("slide", {direction : "left"}, 200);
  $(".raiz-side-tab ").not(".raiz-stat-tab").hide(function(){

    $(".raiz-stat-tab:hidden").show();

  });
});

$(".raiz-side-tab-list li").on('click', function(){

  var chosenButtonText = $(this).text();
  var chosenIndex = $(this).index();

  if($(this).find('span').hasClass('ti-angle-down')){
    $(".raiz-side-tab-list li").not(this).hide("drop", {direction : "down"}, 100);
    $(this).find('span').removeClass('ti-angle-down').addClass('ti-angle-up');
    $(".side-tab-header:visible").children().first().after("<span class='ti-angle-right'> " + chosenButtonText.trim() + "</span>");

    $(this).parent().parent().find(".raiz-side-tab-content li").eq(chosenIndex).fadeIn('fast');
  }
  else{
    $(".raiz-side-tab-list li").not(this).show("drop", {direction : "up"}, 100);
    $(this).find('span').removeClass('ti-angle-up').addClass('ti-angle-down');
    $(".side-tab-header:visible").children().last().prev().remove();

    $(this).parent().parent().find(".raiz-side-tab-content li").eq(chosenIndex).fadeOut('fast');
  }

});


//SIDE tab
//search automcomplete event
var keyword_history = [];
$( "#keyword-input" ).on("focus change keyup",function(e){

    e.preventDefault();

    delay(function(){
      var q = $( '#keyword-input' ).val();
      if(q === ''){
        //show history
          console.log('empty string');
          $(".keyword-result-list-group").hide();
          $(".keyword-suggestions-list-group li").remove();
          var item = '';
          $.each(keyword_history, function(index, value){

            item += "<li data-index="+ index + ">"

                  + value

                  + "</li>";

          });

          $(".keyword-suggestions-list-group").append(item).show('slow');
          $(".keyword-suggestions-list-group li").on('click', function(e){

            var name = $(this).text();
            $("#keyword-input").val(name);


          });

          return false;
      }
      if (!q.replace(/^\s+|\s+$/g, '')) {
          // alert('키워드를 입력해주세요!');
          console.log('invalid string');
          $(".keyword-suggestions-list-group li")
          .hide("slide", { direction: "up" }, 200, function(){
            $(this).remove();
          });
          return false;
      }

      // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
      if(e.keyCode !== undefined){
        ps.keywordSearch( q, fillKeywordSuggestions);
      }

      if(e.keyCode === 13){
        $("#keyword-submit").trigger('click');
      }
  }, 300 );

});

function fillKeywordSuggestions(data, status, pagination){
      console.log(data);
      $(".keyword-result-list-group").hide();
      //first delete all previous lists
      $(".keyword-suggestions-list-group li")
      .hide("slide", { direction: "up" }, 200, function(){
        $(this).remove();
      });

      //Then refill the list with the result
      if (status === daum.maps.services.Status.OK) {
          var item = '';
          $.each(data, function(index, value){

            item += "<li data-index="+ index + " data-id=" + value['id'] + " data-name=" + value['place_name'] + ">"

                  + value['place_name'] + '(' + value['address_name'] + ')'

                  + "</li>";

          });

      }

      else if(status === daum.maps.services.Status.ZERO_RESULT){
          var item = "<li>" + "관련 결과 없음" + "</li>";
      }

      else if (status === daum.maps.services.Status.ERROR) {

      }

      $(".keyword-suggestions-list-group").append(item);

      $(".keyword-suggestions-list-group li").on('click', function(e){
          var name = $( this ).attr('data-name');
          $("#keyword-input").val(name);

          console.log('you have clicked ' + $( this ).attr('data-index'));
          var selected = data[$( this ).attr('data-index')];

          $(".keyword-suggestions-list-group li")
          .hide("slide", { direction: "up" }, 200, function(){
            $(this).remove();
          });

          item = search_result(selected);
          $(".keyword-result-list-group").append(item).show('slide', { direction: "left" }, 300);
          var mouseEvent = {};
          mouseEvent.latLng = {
            ib: selected['x'],
            jb: selected['y']
          };

          keyword_history.push(name);
          map.panTo(new daum.maps.LatLng(mouseEvent.latLng.jb, mouseEvent.latLng.ib));
          daum.maps.event.trigger(map, trigger_by, mouseEvent);
      });

}

$("#keyword-submit").on('click', function(e){

    var q = $( '#keyword-input' ).val();
    if (!q.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해주세요!');
        return false;
    }

    ps.keywordSearch( q, fillKeywordResult );

});

function fillKeywordResult(data, status, pagination){
    var item = '';

    if (status === daum.maps.services.Status.OK) {

        // item = "<li>" + data[0]['road_address_name'] + "</li>";
        item = search_result(data[0]);
        $(".keyword-suggestions-list-group li")
        .hide("slide", { direction: "up" }, 200, function(){
          $(this).remove();
        });

        $(".keyword-result-list-group li").remove();

        $(".keyword-result-list-group").append(item).show('slide', { direction: "left" }, 300);
        var mouseEvent = {};
        mouseEvent.latLng = {
          ib: data[0]['x'],
          jb: data[0]['y']
        };

        keyword_history.push(data[0]['place_name']);
        map.panTo(new daum.maps.LatLng(mouseEvent.latLng.jb, mouseEvent.latLng.ib));
        daum.maps.event.trigger(map, trigger_by, mouseEvent);

    } else if (status === daum.maps.services.Status.ZERO_RESULT) {

        alert('검색 결과가 존재하지 않습니다.');


    } else if (status === daum.maps.services.Status.ERROR) {

        alert('검색 결과 중 오류가 발생했습니다.');
    }
}



var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();
