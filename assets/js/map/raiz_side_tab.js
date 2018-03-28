$(".raiz-side-tab-list li").on('click', function(){
  var chosenDom = $(this);
  var chosenButtonText = $(this).text();
  var chosenIndex = $(this).attr('data-index');

  if($(this).find('span').hasClass('ti-angle-down')){
    chosenDom.siblings().not(this).hide("drop", {direction : "down"}, 100);
    chosenDom.find('span').removeClass('ti-angle-down').addClass('ti-angle-up');
    $(".side-tab-header:visible").children().first().after('&nbsp;' + "<span class='ti-angle-right' style=font-size:13px;> " + chosenButtonText.trim() + "</span>");

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
        // alert('키워드를 입력해주세요!');
        toaster('키워드를 입력해주세요!', 'error');
        return false;
    }

    ps.keywordSearch( q, fillKeywordResult );

});

function fillKeywordResult(data, status, pagination){
    var item = '';

    if (status === daum.maps.services.Status.OK) {
        currentCode = data[0]['code'];

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

        toaster('검색 결과가 존재하지 않습니다', 'error');


    } else if (status === daum.maps.services.Status.ERROR) {

        toaster('검색 결과 중 오류가 발생했습니다', 'error');
    }
}

var jibun_history = [];
$( "#jibun-input" ).on("focus change keyup",  function(e) {

  e.preventDefault();

  delay(function(){
      var q = $( '#jibun-input' ).val();

      if(q === ''){
        //show history

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
        toastr["info"]("I was launched via jQuery!");
        toaster('지번을 입력해주세요!', 'error');
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

        toaster('검색 결과가 존재하지 않습니다', 'error');


    } else if (status === daum.maps.services.Status.ERROR) {

        toaster('검색 결과 중 오류가 발생했습니다', 'error');
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

/*************************** 실거래 ********************************/

//주소 초기화
geocoder.coord2RegionCode(map.getCenter().getLng(), map.getCenter().getLat(), function(data, status){

    if (status === daum.maps.services.Status.OK) {

        $(".sil-location-name, .junwal-location-name").text(data[0]['address_name']);

    }

});

$(".raiz-sil-tab .raiz-side-tab-list > li").on('click', function(e){

    console.log($(this).attr('id'));
    daum.maps.event.trigger(map, 'idle');

});


daum.maps.event.addListener(map, 'idle', function() {

    //find which sil tab is open!
    var target = $(".raiz-sil-tab .raiz-side-tab-content li:visible");
    if(target.attr('id') === undefined) return false;

    if(map.getLevel() > 4){
        target.find(".sil-result-list li").remove();

        $.each(sil_buildingPolygons, function(index, polygon){
          polygon.setMap(null);
          sil_buildingPolygons = [];
        });

        $.each(sil_landPolygons, function(index, polygon){
          polygon.setMap(null);
          sil_landPolygons = [];
        });
        removeOverlay();
        target.find(".sil-result-list").append('<li>조금만 확대해주세요^^;;</li>');
        needSilRefresh = false;
        return;
    }
    else{
      if(!needSilRefresh){
        needSilRefresh = true;
        // sil_currentCode = null;
        daum.maps.event.trigger(map, 'idle');
        return;
      }

    }



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


         if(currentSilTab !== target.attr('id')){
           needSilRefresh = true;
           currentSilTab = target.attr('id');
         }
         console.log(needSilRefresh);
         if(needSilRefresh){

           removePolygons();
           removeOverlay();

           target.find(".sil-location-name").text(address[0]['address_name']);
           target.find(".cs-loader").fadeIn('slow');
           var request_name, callback_function;

           if(target.attr('id') === 'apt-sil'){
             request_name = 'aptSilPolygon';
           }
           else if(target.attr('id') === 'rhouse-sil'){
             request_name = 'rhouseSilPolygon';
           }
           else if(target.attr('id') === 'store-sil'){
             request_name = 'storeSilPolygon';
           }
           else if(target.attr('id') === 'toji-sil'){
             request_name = 'tojiSilPolygon';
           }

           var target_dom = $(".raiz-sil-tab .raiz-side-tab-content li:visible");

           var filter_type = target_dom.find(".sil-filter-content .sil-filter-dropdown .btn").attr('data-type');
           var filter_value = target_dom.find(".sil-filter-content .sil-filter-dropdown .btn").val();

           filter_type = ( filter_type === undefined ) ? 'year' : filter_type;
           filter_value = ( filter_value === '' ) ? '1' : filter_value;

           console.log(filter_type, filter_value);

           sil_ajax = customAjax($SITE_URL+'get/' + request_name,
                     {
                       bjdongCd : address[0]['code'],
                       filter_type : filter_type,
                       filter_value : filter_value
                     },
                     fillSilTab);

         }
      }
    });

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

function fillSilTab(result){
  console.log('here!', result);
  var target_dom = $(".raiz-sil-tab .raiz-side-tab-content li:visible");
  var li = '';
  var target_sil_type = $(".raiz-sil-tab .raiz-side-tab-content li:visible").attr('id');

  var request_name = 'aptSilPolygon';

  if(target_sil_type === 'apt-sil'){
    request_name = 'aptSilPolygon';
  }
  else if(target_sil_type === 'rhouse-sil'){
    request_name = 'rhouseSilPolygon';
  }
  else if(target_sil_type === 'store-sil'){
    request_name = 'storeSilPolygon';
  }
  else if(target_sil_type === 'toji-sil'){
    request_name = 'tojiSilPolygon';
  }

  if(result.length <= 0){
    //결과없음
    target_dom.find(".sil-result-list li").remove();
    li += "<li>"
       +     "<h4> 결과 없음 </h4>"
       +  "</li>";

    $(li).appendTo(target_dom.find(".sil-result-list"));
    target_dom.find(".sil-filter-dropdown .filter-search-btn .rotating").removeClass('rotating');
    target_dom.find(".cs-loader").fadeOut('slow');
  }
  else{
    $.each(result, function(index, key){

       li += "<li class=sil-result-item data-sigunguCd=" + key['지역코드'] + " data-bjdongCd=" + key['법정동코드'] + " data-bunji=" + key['지번'] + ">"
          +     "<div class=sil-result-item-title>";
          if(currentSilTab === 'apt-sil' || currentSilTab === 'rhouse-sil'){
            li +=   "<p style=font-size:17px;font-weight=bold;>" + key['이름']
               +        "<span class='' style=font-size:14px;float:none;>" + "(" + key['지번'] + "번지)" + "</span>"
               +        "<span class=ti-arrow-down></span>"
               +    "</p>";
          }
          else{
            li +=   "<p style=font-size:17px;font-weight=bold;>" + key['지번'] + "번지"
               +        "<span class=ti-arrow-down></span>"
               +    "</p>";
          }

       li +=    "</div>"
          + "</li>";

    // var lists = sortByJibun(result);

    // $.each(Object.keys(lists), function(index, key){
    //
    //    li += "<li class=sil-result-item data-bunji=" + lists[key][0]['지번'] + ">"
    //       +     "<div class=sil-result-item-title>";
    //       if(currentSilTab === 'apt-sil' || currentSilTab === 'rhouse-sil'){
    //         li +=   "<p style=font-size:17px;font-weight=bold;>" + lists[key][0]['이름']
    //            +        "<span class='' style=font-size:14px;float:none;>" + "(" + key + "번지)" + "</span>"
    //            +        "<span class=ti-arrow-down></span>"
    //            +    "</p>";
    //       }
    //       else{
    //         li +=   "<p style=font-size:17px;font-weight=bold;>" + key + "번지"
    //            +        "<span class=ti-arrow-down></span>"
    //            +    "</p>";
    //       }
    //
    //    li +=    "</div>";
    //
    //
    //    li +=  "<div class=sil-result-item-content style=display:none;>"
    //       +     "<div class=sil-dropdown>"
    //       +        "<button class=btn btn-primary dropdown-toggle type=button data-toggle=dropdown>" + "평형 선택"
    //       +        "<span class=caret></span></button>"
    //       +        "<ul class='dropdown-menu sil-dropdown-menu'>";
    //
    //    var area_dup_check = [];
    //    for(var i = lists[key].length - 1; i >= 0; i--){
    //
    //       if( jQuery.inArray(lists[key][i]['전용면적'], area_dup_check) === -1 ){
    //           area_dup_check.push(lists[key][i]['전용면적']);
    //           li += "<li name="+ lists[key][i]['지번']
    //                 + " data-area=" + lists[key][i]['전용면적'] + ">"
    //                 + lists[key][i]['전용면적'] + "m<sup>2</sup>("
    //                        + (lists[key][i]['전용면적']*.3025).toFixed(0) + "평)";
    //       }
    //
    //    }
    //    li +=      "</ul>"
    //       +    "</div>"; //end of dropdown
    //
    //    //chart graph
    //    li += "<canvas class=sil-chart width=300 height=300 style=display:none;></canvas>";
    //    li += "</li>";
    //
    //    try{
    //       var point = parsePoint(lists[key][0]['point']);
    //    }catch(e){
    //       return true;
    //    }
    //
    //
    //    // $.when(
    //    //   customAjax($SITE_URL+'get/singlePolygon',
    //    //              { bjdongCd : currentCode, lat : point[0], lng : point[1] },
    //    //              silActivity)
    //    // ).done(function(result){
    //    //    completeOverlay(currentSilTab, point, lists[key]);
    //    //
    //    // });
    });
  }


  target_dom.find(".sil-filter-dropdown-menu li").on("click", function(e){
    $(this).parent().siblings('.btn').text($(this).text())
                                     .attr('data-type', $(this).attr('data-type'))
                                     .val($(this).val());
  });


  target_dom.find(".sil-filter-dropdown .filter-search-btn .ti-reload").unbind("click").on("click", function(e){

    // console.log($(this).parent().parent().parent().attr('id'));
    var target_sil_type = $(this).parent().parent().parent().attr('id');
    var filter_type = $(this).parent().siblings('button').attr('data-type');
    var filter_value = $(this).parent().siblings('button').val();

    if(target_sil_type === 'apt-sil'){
      request_name = 'aptSilPolygon';
    }
    else if(target_sil_type === 'rhouse-sil'){
      request_name = 'rhouseSilPolygon';
    }
    else if(target_sil_type === 'store-sil'){
      request_name = 'storeSilPolygon';
    }
    else if(target_sil_type === 'toji-sil'){
      request_name = 'tojiSilPolygon';
    }

    $(this).addClass("rotating");
    sil_ajax = customAjax($SITE_URL+'get/' + request_name,
              {
                bjdongCd : currentCode,
                filter_type : filter_type,
                filter_value : filter_value
              },
              fillSilTab);

  });

  target_dom.find(".sil-result-list").fadeOut(function(){

    target_dom.find(".sil-result-list li").remove();

    $(li).appendTo(target_dom.find(".sil-result-list"));
    target_dom.find(".sil-result-list .sil-result-item").on("click", function(e){
      console.log('clicked');
      var clicked_item = $(this);

      if( clicked_item.next().hasClass('sil-result-item-content') ){

        if( clicked_item.next().is(":visible") ) {
          console.log(clicked_item.children().children().children());
          clicked_item.children().children().find('.ti-arrow-down').removeClass('ti-arrow-down').addClass('ti-arrow-up');
        }
        else{
          // clicked_item.children().children().children().find('.ti-arrow-up').removeClass('ti-arrow-up').addClass('ti-arrow-down');
        }
        $(this).find('.ti-arrow-up').removeClass('ti-arrow-up').addClass('ti-arrow-down');
        $(this).next().toggle('fast', 'linear');
        return false;
      }
      // else{
      //   $(this).find('.ti-arrow-down').removeClass('ti-arrow-down').addClass('ti-arrow-up');
      //   $(this).children().siblings().show('fast', 'linear');
      // }



      var bunji = $(this).attr('data-bunji');

      if(target_sil_type === 'apt-sil'){
        request_name = 'aptSil';
      }
      else if(target_sil_type === 'rhouse-sil'){
        request_name = 'rhouseSil';
      }
      else if(target_sil_type === 'store-sil'){
        request_name = 'storeSil';
      }
      else if(target_sil_type === 'toji-sil'){
        request_name = 'tojiSil';
      }

      var filter_type = $('#' + target_sil_type + '-filter .sil-filter-dropdown button').attr('data-type');
      var filter_value = $('#' + target_sil_type + '-filter .sil-filter-dropdown button').val();

      sil_ajax = customAjax($SITE_URL+'get/' + request_name,
                {
                  bjdongCd : currentCode,
                  bunji : bunji,
                  filter_type : filter_type,
                  filter_value : filter_value
                },
                function(list){
                  console.log(list);

                  //일단 전용면적 선택버튼. canvas 먼저 부착해볼까
                  var containment = "<div class=sil-result-item-content></div>";

                  var chart = "<canvas class=sil-chart width=300 height=300 style=display:none;></canvas>";
                  var dropbox = "<div class=sil-dropdown>"
                              +     "<button class=btn btn-primary dropdown-toggle type=button data-toggle=dropdown>"
                              +        "평형 선택" + "<span class=caret></span>"
                              +     "</button>"
                              +     "<ul class='dropdown-menu sil-dropdown-menu'>";
                  var area_dup_check = [];
                  for(var i = 0; i < list.length; ++i){

                      if( jQuery.inArray(list[i]['전용면적'], area_dup_check) === -1 ){
                          area_dup_check.push(list[i]['전용면적']);
                          dropbox += "<li name="+ list[i]['지번']
                                  + " data-area=" + list[i]['전용면적'] + ">"
                                  + list[i]['전용면적'] + "m<sup>2</sup>("
                                  + (list[i]['전용면적']*.3025).toFixed(0) + "평)"
                                  +   "</li>";
                      }

                  }

                  dropbox += "</ul>" + "</div>";

                  clicked_item.after(containment);
                  clicked_item.parent().find('.sil-result-item-content').append($(dropbox + chart));


                  target_dom.find(".sil-dropdown-menu li").on("click", function(e){

                      $(this).parent().siblings('.btn').text($(this).text());
                      // var target_index = $(this).attr('name');
                      var target_area = $(this).attr('data-area');

                      var data_object = {};
                      for(var i = 0; i < list.length; i++){
                        // console.log(lists[target_index][i]);
                        if(list[i]['전용면적'] === target_area){
                          // console.log(i);

                          var date = list[i]['년'] + '/' + list[i]['월'];

                          if(data_object[ date ] === undefined){
                              data_object[ date ] = [];
                              data_object[ date ].push(list[i]['거래금액']);
                          }
                          else{
                              data_object[ date ].push(list[i]['거래금액']);
                          }

                        }
                      }

                      var data = [];
                      $.each(Object.keys(data_object), function(index, key){
                        var sum = 0;
                        for(var i = 0; i < data_object[key].length; ++i){
                          sum += data_object[key][i]*1;
                        }

                        data.push( (sum / data_object[key].length).toFixed(0) );
                      });

                      var ctx = $(this).parent().parent().parent().find('.sil-chart')[0].getContext('2d');
                      //beginning of chart
                      var sil_chart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: Object.keys(data_object),
                            datasets: [{
                                label: '실거래가',
                                data: data,
                                backgroundColor: '#41c980',
                                borderColor: '#41c980',
                                fill: false,
                                borderWidth: 1
                            }]
                        },
                        options: {
                            layout: {
                              padding : {
                                top: 30,
                                left: 20
                              }
                            },
                            legend: {
                              display: false
                            },
                            responsive: true,
                            hover: {
                              mode: false,
                              intersect: false
                            },
                            tooltips: {
                              callbacks: {
                                   label: function(tooltipItem, data) {
                                       return price_format(tooltipItem.yLabel, '만원').replace('원', '');
                                   },
                               }
                            },
                            scales: {
                                yAxes: [{
                                  ticks: {
                                      fontSize: 12,
                                      beginAtZero: false,
                                      padding: 0,
                                      userCallback: function(value, index, values) {
                                          if (value == 0)
                                              return "0원";
                                          else
                                              return price_format(value.toFixed(0), '만원').replace('원', '');
                                      }
                                  }
                                }]
                            },
                            animation: {
                              onComplete: function(e){
                                var ctx = this.chart.ctx;
                                ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, 'normal', Chart.defaults.global.defaultFontFamily);
                                ctx.fillStyle = this.chart.config.options.defaultFontColor;
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';

                                this.data.datasets.forEach(function (dataset) {
                                  // console.log(dataset);
                                  var percentage = [];
                                  for(var i = 1; i < dataset['data'].length; ++i){
                                    percentage.push( (dataset['data'][i] - dataset['data'][i-1])/dataset['data'][i-1] * 100 );
                                  }
                                    var index = Object.keys(dataset['_meta']);
                                    var points = dataset['_meta'][index]['dataset']['_children'];
                                    for(var i = 1; i < points.length; ++i){
                                      var x = points[i]['_view']['x'];
                                      var y = points[i]['_view']['y'];
                                      if(percentage[i-1] > 0) {
                                        ctx.fillText('+' + percentage[i-1].toFixed(1) + '%', x, y);
                                      }
                                      else{
                                        ctx.fillText(percentage[i-1].toFixed(1) + '%', x, y);
                                      }
                                    }
                                });
                              }
                            }
                        }
                      });

                      //end of chart
                      var canvas = $(this).parent().parent().parent().find('.sil-chart');
                      canvas.show('normal');

                      //show content
                      var li = '';
                      for(var i = list.length - 1; i >= 0; i--){
                        if( list[i]['전용면적'] === target_area ){

                          li +=   "<h5>"  + "거래날짜: "
                                       + list[i]['년'] + "년 "
                                       + list[i]['월'] + "월 "
                                       + list[i]['일'] + "일"
                             +   "</h5>"
                             +   "<h5>"  + "전용면적: "
                                       + list[i]['전용면적'] + "m<sup>2</sup>("
                                       + (list[i]['전용면적']*.3025).toFixed(0) + "평";
                                 if(currentSilTab == 'apt-sil' || currentSilTab === 'rhouse-sil'){
                                   li += ", " + list[i]['층'] + "층";
                                 }
                          li +=         ")";
                          li +=   "</h5>"
                             +   "<h5>"  + "거래금액: "
                                       + price_format(list[i]['거래금액'], '만원')
                             +   "</h5>";

                        }
                      }


                      $(this).parent().parent().next().after($(li).show());

                      // $(this).parent().parent().parent().find('.sil-result-item-content').remove();
                      // $(li).appendTo($(this).parent().parent().parent()).show();
                      // target_dom.find(".sil-result-item-title").on("click", function(e){
                      //
                      //   if( $(this).siblings().is(":visible")){
                      //     $(this).find('.ti-arrow-up').removeClass('ti-arrow-up').addClass('ti-arrow-down');
                      //   }
                      //   else{
                      //     $(this).find('.ti-arrow-down').removeClass('ti-arrow-down').addClass('ti-arrow-up');
                      //   }
                      //
                      //   $(this).siblings().toggle('fast', 'linear');
                      //
                      // });
                  });
                });

    });

    target_dom.find(".sil-result-list").fadeIn();


    //this is where chart is dyanmially created triggered by dropdown
    // target_dom.find(".sil-dropdown-menu li").on("click", function(e){
    //
    //     $(this).parent().siblings('.btn').text($(this).text());
    //     var target_index = $(this).attr('name');
    //     var target_area = $(this).attr('data-area');
    //
    //
    //     var data_object = {};
    //     for(var i = 0; i < lists[target_index].length; i++){
    //       // console.log(lists[target_index][i]);
    //       if(lists[target_index][i]['전용면적'] === target_area){
    //         // console.log(i);
    //
    //         var date = lists[target_index][i]['년'] + '/' + lists[target_index][i]['월'];
    //
    //         if(data_object[ date ] === undefined){
    //             data_object[ date ] = [];
    //             data_object[ date ].push(lists[target_index][i]['거래금액']);
    //         }
    //         else{
    //             data_object[ date ].push(lists[target_index][i]['거래금액']);
    //         }
    //
    //       }
    //     }
    //
    //     var data = [];
    //     $.each(Object.keys(data_object), function(index, key){
    //       var sum = 0;
    //       for(var i = 0; i < data_object[key].length; ++i){
    //         sum += data_object[key][i]*1;
    //       }
    //
    //       data.push( (sum / data_object[key].length).toFixed(0) );
    //     });
    //
    //     var ctx = $(this).parent().parent().parent().find('.sil-chart')[0].getContext('2d');
    //     //beginning of chart
    //     var sil_chart = new Chart(ctx, {
    //       type: 'line',
    //       data: {
    //           labels: Object.keys(data_object),
    //           datasets: [{
    //               label: '실거래가',
    //               data: data,
    //               backgroundColor: '#41c980',
    //               borderColor: '#41c980',
    //               fill: false,
    //               borderWidth: 1
    //           }]
    //       },
    //       options: {
    //           layout: {
    //             padding : {
    //               top: 30,
    //               left: 20
    //             }
    //           },
    //           legend: {
    //             display: false
    //           },
    //           responsive: true,
    //           hover: {
    //             mode: false,
    //             intersect: false
    //           },
    //           tooltips: {
    //             callbacks: {
    //                  label: function(tooltipItem, data) {
    //                      return price_format(tooltipItem.yLabel, '만원').replace('원', '');
    //                  },
    //              }
    //           },
    //           scales: {
    //               yAxes: [{
    //                 ticks: {
    //                     fontSize: 12,
    //                     beginAtZero: false,
    //                     padding: 0,
    //                     userCallback: function(value, index, values) {
    //                         if (value == 0)
    //                             return "0원";
    //                         else
    //                             return price_format(value.toFixed(0), '만원').replace('원', '');
    //                     }
    //                 }
    //               }]
    //           },
    //           animation: {
    //             onComplete: function(e){
    //               var ctx = this.chart.ctx;
    //               ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, 'normal', Chart.defaults.global.defaultFontFamily);
    //               ctx.fillStyle = this.chart.config.options.defaultFontColor;
    //               ctx.textAlign = 'center';
    //               ctx.textBaseline = 'bottom';
    //
    //               this.data.datasets.forEach(function (dataset) {
    //                 // console.log(dataset);
    //                 var percentage = [];
    //                 for(var i = 1; i < dataset['data'].length; ++i){
    //                   percentage.push( (dataset['data'][i] - dataset['data'][i-1])/dataset['data'][i-1] * 100 );
    //                 }
    //                   var index = Object.keys(dataset['_meta']);
    //                   var points = dataset['_meta'][index]['dataset']['_children'];
    //                   for(var i = 1; i < points.length; ++i){
    //                     var x = points[i]['_view']['x'];
    //                     var y = points[i]['_view']['y'];
    //                     if(percentage[i-1] > 0) {
    //                       ctx.fillText('+' + percentage[i-1].toFixed(1) + '%', x, y);
    //                     }
    //                     else{
    //                       ctx.fillText(percentage[i-1].toFixed(1) + '%', x, y);
    //                     }
    //                   }
    //               });
    //             }
    //           }
    //       }
    //     });
    //
    //     //end of chart
    //     var canvas = $(this).parent().parent().parent().find('.sil-chart');
    //     canvas.show('normal');
    //
    //     //show content
    //     var li = '';
    //     for(var i = lists[target_index].length - 1; i >= 0; i--){
    //       if( lists[target_index][i]['전용면적'] === target_area ){
    //         li +="<div class=sil-result-item-content style=display:none;>"
    //            +   "<h5>"  + "거래날짜: "
    //                      + lists[target_index][i]['년'] + "년 "
    //                      + lists[target_index][i]['월'] + "월 "
    //                      + lists[target_index][i]['일'] + "일"
    //            +   "</h5>"
    //            +   "<h5>"  + "전용면적: "
    //                      + lists[target_index][i]['전용면적'] + "m<sup>2</sup>("
    //                      + (lists[target_index][i]['전용면적']*.3025).toFixed(0) + "평";
    //                if(currentSilTab == 'apt-sil' || currentSilTab === 'rhouse-sil'){
    //                  li += ", " + lists[target_index][i]['층'] + "층";
    //                }
    //         li +=         ")";
    //         li +=   "</h5>"
    //            +   "<h5>"  + "거래금액: "
    //                      + price_format(lists[target_index][i]['거래금액'], '만원')
    //            +   "</h5>"
    //            + "</div>";
    //       }
    //     }
    //
    //     $(this).parent().parent().parent().find('.sil-result-item-content').remove();
    //     $(li).appendTo($(this).parent().parent().parent()).show();
    // });
    //
    // target_dom.find(".sil-result-list li p").on("mouseover", function(e){
    //   var target = $(this).parent().parent();
    //
    //   if(currentSilTab === 'apt-sil'){
    //     class_name = 'sil-apt-building-polygon';
    //   }
    //   else if(currentSilTab === 'rhouse-sil'){
    //     class_name = 'sil-rhouse-building-polygon';
    //
    //   }
    //   else if(currentSilTab === 'store-sil') {
    //     class_name = 'sil-store-building-polygon';
    //   }
    //   else if(currentSilTab === 'toji-sil'){
    //     class_name = 'sil-toji-building-polygon';
    //   }
    //
    //   var polygons = $('.'+class_name);
    //
    //   $.each( polygons, function(index, polygon) {
    //
    //       var bunji = $(polygon).attr('data-bun') + ( ($(polygon).attr('data-ji') === '') ? '' : '-' + $(polygon).attr('data-ji') );
    //
    //       if(target.attr('data-bunji') === bunji){
    //           $(polygon).addClass(class_name+ '-hover');
    //       }
    //
    //   });
    //
    //   polygons = $('.sil-toji-polygon');
    //   $.each( polygons, function(index, polygon) {
    //       var polygon_bunji = $(polygon).attr('name').substr($(polygon).attr('name').length - 8);
    //
    //       var bun = polygon_bunji.substr(0, 4);
    //       var ji = polygon_bunji.substr(polygon_bunji.length - 4);
    //
    //       var bunji = bun + ji;
    //
    //       var target_bun = target.attr('data-bunji').split('-')[0];
    //       var target_ji = (target.attr('data-bunji').split('-')[1] === undefined) ? '' : target.attr('data-bunji').split('-')[1];
    //       var target_bunji = lpad(target_bun, 4, 0)
    //                        + lpad(target_ji, 4, 0);
    //
    //       if(polygon_bunji === target_bunji){
    //         $(polygon).addClass('sil-toji-polygon-hover');
    //       }
    //
    //   });
    //
    // });
    //
    // target_dom.find(".sil-result-list li p").on("mouseout", function(e){
    //
    //   if(currentSilTab === 'apt-sil'){
    //     class_name = 'sil-apt-building-polygon';
    //   }
    //   else if(currentSilTab === 'rhouse-sil'){
    //     class_name = 'sil-rhouse-building-polygon';
    //
    //   }
    //   else if(currentSilTab === 'store-sil') {
    //     class_name = 'sil-store-building-polygon';
    //   }
    //   else if(currentSilTab === 'toji-sil'){
    //     class_name = 'sil-toji-building-polygon';
    //   }
    //
    //   var polygons = $('.'+class_name);
    //
    //   $.each( polygons, function(index, polygon) {
    //
    //       $(polygon).removeClass(class_name + '-hover');
    //
    //   });
    //
    //   polygons = $('.sil-toji-polygon');
    //   $.each( polygons, function(index, polygon) {
    //
    //         $(polygon).removeClass('sil-toji-polygon-hover');
    //
    //   });
    //
    // });
    // target_dom.find(".sil-result-item-title").on("click", function(e){
    //
    //   if( $(this).siblings().is(":visible")){
    //     $(this).find('.ti-arrow-up').removeClass('ti-arrow-up').addClass('ti-arrow-down');
    //   }
    //   else{
    //     $(this).find('.ti-arrow-down').removeClass('ti-arrow-down').addClass('ti-arrow-up');
    //   }
    //
    //   $(this).siblings().toggle('fast', 'linear');
    //
    // });
    //
    // target_dom.find(".sil-result-list").fadeIn();
  });

  target_dom.find(".sil-filter-dropdown .filter-search-btn .rotating").removeClass('rotating');
  target_dom.find(".cs-loader").fadeOut('slow');

}

