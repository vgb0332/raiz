$(".raiz-side-tab-list li").on('click', function(){
  var chosenDom = $(this);
  var chosenButtonText = $(this).text();
  var chosenIndex = $(this).attr('data-index');

  if($(this).find('span').hasClass('ti-angle-down')){
    chosenDom.siblings().not(this).hide("drop", {direction : "down"}, 100);
    chosenDom.find('span').removeClass('ti-angle-down').addClass('ti-angle-up');
    $(".side-tab-header:visible").children().first().after("<span class='ti-angle-right'> " + chosenButtonText.trim() + "</span>");

    chosenDom.parent().parent().find(".raiz-side-tab-content li[data-index=" + chosenIndex + "]").fadeIn('fast');
  }
  else{
    chosenDom.siblings().not(this).show("drop", {direction : "up"}, 100);
    chosenDom.find('span').removeClass('ti-angle-up').addClass('ti-angle-down');
    $(".side-tab-header:visible").children().last().prev().remove();

    chosenDom.parent().parent().find(".raiz-side-tab-content li[data-index=" + chosenIndex + "]").fadeOut('fast');
  }

});


/*************************** 검색 창 *****************************/


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
            ps.keywordSearch( name, fillKeywordSuggestions);

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
          $(".keyword-result-list-group li").remove();
          $(".keyword-result-list-group").append(item).show('slide', { direction: "left" }, 300);

          var mouseEvent = {};
          mouseEvent.latLng = {
            ib: selected['x'],
            jb: selected['y']
          };

          if( ( $.inArray(name, keyword_history) == -1 ) ){
            keyword_history.push(name);
          }

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
        $(".keyword-result-list-group li").remove();

        item = search_result(data[0]);
        $(".keyword-suggestions-list-group li")
        .hide("slide", { direction: "up" }, 200, function(){
          $(this).remove();
        });

        $(".keyword-result-list-group").append(item).show('slide', { direction: "left" }, 300);

        var mouseEvent = {};
        mouseEvent.latLng = {
          ib: data[0]['x'],
          jb: data[0]['y']
        };

        if( ( $.inArray(name, keyword_history) == -1 ) ){
            keyword_history.push(data[0]['place_name']);
        }

        map.panTo(new daum.maps.LatLng(mouseEvent.latLng.jb, mouseEvent.latLng.ib));
        daum.maps.event.trigger(map, trigger_by, mouseEvent);

    } else if (status === daum.maps.services.Status.ZERO_RESULT) {

        alert('검색 결과가 존재하지 않습니다.');


    } else if (status === daum.maps.services.Status.ERROR) {

        alert('검색 결과 중 오류가 발생했습니다.');
    }
}

var jibun_history = [];
$( "#jibun-input" ).on("focus change keyup",  function(e) {

  e.preventDefault();

  delay(function(){
      var q = $( '#jibun-input' ).val();

      if(q === ''){
        //show history
          console.log('empty string');
          $(".jibun-result-list-group").hide();
          $(".jibun-suggestions-list-group li").remove();
          var item = '';
          $.each(jibun_history, function(index, value){

            item += "<li data-index="+ index + ">"

                  + value

                  + "</li>";

          });

          $(".jibun-suggestions-list-group").append(item).show('slow');
          $(".jibun-suggestions-list-group li").on('click', function(e){

            var name = $(this).text();
            $("#jibun-input").val(name);
            geocoder.addressSearch( name, fillJibunSuggestions);

          });

          return false;
      }
      if (!q.replace(/^\s+|\s+$/g, '')) {
          // alert('키워드를 입력해주세요!');
          console.log('invalid string');
          $(".jibun-suggestions-list-group li")
          .hide("slide", { direction: "up" }, 200, function(){
            $(this).remove();
          });
          return false;
      }

      // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
      if(e.keyCode !== undefined){
        ps.keywordSearch( q, fillJibunSuggestions);
      }

      if(e.keyCode === 13){
        $("#jibun-submit").trigger('click');
      }
  }, 300 );

});

function fillJibunSuggestions(data, status){

  $(".jibun-result-list-group").hide();
  //first delete all previous lists
  $(".jibun-suggestions-list-group li")
  .hide("slide", { direction: "up" }, 200, function(){
    $(this).remove();
  });

  //Then refill the list with the result
  if (status === daum.maps.services.Status.OK) {
      var item = '';
      $.each(data, function(index, value){

        item += "<li data-index="+ index + " data-id=" + value['id'] + " data-name=" + value['place_name'] + ">"

              + value['address_name']

              + "</li>";

      });

  }

  else if(status === daum.maps.services.Status.ZERO_RESULT){
      var item = "<li>" + "관련 결과 없음" + "</li>";
  }

  else if (status === daum.maps.services.Status.ERROR) {

  }

  $(".jibun-suggestions-list-group").append(item);

  $(".jibun-suggestions-list-group li").on('click', function(e){
      var name = $( this ).text();
      $("#jibun-input").val(name);

      console.log('you have clicked ' + $( this ).attr('data-index'));
      var selected = data[$( this ).attr('data-index')];

      $(".jibun-suggestions-list-group li")
      .hide("slide", { direction: "up" }, 200, function(){
        $(this).remove();
      });

      item = search_result(selected);

      $(".jibun-result-list-group li").remove();
      $(".jibun-result-list-group").append(item).show('slide', { direction: "left" }, 300);

      var mouseEvent = {};
      mouseEvent.latLng = {
        ib: selected['x'],
        jb: selected['y']
      };

      if( ( $.inArray(name, jibun_history) == -1 ) ){
        jibun_history.push(name);
      }

      map.panTo(new daum.maps.LatLng(mouseEvent.latLng.jb, mouseEvent.latLng.ib));
      daum.maps.event.trigger(map, trigger_by, mouseEvent);
  });

}

