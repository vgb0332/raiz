
$(".map-controller .control-btn").on("click", function(e){

  if( $(this).has(".zoom-in").length ){
      console.log('확대');
      map.setLevel(map.getLevel() - 1);
  }

  else if( $(this).has(".zoom-out").length ){
     console.log('축소');
     map.setLevel(map.getLevel() + 1);
  }

  else if( $(this).has(".map-type").length ){

      if( $(this).has(".road").length ){
        console.log('road');
        $(this).css('background-color', '#f8f1f1');
        $(this).find('.map-type').css('color', '#000000');
        $(this).find('.map-type').text('위성');
        $(this).find('.map-type').removeClass('road').addClass('hybrid');
        map.setMapTypeId(daum.maps.MapTypeId.HYBRID);
      }

      else if( $(this).has(".hybrid").length ){
        console.log('hybrid');
        $(this).css('background-color', '#333');
        $(this).find('.map-type').css('color', '#ffffff');
        $(this).find('.map-type').text('지도');
        $(this).find('.map-type').removeClass('hybrid').addClass('road');
        map.setMapTypeId(daum.maps.MapTypeId.ROADMAP);
      }

  }

  else if( $(this).has(".map-filter").length ){

      $(".map-controller .map-filter-list").toggle('normal');
      $(".map-controller .map-around-list").hide('normal');

  }

  else if( $(this).has(".map-around").length ){

      $(".map-controller .map-around-list").toggle('normal');
      $(".map-controller .map-filter-list").hide('normal');

  }

  else if( $(this).has(".map-distance").length ){

      console.log('distance');
      mapDistance();

  }

  else if( $(this).has(".map-roadview").length ){

      console.log('road_view');
      mapRoadview();
  }

  else if( $(this).has('.map-reset').length) {

      console.log('map reset');
      mapReset();

  }

});

var mapTypes = {
    terrain : daum.maps.MapTypeId.TERRAIN,
    traffic :  daum.maps.MapTypeId.TRAFFIC,
    bicycle : daum.maps.MapTypeId.BICYCLE,
    useDistrict : daum.maps.MapTypeId.USE_DISTRICT
};

$(".map-controller .map-filter-list .btn").on("click", function(e){
  var mapType = $(this).find('span').attr('id');

  if($(this).has('.ti-check').length){
    $(this).find('.ti-check').remove();
    $(this).css('background-color', '#f8f1f1');
    map.removeOverlayMapTypeId(mapTypes[mapType]);
  }
  else{

    var target_id = $(this).find('span').attr('id');
    var background_color = '#eef8e7';

    if(target_id === 'useDistrict'){
      background_color = '#f3b9bf';
    }
    else if(target_id === 'terrain'){
      background_color = '#eef8e7';
    }
    else if(target_id === 'traffic'){
      background_color = '#ffb629';
    }
    else if(target_id === 'bicycle'){
      background_color = '#78dab2';
    }

    $(this).append("<span class=ti-check></span>");
    $(this).css('background-color', background_color);
    map.addOverlayMapTypeId(mapTypes[mapType]);

  }

});

var aroundType = {

    "SC4" : false,
    "SW8" : false,
    "BK9" : false,
    "PS3" : false,
    "HP8" : false,
    "MT1" : false

};


var aroundMarkers = {

  "SC4" : [],
  "SW8" : [],
  "BK9" : [],
  "PS3" : [],
  "HP8" : [],
  "MT1" : []

};

var placeOverlay = new daum.maps.CustomOverlay({zIndex:10});
// placeOverlay.setContent(document.createElement('div'));

daum.maps.event.addListener(map, 'idle', function() {
    refreshAroundMarkers();

    $.each( aroundType, function(index, checked) {
        if(checked){

          $.each(aroundMarkers[checked], function(index, marker){
              marker.setMap(null);
          });
          aroundMarkers[checked] = [];

          ps.categorySearch(index, placesSearchCB, {
            useMapBounds : true
          });
        }
    });

});