// 전월세

$(".raiz-junwal-tab .raiz-side-tab-list > li").on('click', function(e){
    daum.maps.event.trigger(map, 'idle');
});

daum.maps.event.addListener(map, 'idle', function() {

    //find which sil tab is open!
    var target = $(".raiz-junwal-tab .raiz-side-tab-content li:visible");
    if(target.attr('id') === undefined) return false;
    console.log(target.attr('id'));
    if(map.getLevel() > 4){
        target.find(".junwal-result-list li").remove();

        $.each(junwal_buildingPolygons, function(index, polygon){
          polygon.setMap(null);
          junwal_buildingPolygons = [];
        });

        $.each(junwal_landPolygons, function(index, polygon){
          polygon.setMap(null);
          junwal_landPolygons = [];
        });

        target.find(".junwal-result-list").append('<li>조금만 확대해주세요^^;;</li>');
        needSilRefresh = false;
        return;
    }
    else{
      if(!needJunwalRefresh){
        needJunwalRefresh = true;
        // junwal_currentCode = null;
        daum.maps.event.trigger(map, 'idle');
        return;
      }

    }



    geocoder.coord2RegionCode(map.getCenter().getLng(), map.getCenter().getLat(), function(address, status){
      if (status === daum.maps.services.Status.OK) {
         if(junwal_currentCode === currentCode){
           if(junwal_currentCode === undefined) needJunwalRefresh = true;
           else needJunwalRefresh = false;

         }
         else{
           junwal_currentCode = address[0]['code'];
           needJunwalRefresh = true;
         }


         if(currentJunwalTab !== target.attr('id')){
           needJunwalRefresh = true;
           currentJunwalTab = target.attr('id');
         }

         if(needJunwalRefresh){

           removePolygons();
           removeOverlay();

           target.find(".junwal-location-name").text(address[0]['address_name']);
           target.find(".cs-loader").fadeIn('slow');
           var request_name, callback_function;

           if(target.attr('id') === 'apt-junwal'){
             request_name = 'aptJunwalPolygon';
           }
           else if(target.attr('id') === 'rhouse-junwal'){
             request_name = 'rhouseJunwalPolygon';
           }
           else if(target.attr('id') === 'store-junwal'){
             request_name = 'storeJunwalPolygon';
           }

           var target_dom = $(".raiz-junwal-tab .raiz-side-tab-content li:visible");

           var filter_type = target_dom.find(".junwal-filter-content .junwal-filter-dropdown .btn").attr('data-type');
           var filter_value = target_dom.find(".junwal-filter-content .junwal-filter-dropdown .btn").val();

           filter_type = ( filter_type === undefined ) ? 'year' : filter_type;
           filter_value = ( filter_value === '' ) ? '1' : filter_value;

           console.log(filter_type, filter_value);

           junwal_ajax = customAjax($SITE_URL+'get/' + request_name,
                     {
                       bjdongCd : address[0]['code'],
                       filter_type : filter_type,
                       filter_value : filter_value
                     },
                     fillJunwalTab);

         }
      }
    });

});