$("#jibun-submit").on('click', function(e){

    var q = $( '#jibun-input' ).val();
    if (!q.replace(/^\s+|\s+$/g, '')) {
        alert('지번을 입력해주세요!');
        return false;
    }

    ps.keywordSearch( q, fillJibunResult );

});

function fillJibunResult(data, status){
    var item = '';

    if (status === daum.maps.services.Status.OK) {
        $(".jibun-result-list-group li").remove();

        item = search_result(data[0]);
        $(".jibun-suggestions-list-group li")
        .hide("slide", { direction: "up" }, 200, function(){
          $(this).remove();
        });

        $(".jibun-result-list-group").append(item).show('slide', { direction: "left" }, 300);
        $("#jibun-input").val(data[0]['address_name']);
        var mouseEvent = {};
        mouseEvent.latLng = {
          ib: data[0]['x'],
          jb: data[0]['y']
        };

        if( ( $.inArray(name, jibun_history) == -1 ) ){
            jibun_history.push(data[0]['place_name']);
        }

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

/********************************************************************/

/*************************** 실거래 창 ********************************/

//주소 초기화
geocoder.coord2RegionCode(map.getCenter().getLng(), map.getCenter().getLat(), function(data, status){

    if (status === daum.maps.services.Status.OK) {

        $(".sil-location-name").text(data[0]['address_name']);

    }

});

$(".raiz-sil-tab .raiz-side-tab-list > li").on('click', function(e){
    daum.maps.event.trigger(map, 'idle');
});

daum.maps.event.addListener(map, 'idle', function() {

    //find which sil tab is open!
    var target = $(".raiz-sil-tab .raiz-side-tab-content li:visible");
    if(target.attr('id') === undefined) return false;

    if(map.getLevel() > 5){
        target.find(".sil-result-list li").remove();
        target.find(".sil-result-list").append('<li>조금만 확대해주세요^^;;</li>');
        needSilRefresh = false;
    }
    else{
        needSilRefresh = true;
    }

    if(target.attr('id') === 'apt-sil'){

      geocoder.coord2RegionCode(map.getCenter().getLng(), map.getCenter().getLat(), function(address, status){
        if (status === daum.maps.services.Status.OK) {
           if(sil_currentCode === currentCode){
             if(sil_currentCode === undefined) needSilRefresh = true;
             else needSilRefresh = false;

           }
           else{
             sil_currentCode = address[0]['code'];
             needSilRefresh = true;
           }

           if(needSilRefresh){

             $.each(sil_buildingPolygons, function(index, polygon){
               polygon.setMap(null);
               sil_buildingPolygons = [];
             });

             $.each(sil_landPolygons, function(index, polygon){
               polygon.setMap(null);
               sil_landPolygons = [];
             });

             target.find(".sil-location-name").text(address[0]['address_name']);
             target.find(".cs-loader").fadeIn('slow');
             sil_ajax = customAjax($SITE_URL+'get/aptSilPolygon',
                       {
                         bjdongCd : address[0]['code'],
                       },
                       fillAptSilTab);

           }
        }
      });
    }

});

daum.maps.event.addListener(map, 'drag', function() {
    if(sil_ajax){
      sil_ajax.abort();
      sil_ajax = null;
    }
    needSilRefresh = false;
});

daum.maps.event.addListener(map, 'dragend', function() {
    needSilRefresh = true;
});

function sortByJibun(data){

  var cur_jibun =data[0]['지번'];
  var prev_jibun = cur_jibun;
  var sorted_data = {};
  $.each(data, function(index, value){
    var apt_name = value['지번'];
    if(index == 0){
      sorted_data[apt_name] = [];
    }
    cur_jibun = value['지번'];

    if(cur_jibun !== prev_jibun){
      var new_label = value['지번'];
      sorted_data[new_label] = [];
      prev_jibun = cur_jibun;
    }

    if(index === data.length - 1){

    }
    sorted_data[apt_name].push(value);
  });
  console.log(sorted_data);
  return sorted_data;
}

function fillAptSilTab(result){
  console.log(result);
  var target_dom = $(".raiz-sil-tab .raiz-side-tab-content li:visible");
  var li = '';

  if(result.length <= 0){
    //결과없음
    li += "<li>"
       +     "<h4> 결과 없음 </h4>"
       +  "</li>";
    target_dom.find(".cs-loader").fadeOut('slow');
  }
  else{
    var lists = sortByJibun(result);

    $.each(Object.keys(lists), function(index, key){

       li += "<li class=sil-result-item data-bunji=" + lists[key][0]['지번'] + ">"
          +     "<div class=sil-result-item-title>"
          +          "<p style=font-size:17px;font-weight=bold;>" + lists[key][0]['아파트']
          +             "<span class='' style=font-size:14px;float:none;>" + "(" + key + "번지)" + "</span>"
          +             "<span class=ti-arrow-down></span>"
          +          "</p>"
          +     "</div>";


       for(var i = lists[key].length - 1; i >= 0; i--){
         li +="<div class=sil-result-item-content style=display:none;>"
            +    "<div class=dropdown>"
            +       "<button class=btn btn-primary dropdown-toggle type=button data-toggle=dropdown>"
            +       "<span class=caret></span></button>"
            +       "<ul class=dropdown-menu>"
            +         "<li>HTML</li>"
            +       "</ul>"
            +     "</div>"
            // +   "<h5>"  + "거래날짜: "
            //           + lists[key][i]['년'] + "년 "
            //           + lists[key][i]['월'] + "월 "
            //           + lists[key][i]['일'] + "일"
            // +   "</h5>"
            // +   "<h5>"  + "전용면적: "
            //           + lists[key][i]['전용면적'] + "m<sup>2</sup>("
            //           + (lists[key][i]['전용면적']/3.3).toFixed(0) + "평, "
            //           + lists[key][i]['층'] + "층" + ")"
            // +   "</h5>"
            // +   "<h5>"  + "거래금액: "
            //           + price_format(lists[key][i]['거래금액'], '만원')
            // +   "</h5>"
            + "</div>";

       }

       li += "</li>";

       var point = parsePoint(lists[key][0]['point']);

       customAjax($SITE_URL+'get/singlePolygon',
                  { bjdongCd : currentCode, lat : point[0], lng : point[1] },
                  silActivity);
    });
  }


  target_dom.find(".sil-result-list").fadeOut(function(){

    target_dom.find(".sil-result-list li").remove();

    $(li).appendTo(target_dom.find(".sil-result-list"));
    target_dom.find(".sil-result-list li p").on("mouseover", function(e){
      var target = $(this).parent().parent();

      var polygons = $('.sil-apt-building-polygon');
      $.each( polygons, function(index, polygon) {

          var bunji = $(polygon).attr('data-bun') + ( ($(polygon).attr('data-ji') === '') ? '' : '-' + $(polygon).attr('data-ji') );

          if(target.attr('data-bunji') === bunji){
            $(polygon).addClass('sil-apt-building-polygon-hover');
          }

      });

      polygons = $('.sil-toji-polygon');
      $.each( polygons, function(index, polygon) {
          var polygon_bunji = $(polygon).attr('name').substr($(polygon).attr('name').length - 8);

          var bun = polygon_bunji.substr(0, 4);
          var ji = polygon_bunji.substr(polygon_bunji.length - 4);

          var bunji = bun + ji;

          var target_bun = target.attr('data-bunji').split('-')[0];
          var target_ji = (target.attr('data-bunji').split('-')[1] === undefined) ? '' : target.attr('data-bunji').split('-')[1];
          var target_bunji = lpad(target_bun, 4, 0)
                           + lpad(target_ji, 4, 0);

          if(polygon_bunji === target_bunji){
            $(polygon).addClass('sil-toji-polygon-hover');
          }

      });

      // $.each( sil_buildingPolygons, function(index, polygon) {
      //
      //     $.each(polygon.wc, function(index, polygon_attr){
      //
      //         var id = polygon_attr.id;
      //         var target_polygon = $("#" + id);
      //         var bunji = $(target_polygon).attr('data-bun') + ( ($(target_polygon).attr('data-ji') === '') ? '' : '-' + $(target_polygon).attr('data-ji') );
      //         if(target.attr('data-bunji') === bunji){
      //           daum.maps.event.trigger(polygon, 'mouseover');
      //           console.log(polygon);
      //         }
      //
      //     });
      //
      // });

    });

    target_dom.find(".sil-result-list li p").on("mouseout", function(e){

      var polygons = $('.sil-apt-building-polygon');
      $.each( polygons, function(index, polygon) {

          $(polygon).removeClass('sil-apt-building-polygon-hover');

      });

      polygons = $('.sil-toji-polygon');
      $.each( polygons, function(index, polygon) {

            $(polygon).removeClass('sil-toji-polygon-hover');

      });

    });
    target_dom.find(".sil-result-item-title").on("click", function(e){

      if( $(this).siblings().is(":visible")){
        $(this).find('.ti-arrow-up').removeClass('ti-arrow-up').addClass('ti-arrow-down');
      }
      else{
        $(this).find('.ti-arrow-down').removeClass('ti-arrow-down').addClass('ti-arrow-up');
      }

      $(this).siblings().toggle('fast', 'linear');

    });

    target_dom.find(".sil-result-list").fadeIn();
  });
  target_dom.find(".cs-loader").fadeOut('slow');

}