$(".map-controller .map-around-list .btn").on("click", function(e){
  var target = $(this).find('span').attr('id');

  if($(this).has('.ti-check').length){
    $(this).find('.ti-check').remove();
    $(this).css('background-color', '#f8f1f1');
    aroundType[target] = false;

  }
  else{

    var background_color = getMapIconColorByPlaceId( $(this).find('span').attr('id') );
    $(this).append("<span class=ti-check></span>");
    $(this).css('background-color', background_color);
    aroundType[target] = true;

  }

  daum.maps.event.trigger(map, 'idle');

});


function refreshAroundMarkers(){

  $.each( aroundMarkers, function(index, markers) {

      if(markers.length <= 0){


         true;

      }
      else{

        $.each(aroundMarkers[index], function(index, marker){

            marker.setMap(null);

        });
      }

      aroundMarkers[index] = [];
  });
}

function placesSearchCB (data, status, pagination) {
    if (status === daum.maps.services.Status.OK) {
            displayAroundMarker(data);
    }
}

// 지도에 마커를 표시하는 함수입니다
function displayAroundMarker(places) {

    var target_id = places[0]['category_group_code'];

    var imageFile = getMapIconByPlaceId(target_id);
    var imageSrc = $SITE_URL + '/assets/icon/' + imageFile + '.png';
    var imageSize = new daum.maps.Size(27, 28);
    var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize);


    for(var i = 0; i < places.length; ++i){
        var marker = new daum.maps.Marker({
                        position: new daum.maps.LatLng(places[i].y, places[i].x),
                        image: markerImage
                    });

        marker.setMap(map);
        aroundMarkers[target_id].push(marker);

        (function(marker, place) {
                daum.maps.event.addListener(marker, 'click', function() {

                    showAroundInfo(place);

                });
          })(marker, places[i]);

    }

}

function showAroundInfo(place){
  var content = '<div class="wrap" style="z-index:10;">' +
              '    <div class="info">' +
              '        <div class="title">' +
                          place['place_name']+
              '            <div class="close" onclick="closeOverlay()" title="닫기"></div>' +
              '        </div>' +
              '        <div class="body">' +
              // '            <div class="img">' +
              // '                <img src="http://cfile181.uf.daum.net/image/18957425" width="73" height="70">' +
              // '           </div>' +
              '            <div class="desc">' +
              '                <div class="ellipsis">' + place['road_address_name'] + '</div>' +
              '                <div class="jibun ellipsis">'+ place['address_name'] + '</div>' +
              '                <div>' + place['phone'] + '</div>' +
              '            </div>' +
              '        </div>' +
              '    </div>' +
              '</div>';

  placeOverlay.setContent(content);
  placeOverlay.setPosition(new daum.maps.LatLng(place.y, place.x));
  placeOverlay.setMap(map);
}

function closeOverlay(){
  placeOverlay.setMap(null);
}

function getMapIconByPlaceId(id){
  switch (id){
    case "SC4": return "school";
    break;

    case "SW8": return "tramway";
    break;

    case "BK9": return "bank";
    break;

    case "PS3" : return "youthhostel";
    break;

    case "HP8": return "hospital-building";
    break;

    case "MT1": return "market";
    break;
  }
}

function getMapIconColorByPlaceId(id){
  switch (id){
    case "SC4": return "#ed4244";
    break;

    case "SW8": return "#9d7050";
    break;

    case "BK9": return "#3975d7";
    break;

    case "PS3" : return "#8c4eb8";
    break;

    case "HP8": return "#f34648";
    break;

    case "MT1": return "#5ba096";
    break;
  }
}

function mapDistance(){

  toaster('지도를 마우스로 클릭하면 선 그리기가 시작되고 오른쪽 마우스를 클릭하면 선 그리기가 종료됩니다', 'info');
  //일시적으로 기본 기능 제거
  daum.maps.event.removeListener(map, trigger_by, mainFunction);
  $("#map").children().first().addClass('rv_cursor');
  daum.maps.event.addListener(map, 'click', mapDistanceOnClick);
  daum.maps.event.addListener(map, 'mousemove', mapDistanceMouseMove);
  daum.maps.event.addListener(map, 'rightclick', mapDistanceRightClick);

}