daum.maps.event.addListener(map, 'drag', function() {
    if(junwal_ajax){
      junwal_ajax.abort();
      junwal_ajax = null;
    }
    needJunwalRefresh = false;
});

daum.maps.event.addListener(map, 'dragend', function() {
    needJunwalRefresh = true;
});

function fillJunwalTab(result){
    console.log(result);

    var target_dom = $(".raiz-junwal-tab .raiz-side-tab-content li:visible");
    var li = '';

    if(result.length <= 0){
      //결과없음
      target_dom.find(".junwal-result-list li").remove();
      li += "<li>"
         +     "<h4> 결과 없음 </h4>"
         +  "</li>";

      $(li).appendTo(target_dom.find(".junwal-result-list"));
      target_dom.find(".junwal-filter-dropdown .filter-search-btn .rotating").removeClass('rotating');
      target_dom.find(".cs-loader").fadeOut('slow');
    }
    else{

      var lists = sortByJibun(result);

      $.each(Object.keys(lists), function(index, key){

         li += "<li class=junwal-result-item data-bunji=" + lists[key][0]['지번'] + ">"
            +     "<div class=junwal-result-item-title>";
            if(currentJunwalTab === 'apt-junwal' || currentJunwalTab === 'rhouse-junwal'){
              li +=   "<p style=font-size:17px;font-weight=bold;>" + lists[key][0]['이름']
                 +        "<span class='' style=font-size:14px;float:none;>" + "(" + key + "번지)" + "</span>"
                 +        "<span class=ti-arrow-down></span>"
                 +    "</p>";
            }
            else{
              li +=   "<p style=font-size:17px;font-weight=bold;>" + key + "번지"
                 +        "<span class=ti-arrow-down></span>"
                 +    "</p>";
            }

         li +=    "</div>";


         li +=  "<div class=junwal-result-item-content style=display:none;>"
            +     "<div class=junwal-dropdown>"
            +        "<button class=btn btn-primary dropdown-toggle type=button data-toggle=dropdown>" + "평형 선택"
            +        "<span class=caret></span></button>"
            +        "<ul class='dropdown-menu junwal-dropdown-menu'>";

         var area_dup_check = [];
         for(var i = lists[key].length - 1; i >= 0; i--){

            if( jQuery.inArray(lists[key][i]['전용면적'], area_dup_check) === -1 ){
                area_dup_check.push(lists[key][i]['전용면적']);
                li += "<li name="+ lists[key][i]['지번']
                      + " data-area=" + lists[key][i]['전용면적'] + ">"
                      + lists[key][i]['전용면적'] + "m<sup>2</sup>("
                             + (lists[key][i]['전용면적']*0.3025).toFixed(0) + "평)";
            }

         }
         li +=      "</ul>"
            +    "</div>"; //end of dropdown

         //chart graph
         li += "<canvas class=junwal-chart width=300 height=300 style=display:none;></canvas>";
         li += "</li>";

         try{
            var point = parsePoint(lists[key][0]['point']);
         }catch(e){
            return true;
         }

         $.when(
           customAjax($SITE_URL+'get/singlePolygon',
                      { bjdongCd : currentCode, lat : point[0], lng : point[1] },
                      junwalActivity)
         ).done(function(result){
            completeOverlay(currentJunwalTab, point, lists[key]);
         });
      });
    }

    target_dom.find(".junwal-filter-dropdown-menu li").on("click", function(e){
      $(this).parent().siblings('.btn').text($(this).text())
                                       .attr('data-type', $(this).attr('data-type'))
                                       .val($(this).val());
    });

    target_dom.find(".junwal-filter-dropdown .filter-search-btn .ti-reload").unbind("click").on("click", function(e){

      console.log($(this).parent().parent().parent().attr('id'));
      var target_junwal_type = $(this).parent().parent().parent().attr('id');
      var filter_type = $(this).parent().siblings('button').attr('data-type');
      var filter_value = $(this).parent().siblings('button').val();

      if(target_junwal_type === 'apt-junwal-filter'){
        request_name = 'aptJunwalPolygon';
      }
      else if(target_junwal_type === 'rhouse-junwal-filter'){
        request_name = 'rhouseJunwalPolygon';
      }
      else if(target_junwal_type === 'store-junwal-filter'){
        request_name = 'storeJunwalPolygon';
      }

      $(this).addClass("rotating");
      junwal_ajax = customAjax($SITE_URL+'get/' + request_name,
                {
                  bjdongCd : currentCode,
                  filter_type : filter_type,
                  filter_value : filter_value
                },
                fillJunwalTab);

    });

    target_dom.find(".junwal-result-list").fadeOut(function(){

      target_dom.find(".junwal-result-list li").remove();

      $(li).appendTo(target_dom.find(".junwal-result-list"));

      //this is where chart is dyanmially created triggered by dropdown
      target_dom.find(".junwal-dropdown-menu li").on("click", function(e){

          $(this).parent().siblings('.btn').text($(this).text());
          var target_index = $(this).attr('name');
          var target_area = $(this).attr('data-area');
          //
          //
          // var data_object = {};
          // for(var i = 0; i < lists[target_index].length; i++){
          //   // console.log(lists[target_index][i]);
          //   if(lists[target_index][i]['전용면적'] === target_area){
          //     // console.log(i);
          //
          //     var date = lists[target_index][i]['년'] + '/' + lists[target_index][i]['월'];
          //
          //     if(data_object[ date ] === undefined){
          //         data_object[ date ] = [];
          //         data_object[ date ].push(lists[target_index][i]['거래금액']);
          //     }
          //     else{
          //         data_object[ date ].push(lists[target_index][i]['거래금액']);
          //     }
          //
          //   }
          // }
          //
          // var data = [];
          // $.each(Object.keys(data_object), function(index, key){
          //   var sum = 0;
          //   for(var i = 0; i < data_object[key].length; ++i){
          //     sum += data_object[key][i]*1;
          //   }
          //
          //   data.push( (sum / data_object[key].length).toFixed(0) );
          // });
          //
          // var ctx = $(this).parent().parent().parent().find('.junwal-chart')[0].getContext('2d');
          // //beginning of chart
          // var junwal_chart = new Chart(ctx, {
          //   type: 'line',
          //   data: {
          //       labels: Object.keys(data_object),
          //       datasets: [{
          //           label: '실거래가',
          //           data: data,
          //           backgroundColor: '#41c980',
          //           borderColor: '#41c980',
          //           fill: false,
          //           borderWidth: 1
          //       }]
          //   },
          //   options: {
          //       layout: {
          //         padding : {
          //           top: 30,
          //           left: 20
          //         }
          //       },
          //       legend: {
          //         display: false
          //       },
          //       responsive: true,
          //       hover: {
          //         mode: false,
          //         intersect: false
          //       },
          //       tooltips: {
          //         callbacks: {
          //              label: function(tooltipItem, data) {
          //                  return price_format(tooltipItem.yLabel, '만원').replace('원', '');
          //              },
          //          }
          //       },
          //       scales: {
          //           yAxes: [{
          //             ticks: {
          //                 fontSize: 12,
          //                 beginAtZero: false,
          //                 padding: 0,
          //                 userCallback: function(value, index, values) {
          //                     if (value == 0)
          //                         return "0원";
          //                     else
          //                         return price_format(value.toFixed(0), '만원').replace('원', '');
          //                 }
          //             }
          //           }]
          //       },
          //       animation: {
          //         onComplete: function(e){
          //           var ctx = this.chart.ctx;
          //           ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, 'normal', Chart.defaults.global.defaultFontFamily);
          //           ctx.fillStyle = this.chart.config.options.defaultFontColor;
          //           ctx.textAlign = 'center';
          //           ctx.textBaseline = 'bottom';
          //
          //           this.data.datasets.forEach(function (dataset) {
          //             // console.log(dataset);
          //             var percentage = [];
          //             for(var i = 1; i < dataset['data'].length; ++i){
          //               percentage.push( (dataset['data'][i] - dataset['data'][i-1])/dataset['data'][i-1] * 100 );
          //             }
          //               var index = Object.keys(dataset['_meta']);
          //               var points = dataset['_meta'][index]['dataset']['_children'];
          //               for(var i = 1; i < points.length; ++i){
          //                 var x = points[i]['_view']['x'];
          //                 var y = points[i]['_view']['y'];
          //                 if(percentage[i-1] > 0) {
          //                   ctx.fillText('+' + percentage[i-1].toFixed(1) + '%', x, y);
          //                 }
          //                 else{
          //                   ctx.fillText(percentage[i-1].toFixed(1) + '%', x, y);
          //                 }
          //               }
          //           });
          //         }
          //       }
          //   }
          // });

          //end of chart
          // var canvas = $(this).parent().parent().parent().find('.junwal-chart');
          // canvas.show('normal');

          //show content
          var li = '';
          for(var i = lists[target_index].length - 1; i >= 0; i--){
            if( lists[target_index][i]['전용면적'] === target_area ){
              li +="<div class=junwal-result-item-content style=display:none;>"
                 +   "<h5>"  + "거래날짜: "
                           + lists[target_index][i]['년'] + "년 "
                           + lists[target_index][i]['월'] + "월 "
                           + lists[target_index][i]['일'] + "일"
                 +   "</h5>"
                 +   "<h5>"  + "전용면적: "
                           + lists[target_index][i]['전용면적'] + "m<sup>2</sup>("
                           + (lists[target_index][i]['전용면적']*0.3025).toFixed(0) + "평";
                     if(currentJunwalTab == 'apt-junwal' || currentJunwalTab === 'rhouse-junwal'){
                       li += ", " + lists[target_index][i]['층'] + "층";
                     }
              li +=         ")";
              li +=   "</h5>"
                 +   "<h5>"  + "보증금: "
                           + price_format(lists[target_index][i]['보증금액'], '만원')
                 +   "</h5>"
                 +   "<h5>"  + "월세: "
                           + price_format(lists[target_index][i]['월세금액'], '만원')
                 +   "</h5>"
                 + "</div>";
            }
          }

          $(this).parent().parent().parent().find('.junwal-result-item-content').remove();
          $(li).appendTo($(this).parent().parent().parent()).show();
      });

      target_dom.find(".junwal-result-list li p").on("mouseover", function(e){
        var target = $(this).parent().parent();

        if(currentJunwalTab === 'apt-junwal'){
          class_name = 'junwal-apt-building-polygon';
        }
        else if(currentJunwalTab === 'rhouse-junwal'){
          class_name = 'junwal-rhouse-building-polygon';

        }
        else if(currentJunwalTab === 'store-junwal') {
          class_name = 'junwal-store-building-polygon';
        }
        else if(currentJunwalTab === 'toji-junwal'){
          class_name = 'junwal-toji-building-polygon';
        }

        var polygons = $('.'+class_name);

        $.each( polygons, function(index, polygon) {

            var bunji = $(polygon).attr('data-bun') + ( ($(polygon).attr('data-ji') === '') ? '' : '-' + $(polygon).attr('data-ji') );

            if(target.attr('data-bunji') === bunji){
                $(polygon).addClass(class_name+ '-hover');
            }

        });

        polygons = $('.junwal-toji-polygon');
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
              $(polygon).addClass('junwal-toji-polygon-hover');
            }

        });

      });

      target_dom.find(".junwal-result-list li p").on("mouseout", function(e){

        if(currentJunwalTab === 'apt-junwal'){
          class_name = 'junwal-apt-building-polygon';
        }
        else if(currentJunwalTab === 'rhouse-junwal'){
          class_name = 'junwal-rhouse-building-polygon';

        }
        else if(currentJunwalTab === 'store-junwal') {
          class_name = 'junwal-store-building-polygon';
        }
        else if(currentJunwalTab === 'toji-junwal'){
          class_name = 'junwal-toji-building-polygon';
        }

        var polygons = $('.'+class_name);

        $.each( polygons, function(index, polygon) {

            $(polygon).removeClass(class_name + '-hover');

        });

        polygons = $('.junwal-toji-polygon');
        $.each( polygons, function(index, polygon) {

              $(polygon).removeClass('junwal-toji-polygon-hover');

        });

      });
      target_dom.find(".junwal-result-item-title").on("click", function(e){

        if( $(this).siblings().is(":visible")){
          $(this).find('.ti-arrow-up').removeClass('ti-arrow-up').addClass('ti-arrow-down');
        }
        else{
          $(this).find('.ti-arrow-down').removeClass('ti-arrow-down').addClass('ti-arrow-up');
        }

        $(this).siblings().toggle('fast', 'linear');

      });

      target_dom.find(".junwal-result-list").fadeIn();
    });

    target_dom.find(".junwal-filter-dropdown .filter-search-btn .rotating").removeClass('rotating');
    target_dom.find(".cs-loader").fadeOut('slow');

}

