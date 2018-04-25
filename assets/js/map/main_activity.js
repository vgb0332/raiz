"use strict";
 var trigger_by = 'rightclick';
$(document).ready(function(){
  /*    Initialization process list
   * 1. single polygon drawing event handler
   *    - For PC, "right click" on daum map triggers the land polygon
   *    - For Mobile, "double click" on daum map triggers the land polygon
   */

   if(is_mobile){ trigger_by = 'dblclick'; }
   daum.maps.event.addListener(map, trigger_by, mainFunction);
});

function mainFunction(mouseEvent){
  // user information toaster for the first timers
  if(first_polygon_click){
    toaster('도형을 클릭하시면 상세 정보를 보실 수 있어요!', 'info');
    first_polygon_click = false;
  }
  var main_ajax;
  coord2RegionCode(mouseEvent.latLng, function(address, status) {
      if (status === daum.maps.services.Status.OK) {
        console.log(address);
        console.log($SITE_URL+'get/singlePolygon');
        main_ajax = customAjax($SITE_URL+'get/singlePolygon',
                  {
                    bjdongCd : address[0]['code'],
                    lat : mouseEvent.latLng.jb,
                    lng : mouseEvent.latLng.ib
                  },
                  mainActivity);

        // $.when( main_ajax ).then(function(){
        //   map.panTo(new daum.maps.LatLng(mouseEvent.latLng.jb, mouseEvent.latLng.ib));
        // });
      }
  });

}