function mapDistanceRightClick(mouseEvent){
    if (drawingFlag) {

       // 마우스무브로 그려진 선은 지도에서 제거합니다
       moveLine.setMap(null);
       moveLine = null;

       // 마우스 클릭으로 그린 선의 좌표 배열을 얻어옵니다
       var path = clickLine.getPath();

       // 선을 구성하는 좌표의 개수가 2개 이상이면
       if (path.length > 1) {

           // 마지막 클릭 지점에 대한 거리 정보 커스텀 오버레이를 지웁니다
           if (dots[dots.length-1].distance) {
               dots[dots.length-1].distance.setMap(null);
               dots[dots.length-1].distance = null;
           }

           var distance = Math.round(clickLine.getLength()), // 선의 총 거리를 계산합니다
               content = getTimeHTML(distance); // 커스텀오버레이에 추가될 내용입니다

           // 그려진 선의 거리정보를 지도에 표시합니다
           showDistance(content, path[path.length-1]);

       } else {

           // 선을 구성하는 좌표의 개수가 1개 이하이면
           // 지도에 표시되고 있는 선과 정보들을 지도에서 제거합니다.
           deleteClickLine();
           deleteCircleDot();
           deleteDistnce();

       }

       // 상태를 false로, 그리지 않고 있는 상태로 변경합니다
       drawingFlag = false;


   }
   // 모든 이벤트 핸들러를 제거, 기본 이벤트 다시 재가동
   daum.maps.event.removeListener(map, 'click', mapDistanceOnClick);
   daum.maps.event.removeListener(map, 'mousemove', mapDistanceMouseMove);
   daum.maps.event.removeListener(map, 'rightclick', mapDistanceRightClick);
   $("#map").children().first().removeClass('rv_cursor');
   daum.maps.event.addListener(map, trigger_by, mainFunction);
}

function mapDistanceMouseMove(mouseEvent){
  // 지도 마우스무브 이벤트가 발생했는데 선을 그리고있는 상태이면
    if (drawingFlag){

        // 마우스 커서의 현재 위치를 얻어옵니다
        var mousePosition = mouseEvent.latLng;

        // 마우스 클릭으로 그려진 선의 좌표 배열을 얻어옵니다
        var path = clickLine.getPath();

        // 마우스 클릭으로 그려진 마지막 좌표와 마우스 커서 위치의 좌표로 선을 표시합니다
        var movepath = [path[path.length-1], mousePosition];
        moveLine.setPath(movepath);
        moveLine.setMap(map);

        var distance = Math.round(clickLine.getLength() + moveLine.getLength()), // 선의 총 거리를 계산합니다
            content = '<div class="dotOverlay distanceInfo">총거리 <span class="number">' + distance + '</span>m</div>'; // 커스텀오버레이에 추가될 내용입니다

        // 거리정보를 지도에 표시합니다
        showDistance(content, mousePosition);
    }
}