function completeOverlay(type, point, data){

  var customOverlay = new daum.maps.CustomOverlay({});
  var price = price_format_short(data[data.length - 1]['거래금액']);

  var target_type = type.split('-')[1];
  if(target_type === 'junwal'){
    var price = data[data.length - 1]['월세금액'];
    var label_name = '월';
    var label_color = 'blue';
    if(data[data.length - 1]['월세금액'] === '0'){
      price = data[data.length - 1]['보증금액'];
      label_name = '전';
      label_color = 'red';
    }
    price = price_format_short(price);
    label = '<span style=color:'+ label_color + ';>' + label_name + '</span>';
    price = label + price;
  }

  customOverlay.setContent(
                              '<div class="sil-overlay ' + type + '-overlay">'
                              +   '<div class=overlay-header>'
                              +       data[0]['이름'] + '<br>'
                              +   '</div>'
                              +   '<strong>'
                              +       price
                              +   '</strong>'
                              +   '(' + (data[data.length - 1]['전용면적']*.3025).toFixed(0) + '평)'
                              +     '| '
                              +   '<span class=overlay-info>'
                              +       data[data.length - 1]['년'].slice(-2) + '-' + data[data.length - 1]['월']
                              +   '</span>'
                              + '</div>'
                            );
  customOverlay.setPosition(new daum.maps.LatLng(point[0], point[1]));
  customOverlay.setMap(map);

  var mapLevel = map.getLevel();
  var font_size = '12px';
  var header_font_size = '14px';
  if(mapLevel === 2){
    font_size = '10px';
    header_font_size = '12px';
  }
  else if(mapLevel === 3){
    font_size = '7px';
    header_font_size = '9px';
  }
  else if(mapLevel === 4){
    font_size = '4px';
    header_font_size = '6px';
  }

  $(".sil-overlay, .junwal-overlay").css('font-size', font_size);
  $(".overlay-header").css('font-size', header_font_size);

  overlays.push(customOverlay);

}

