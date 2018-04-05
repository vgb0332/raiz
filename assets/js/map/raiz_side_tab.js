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
        toaster('조금만 확대해주세요^^', 'info');
        needSilRefresh = false;
        return;
    }
    else{
      if(!needSilRefresh){
        needSilRefresh = true;
        // console.log('1');
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
           // console.log('2');

         }
         else{
           sil_currentCode = address[0]['code'];
           needSilRefresh = true;
           // console.log('3');
         }


         if(currentSilTab !== target.attr('id')){
           needSilRefresh = true;
           currentSilTab = target.attr('id');
         }
         // console.log(sil_currentCode, currentCode, needSilRefresh);
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

           // console.log(filter_type, filter_value, request_name);

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
      // sil_ajax = null;
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
  // console.log(sorted_data);
  return sorted_data;
}

function fillSilTab(result){
  // console.log('here!', result);
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
    // console.log(result);
    var polygons = [];
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

       polygons.push(key['polygon']);

    });

    ajax_type = 'sil-toji';
    drawPoly(result);
  }


  target_dom.find(".sil-filter-dropdown-menu li").on("click", function(e){
    $(this).parent().siblings('.btn').text($(this).text())
                                     .attr('data-type', $(this).attr('data-type'))
                                     .val($(this).val());
  });


  target_dom.find(".sil-filter-dropdown .filter-search-btn .ti-reload").unbind("click").on("click", function(e){
    var login = false;
    $.when(customAjax($SITE_URL+'auth/is_login', {}, function(result){
      login = result;

    })).then(function( ajax ){
      console.log(login);
      if(!login){
        if (confirm('회원용 기능입니다. 로그인 하시겠습니까?')) {
            $("#modalLoginForm").modal("show");
        }
        return false;
      }

      // // console.log($(this).parent().parent().parent().attr('id'));
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
      // console.log(target_sil_type, filter_type, filter_value);
      sil_ajax = customAjax($SITE_URL+'get/' + request_name,
                {
                  bjdongCd : currentCode,
                  filter_type : filter_type,
                  filter_value : filter_value
                },
                fillSilTab);
    });

  });


  target_dom.find(".sil-result-list").fadeOut(function(){

    target_dom.find(".sil-result-list li").remove();

    $(li).appendTo(target_dom.find(".sil-result-list"));

    target_dom.find(".sil-result-list .sil-result-item .sil-result-item-title").unbind('hover').hover(function(e){

        e.preventDefault();
        var clicked_item = $(this);
        var target_list = $(this).parent();

        $.each(sil_landPolygons, function(index, polygon) {

          $.each(polygon.wc, function(index, polygon_attr){

              var toji_target_id = polygon_attr.id;
              var toji_target_bunji = $("#" + toji_target_id).attr('data-bunji');

              if(toji_target_bunji == $(target_list).attr('data-bunji')){
                map.panTo(polygon.getPath()[0])
              }
          });

        });
    });

    target_dom.find(".sil-result-list .sil-result-item .sil-result-item-title").unbind('click').on("click", function(e){

      e.preventDefault();
      var clicked_item = $(this);
      var target_list = $(this).parent();

      if( clicked_item.siblings().hasClass('sil-result-item-content') ){

        if( clicked_item.find('.sil-result-item-content').is(":visible") ) {

          clicked_item.children().children().find('.ti-arrow-down').removeClass('ti-arrow-down').addClass('ti-arrow-up');
        }

        $(clicked_item).find('.ti-arrow-up').removeClass('ti-arrow-up').addClass('ti-arrow-down');

        $(clicked_item).siblings().toggle('fast', 'linear');
        return false;
      }

      var bunji = $(this).parent().attr('data-bunji');

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
      // console.log(request_name);
      sil_ajax = customAjax($SITE_URL+'get/' + request_name,
                {
                  bjdongCd : currentCode,
                  bunji : bunji,
                  filter_type : filter_type,
                  filter_value : filter_value
                },
                function(list){
                  // console.log(list);

                  //일단 전용면적 선택버튼. canvas 먼저 부착해볼까
                  // var containment = "<div class=sil-result-item-content></div>";

                  var chart = "<canvas class=sil-chart width=300 height=300 style=display:none;></canvas>";
                  var dropbox = "<div class=sil-dropdown>"
                              +     "<button class=btn btn-primary dropdown-toggle type=button data-toggle=dropdown>"
                              +        "평형 선택" + "<span class=caret></span>"
                              +     "</button>"
                              +     "<ul class='dropdown-menu sil-dropdown-menu'>";
                  var area_dup_check = [];
                  for(var i = 0; i < list.length; ++i){
                    // console.log(list[i]['전용면적']);
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

                  // clicked_item.after(containment);
                  // clicked_item.parent().find('.sil-result-item-content').append($(dropbox + chart));
                  // console.log( dropbox + chart );
                  clicked_item.parent().append($('<div class=sil-result-item-content style=display:none;>' + dropbox + chart + '</div>').show());


                  target_dom.find(".sil-dropdown-menu li").on("click", function(e){

                      $(this).parent().siblings('.btn').text($(this).text());
                      // var target_index = $(this).attr('name');
                      var target_area = $(this).attr('data-area');

                      var data_object = {};
                      for(var i = 0; i < list.length; i++){
                        // // console.log(lists[target_index][i]);
                        if(list[i]['전용면적'] === target_area){
                          // // console.log(i);

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
                                  // // console.log(dataset);
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

                          li +=  "<div class=sil-list>"
                             +    "<h5>"  + "거래날짜: "
                                       + list[i]['년'] + "년 "
                                       + list[i]['월'] + "월 "
                                       + list[i]['일'] + "일"
                             +    "</h5>"
                             +    "<h5>"  + "전용면적: "
                                       + list[i]['전용면적'] + "m<sup>2</sup>("
                                       + (list[i]['전용면적']*.3025).toFixed(0) + "평";
                                       if(currentSilTab == 'apt-sil' || currentSilTab === 'rhouse-sil'){

                                         li += ", " + list[i]['층'] + "층";
                                       }
                          li +=         ")";
                          li +=   "</h5>"
                             +   "<h5>"  + "거래금액: "
                                       + price_format(list[i]['거래금액'], '만원')
                             +   "</h5>"
                             + "</div>";

                        }
                      }

                      $(this).parent().parent().parent().find('.sil-list').remove();
                      $(this).parent().parent().next().after($(li).show());

                  });
                });

    });

    target_dom.find(".sil-result-list").fadeIn();

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
    // console.log(target.attr('id'));
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

        toaster('조금만 확대해주세요^^', 'info');
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

           // console.log(filter_type, filter_value, request_name);

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
      // junwal_ajax = null;
    }
    needJunwalRefresh = false;

});

