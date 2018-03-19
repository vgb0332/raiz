
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

        return true;

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