function removeOverlay(){
  console.log(overlays);
  $.each(overlays, function(index, overlay){

    overlay.setMap(null);

  });
  overlays = [];
}

function removePolygons(){
  if(junwal_landPolygons.length > 0){
    $.each(junwal_landPolygons, function(index, polygon){
      polygon.setMap(null);
      junwal_landPolygons = [];
    });
  }

  if(junwal_buildingPolygons.length > 0){
    $.each(junwal_buildingPolygons, function(index, polygon){
      polygon.setMap(null);
      junwal_buildingPolygons = [];
    });
  }

  if(sil_landPolygons.length > 0){
    $.each(sil_landPolygons, function(index, polygon){
      polygon.setMap(null);
      sil_landPolygons = [];
    });
  }

  if(sil_buildingPolygons.length > 0 ){
    $.each(sil_buildingPolygons, function(index, polygon){
      polygon.setMap(null);
      sil_buildingPolygons = [];
    });
  }
}

daum.maps.event.addListener(map, 'zoom_start', function() {

    zoom_start = map.getLevel();

});


  // add zoom in zoom out mouseEvent
daum.maps.event.addListener(map, 'zoom_changed', function() {
    zoom_end = map.getLevel();

    if(overlays.length > 0){

        var mapLevel = map.getLevel();
        var font_size = '12px';
        var header_font_size = '14px';
        if(mapLevel === 2){
          font_size = '10px';
          header_font_size = '12px';
        }
        else if(mapLevel === 3){
          font_size = '7px';
          header_font_size = '9px';
        }
        else if(mapLevel === 4){
          font_size = '4px';
          header_font_size = '6px';
        }

        $(".sil-overlay, .junwal-overlay").css('font-size', font_size);
        $(".overlay-header").css('font-size', header_font_size);
    }
});