daum.maps.event.addListener(map, 'dragend', function() {
    needJunwalRefresh = true;
});

function fillJunwalTab(result){
    // console.log(result);

    var target_dom = $(".raiz-junwal-tab .raiz-side-tab-content li:visible");
    var li = '';
    var target_junwal_type = $(".raiz-junwal-tab .raiz-side-tab-content li:visible").attr('id');

    var request_name = 'aptJunwalPolygon';

    if(target_junwal_type === 'apt-junwal'){
      request_name = 'aptJunwalPolygon';
    }
    else if(target_junwal_type === 'rhouse-junwal'){
      request_name = 'rhouseJunwalPolygon';
    }
    else if(target_junwal_type === 'store-junwal'){
      request_name = 'storeJunwalPolygon';
    }
    else if(target_junwal_type === 'toji-junwal'){
      request_name = 'tojiJunwalPolygon';
    }

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

      $.each(result, function(index, key){

         li += "<li class=junwal-result-item data-sigunguCd=" + key['지역코드'] + " data-bjdongCd=" + key['법정동코드'] + " data-bunji=" + key['지번'] + ">"
            +     "<div class=junwal-result-item-title>";
            if(currentJunwalTab === 'apt-junwal' || currentJunwalTab === 'rhouse-junwal'){
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


      });

      ajax_type = 'junwal-toji';
      drawPoly(result);
    }

    target_dom.find(".junwal-filter-dropdown-menu li").on("click", function(e){
      $(this).parent().siblings('.btn').text($(this).text())
                                       .attr('data-type', $(this).attr('data-type'))
                                       .val($(this).val());
    });

    target_dom.find(".junwal-filter-dropdown .filter-search-btn .ti-reload").unbind("click").on("click", function(e){
      var login = false;
      $.when(customAjax($SITE_URL+'auth/is_login', {}, function(result){
        login = result;

      })).then(function( ajax ){
        console.log(login);
        if(!login){
          if (confirm('회원용 기능입니다. 로그인 하시겠습니까?')) {
              $("#modalLoginForm").modal("show");
          }
          return false;
        }

        var target_junwal_type = $(this).parent().parent().parent().attr('id');
        var filter_type = $(this).parent().siblings('button').attr('data-type');
        var filter_value = $(this).parent().siblings('button').val();

        if(target_junwal_type === 'apt-junwal'){
          request_name = 'aptJunwalPolygon';
        }
        else if(target_junwal_type === 'rhouse-junwal'){
          request_name = 'rhouseJunwalPolygon';
        }
        else if(target_junwal_type === 'store-junwal'){
          request_name = 'storeJunwalPolygon';
        }
        console.log(filter_type, filter_value);

        $(this).addClass("rotating");
        junwal_ajax = customAjax($SITE_URL+'get/' + request_name,
                  {
                    bjdongCd : currentCode,
                    filter_type : filter_type,
                    filter_value : filter_value
                  },
                  fillJunwalTab);
      });

    });

    target_dom.find(".junwal-result-list").fadeOut(function(){

      target_dom.find(".junwal-result-list li").remove();

      $(li).appendTo(target_dom.find(".junwal-result-list"));

      target_dom.find(".junwal-result-list .junwal-result-item .junwal-result-item-title").unbind('hover').hover(function(e){

          e.preventDefault();
          var clicked_item = $(this);
          var target_list = $(this).parent();

          $.each(junwal_landPolygons, function(index, polygon) {

            $.each(polygon.wc, function(index, polygon_attr){

                var toji_target_id = polygon_attr.id;
                var toji_target_bunji = $("#" + toji_target_id).attr('data-bunji');

                if(toji_target_bunji == $(target_list).attr('data-bunji')){
                  map.panTo(polygon.getPath()[0])
                }
            });

          });
      });

      target_dom.find(".junwal-result-list .junwal-result-item .junwal-result-item-title").unbind('click').on("click", function(e){

          e.preventDefault();

          var clicked_item = $(this);
          var target_list = $(this).parent();

          if( clicked_item.siblings().hasClass('junwal-result-item-content') ){


            if( clicked_item.find('.junwal-result-item-content').is(":visible") ) {

              clicked_item.children().children().find('.ti-arrow-down').removeClass('ti-arrow-down').addClass('ti-arrow-up');

            }

            $(clicked_item).find('.ti-arrow-up').removeClass('ti-arrow-up').addClass('ti-arrow-down');
            // console.log($(clicked_item).siblings());
            $(clicked_item).siblings().toggle('fast', 'linear');
            return false;
          }

          var bunji = $(this).parent().attr('data-bunji');

          if(target_junwal_type === 'apt-junwal'){
            request_name = 'aptJunwal';
          }
          else if(target_junwal_type === 'rhouse-junwal'){
            request_name = 'rhouseJunwal';
          }
          else if(target_junwal_type === 'store-junwal'){
            request_name = 'storeJunwal';
          }
          else if(target_junwal_type === 'toji-junwal'){
            request_name = 'tojiJunwal';
          }

          var filter_type = $('#' + target_junwal_type + '-filter .junwal-filter-dropdown button').attr('data-type');
          var filter_value = $('#' + target_junwal_type + '-filter .junwal-filter-dropdown button').val();

          filter_type = ( filter_type === undefined ) ? 'year' : filter_type;
          filter_value = ( filter_value === '' ) ? '1' : filter_value;

          junwal_ajax = customAjax($SITE_URL+'get/' + request_name,
                    {
                      bjdongCd : currentCode,
                      bunji : bunji,
                      filter_type : filter_type,
                      filter_value : filter_value
                    },
                    function(list){
                      console.log(list);

                      //일단 전용면적 선택버튼. canvas 먼저 부착해볼까
                      // var containment = "<div class=sil-result-item-content></div>";

                      // var chart = "<canvas class=sil-chart width=300 height=300 style=display:none;></canvas>";
                      var dropbox = "<div class=junwal-dropdown>"
                                  +     "<button class=btn btn-primary dropdown-toggle type=button data-toggle=dropdown>"
                                  +        "평형 선택" + "<span class=caret></span>"
                                  +     "</button>"
                                  +     "<ul class='dropdown-menu junwal-dropdown-menu'>";
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

                      // clicked_item.after(containment);
                      // clicked_item.parent().find('.sil-result-item-content').append($(dropbox));

                      clicked_item.parent().append($('<div class=junwal-result-item-content style=display:none;>' + dropbox + '</div>').show());

                      target_dom.find(".junwal-dropdown-menu li").on("click", function(e){
                          console.log('dropbox');
                          $(this).parent().siblings('.btn').text($(this).text());
                          // var target_index = $(this).attr('name');
                          var target_area = $(this).attr('data-area');

                          //show content
                          var li = '';
                          for(var i = list.length - 1; i >= 0; i--){
                            if( list[i]['전용면적'] === target_area ){

                              li +=  "<div class=junwal-list>"
                                 +    "<h5>"  + "거래날짜: "
                                           + list[i]['년'] + "년 "
                                           + list[i]['월'] + "월 "
                                           + list[i]['일'] + "일"
                                 +    "</h5>"
                                 +    "<h5>"  + "전용면적: "
                                           + list[i]['전용면적'] + "m<sup>2</sup>("
                                           + (list[i]['전용면적']*.3025).toFixed(0) + "평";
                                           if(currentJunwalTab == 'apt-junwal' || currentJunwalTab === 'rhouse-junwal'){
                                             li += ", " + list[i]['층'] + "층";
                                           }
                              li +=         ")";
                              li +=   "</h5>"
                                 +   "<h5>"  + "보증금: "
                                           + price_format(list[i]['보증금액'], '만원')
                                 +   "</h5>"
                                 +   "<h5>"  + "월세금: "
                                           + price_format(list[i]['월세금액'], '만원')
                                 +   "</h5>"
                                 + "</div>";

                            }
                          }

                          // // console.log(li);
                          $(this).parent().parent().parent().find('.junwal-list').remove();
                          $(this).parent().parent().parent().append($(li).show());

                      });
                    });

      });
        target_dom.find(".junwal-result-list").fadeIn();

    });


    target_dom.find(".junwal-filter-dropdown .filter-search-btn .rotating").removeClass('rotating');
    target_dom.find(".cs-loader").fadeOut('slow');

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