function mapDistanceOnClick(mouseEvent) {
  // 마우스로 클릭한 위치입니다
  var clickPosition = mouseEvent.latLng;

  // 지도 클릭이벤트가 발생했는데 선을 그리고있는 상태가 아니면
  if (!drawingFlag) {

      // 상태를 true로, 선이 그리고있는 상태로 변경합니다
      drawingFlag = true;

      // 지도 위에 선이 표시되고 있다면 지도에서 제거합니다
      deleteClickLine();

      // 지도 위에 커스텀오버레이가 표시되고 있다면 지도에서 제거합니다
      deleteDistnce();

      // 지도 위에 선을 그리기 위해 클릭한 지점과 해당 지점의 거리정보가 표시되고 있다면 지도에서 제거합니다
      deleteCircleDot();

      // 클릭한 위치를 기준으로 선을 생성하고 지도위에 표시합니다
      clickLine = new daum.maps.Polyline({
          map: map, // 선을 표시할 지도입니다
          path: [clickPosition], // 선을 구성하는 좌표 배열입니다 클릭한 위치를 넣어줍니다
          strokeWeight: 3, // 선의 두께입니다
          strokeColor: '#db4040', // 선의 색깔입니다
          strokeOpacity: 1, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
          strokeStyle: 'solid' // 선의 스타일입니다
      });

      // 선이 그려지고 있을 때 마우스 움직임에 따라 선이 그려질 위치를 표시할 선을 생성합니다
      moveLine = new daum.maps.Polyline({
          strokeWeight: 3, // 선의 두께입니다
          strokeColor: '#db4040', // 선의 색깔입니다
          strokeOpacity: 0.5, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
          strokeStyle: 'solid' // 선의 스타일입니다
      });

      // 클릭한 지점에 대한 정보를 지도에 표시합니다
      displayCircleDot(clickPosition, 0);


  } else { // 선이 그려지고 있는 상태이면

      // 그려지고 있는 선의 좌표 배열을 얻어옵니다
      var path = clickLine.getPath();

      // 좌표 배열에 클릭한 위치를 추가합니다
      path.push(clickPosition);

      // 다시 선에 좌표 배열을 설정하여 클릭 위치까지 선을 그리도록 설정합니다
      clickLine.setPath(path);

      var distance = Math.round(clickLine.getLength());
      displayCircleDot(clickPosition, distance);
  }
}

// 클릭으로 그려진 선을 지도에서 제거하는 함수입니다
function deleteClickLine() {
    if (clickLine) {
        clickLine.setMap(null);
        clickLine = null;
    }
}

// 마우스 드래그로 그려지고 있는 선의 총거리 정보를 표시하거
// 마우스 오른쪽 클릭으로 선 그리가 종료됐을 때 선의 정보를 표시하는 커스텀 오버레이를 생성하고 지도에 표시하는 함수입니다
function showDistance(content, position) {

    if (distanceOverlay) { // 커스텀오버레이가 생성된 상태이면

        // 커스텀 오버레이의 위치와 표시할 내용을 설정합니다
        distanceOverlay.setPosition(position);
        distanceOverlay.setContent(content);

    } else { // 커스텀 오버레이가 생성되지 않은 상태이면

        // 커스텀 오버레이를 생성하고 지도에 표시합니다
        distanceOverlay = new daum.maps.CustomOverlay({
            map: map, // 커스텀오버레이를 표시할 지도입니다
            content: content,  // 커스텀오버레이에 표시할 내용입니다
            position: position, // 커스텀오버레이를 표시할 위치입니다.
            xAnchor: 0,
            yAnchor: 0,
            zIndex: 3
        });
    }
}

// 그려지고 있는 선의 총거리 정보와
// 선 그리가 종료됐을 때 선의 정보를 표시하는 커스텀 오버레이를 삭제하는 함수입니다
function deleteDistnce () {
    if (distanceOverlay) {
        distanceOverlay.setMap(null);
        distanceOverlay = null;
    }
}

// 선이 그려지고 있는 상태일 때 지도를 클릭하면 호출하여
// 클릭 지점에 대한 정보 (동그라미와 클릭 지점까지의 총거리)를 표출하는 함수입니다
function displayCircleDot(position, distance) {

    // 클릭 지점을 표시할 빨간 동그라미 커스텀오버레이를 생성합니다
    var circleOverlay = new daum.maps.CustomOverlay({
        content: '<span class="dot"></span>',
        position: position,
        zIndex: 1
    });

    // 지도에 표시합니다
    circleOverlay.setMap(map);

    if (distance > 0) {
        // 클릭한 지점까지의 그려진 선의 총 거리를 표시할 커스텀 오버레이를 생성합니다
        var distanceOverlay = new daum.maps.CustomOverlay({
            content: '<div class="dotOverlay">거리 <span class="number">' + distance + '</span>m</div>',
            position: position,
            yAnchor: 1,
            zIndex: 2
        });

        // 지도에 표시합니다
        distanceOverlay.setMap(map);
    }

    // 배열에 추가합니다
    dots.push({circle:circleOverlay, distance: distanceOverlay});
}

