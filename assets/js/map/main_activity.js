"use strict";

$(document).ready(function(){
  /*    Initialization process list
   * 1. single polygon drawing event handler
   *    - For PC, "right click" on daum map triggers the land polygon
   *    - For Mobile, "double click" on daum map triggers the land polygon
   */
   var trigger_by = 'rightclick';
   if(is_mobile){ trigger_by = 'dblclick'; }
   daum.maps.event.addListener(map, trigger_by, function(mouseEvent){

     coord2RegionCode(mouseEvent.latLng, function(address, status) {
         if (status === daum.maps.services.Status.OK) {
           console.log(address);
           ajax_type = 'mark';
           customAjax($SITE_URL+'get/singlePolygon',
                     {
                       bjdongCd : address[0]['code'],
                       lat : mouseEvent.latLng.getLat(),
                       lng : mouseEvent.latLng.getLng()
                     },
                     mainActivity);
         }
     });
   });
});