// 클릭 지점에 대한 정보 (동그라미와 클릭 지점까지의 총거리)를 지도에서 모두 제거하는 함수입니다
function deleteCircleDot() {
    var i;

    for ( i = 0; i < dots.length; i++ ){
        if (dots[i].circle) {
            dots[i].circle.setMap(null);
        }

        if (dots[i].distance) {
            dots[i].distance.setMap(null);
        }
    }

    dots = [];
}

// 마우스 우클릭 하여 선 그리기가 종료됐을 때 호출하여
// 그려진 선의 총거리 정보와 거리에 대한 도보, 자전거 시간을 계산하여
// HTML Content를 만들어 리턴하는 함수입니다
function getTimeHTML(distance) {

    // 도보의 시속은 평균 4km/h 이고 도보의 분속은 67m/min입니다
    var walkkTime = distance / 67 | 0;
    var walkHour = '', walkMin = '';

    // 계산한 도보 시간이 60분 보다 크면 시간으로 표시합니다
    if (walkkTime > 60) {
        walkHour = '<span class="number">' + Math.floor(walkkTime / 60) + '</span>시간 '
    }
    walkMin = '<span class="number">' + walkkTime % 60 + '</span>분'

    // 자전거의 평균 시속은 16km/h 이고 이것을 기준으로 자전거의 분속은 267m/min입니다
    var bycicleTime = distance / 227 | 0;
    var bycicleHour = '', bycicleMin = '';

    // 계산한 자전거 시간이 60분 보다 크면 시간으로 표출합니다
    if (bycicleTime > 60) {
        bycicleHour = '<span class="number">' + Math.floor(bycicleTime / 60) + '</span>시간 '
    }
    bycicleMin = '<span class="number">' + bycicleTime % 60 + '</span>분'

    // 거리와 도보 시간, 자전거 시간을 가지고 HTML Content를 만들어 리턴합니다
    var content = '<ul class="dotOverlay distanceInfo">';
    content += '    <li>';
    content += '        <span class="label">총거리</span><span class="number">' + distance + '</span>m';
    content += '    </li>';
    content += '    <li>';
    content += '        <span class="label">도보</span>' + walkHour + walkMin;
    content += '    </li>';
    content += '    <li>';
    content += '        <span class="label">자전거</span>' + bycicleHour + bycicleMin;
    content += '    </li>';
    content += '</ul>'

    return content;
}

function mapRoadview(){
    toaster('원하시는 곳을 클릭하시면 로드뷰를 보실 수 있습니다', 'info');
    daum.maps.event.addListener(map, 'click', roadviewClick);
    $("#map").children().first().addClass('rv_cursor');
}

function roadviewClick(mouseEvent){

  $("#map").children().first().removeClass('rv_cursor');
  var roadviewContainer = document.getElementById('rv_map'); //로드뷰를 표시할 div
  try{
    var roadview = new daum.maps.Roadview(roadviewContainer); //로드뷰 객체
  } catch(err){
    $("#flashModal").modal();
    return;
  }

  current_containment = 'rv_map';
  $(".raiz-window-container").draggable( "option", "containment", $( "#rv_map" ) );
  map.addOverlayMapTypeId(daum.maps.MapTypeId.ROADVIEW);
  var roadviewClient = new daum.maps.RoadviewClient(); //좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체

  $(".map-controller").fadeOut();
  $(".rv-controller").fadeIn();
  // $.each( map_controller, function(index, button){
  //   $(button).css({opacity: 0});
  // });

  var position = new daum.maps.LatLng(mouseEvent.latLng.getLat(), mouseEvent.latLng.getLng());

  // 특정 위치의 좌표와 가까운 로드뷰의 panoId를 추출하여 로드뷰를 띄운다.
  roadviewClient.getNearestPanoId(position, 50, function(panoId) {
      roadview.setPanoId(panoId, position); //panoId와 중심좌표를 통해 로드뷰 실행
      // $("#map").fadeOut();
      $("#map").addClass('small-map');
      $("#rv_map").fadeIn();


      $(".small_map").show();
      daum.maps.event.removeListener(map, 'click', roadviewClick);
  });



  // 로드뷰의 초기화 되었을때 map walker를 생성한다.
  daum.maps.event.addListener(roadview, 'init', function() {

      // map walker를 생성한다. 생성시 지도의 중심좌표를 넘긴다.
      mapWalker.setMap(map); // map walker를 지도에 설정한다.
      mapWalker.setPosition(mouseEvent.latLng);
      map.relayout();
      map.panTo(mouseEvent.latLng);
      console.log(mapWalker);
      // 로드뷰가 초기화 된 후, 추가 이벤트를 등록한다.
      // 로드뷰를 상,하,좌,우,줌인,줌아웃을 할 경우 발생한다.
      // 로드뷰를 조작할때 발생하는 값을 받아 map walker의 상태를 변경해 준다.
      daum.maps.event.addListener(roadview, 'viewpoint_changed', function(){

          // 이벤트가 발생할 때마다 로드뷰의 viewpoint값을 읽어, map walker에 반영
          var viewpoint = roadview.getViewpoint();
          mapWalker.setAngle(viewpoint.pan);

      });

      // 로드뷰내의 화살표나 점프를 하였을 경우 발생한다.
      // position값이 바뀔 때마다 map walker의 상태를 변경해 준다.
      daum.maps.event.addListener(roadview, 'position_changed', function(){

          // 이벤트가 발생할 때마다 로드뷰의 position값을 읽어, map walker에 반영
          var position = roadview.getPosition();
          mapWalker.setPosition(position);
          map.panTo(position);

      });
  });

}

$(".daum-rv-button").on("click", function(e){
  if(current_containment == 'rv_map'){
    return false;
  }

  current_containment = 'rv_map';
  $("#naver_rv_map, #google_rv_map").hide();
  $("#"+ current_containment).show();

});

$(".naver-rv-button").on("click", function(e){
  if(current_containment == 'naver_rv_map'){
    return false;
  }
  current_containment = 'naver_rv_map';
  $("#rv_map, #google_rv_map").hide();
  $("#"+ current_containment).show( );
  var naver_roadview = new naver.maps.Panorama( document.getElementById("naver_rv_map"), {
      // size : new naver.maps.Size(400, 400),
      position: new naver.maps.LatLng(map.getCenter().getLat(), map.getCenter().getLng()),
      pov: {
          pan: -133,
          tilt: 0,
          fov: 100
      }
  });
  $("#"+ current_containment).show( );

  naver.maps.Event.addListener(naver_roadview, "init", function() {
      naver_roadview.setVisible(true);
      toaster('네이버 로드뷰를 이용하시면 지도에서의 위치를 보실 수 없습니다!', 'error');
  });


});

$(".google-rv-button").on("click", function(e){
  if(current_containment == 'google_rv_map'){
    return false;
  }

  current_containment = 'google_rv_map';
  $("#naver_rv_map, #rv_map").hide();

  var panorama = new google.maps.StreetViewPanorama( document.getElementById('google_rv_map'),
                          {
                            position: {lat: map.getCenter().getLat(), lng: map.getCenter().getLng()},
                            pov: {heading: 165, pitch: 0},
                            zoom: 1
                          });
  $("#"+ current_containment).show(function(e){
    google.maps.event.trigger(panorama, "resize");
    toaster('구글 로드뷰를 이용하시면 지도에서의 위치를 보실 수 없습니다!', 'error');
  });

});

$(".return-button").on("click", function(e){
    var center = map.getCenter();
    $(".map-controller").fadeIn();
    $("#map").removeClass('small-map');
    mapWalker.setMap(null);
    map.removeOverlayMapTypeId(daum.maps.MapTypeId.ROADVIEW);
    map.relayout();
    map.setCenter(center);
    $(".raiz-window-container").draggable( "option", "containment", $( "#map" ) );
    $("#rv_map").hide();
    $(".rv-controller").hide();
    current_containment = 'map';

});

function mapReset(){

    removeOverlay();
    removePolygons();

}
