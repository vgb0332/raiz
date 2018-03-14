var timeout;

daum.maps.event.addListener(map, 'idle', function() {

    var mapLevel = map.getLevel();
    var center = map.getCenter();
    geocoder.coord2RegionCode(center.getLng(), center.getLat(), function(result, status){

      if (status === daum.maps.services.Status.OK) {

          var targetDiv = $(".raiz-cur-addr");
          currentCode = result[0]['code'];
          currentAddress = result[0]['address_name'];
          targetDiv.find('a').find('span').text(result[0]['address_name']);
          targetDiv.css('margin-left', -targetDiv.width()/2 - 10);
          targetDiv.fadeIn('normal');

          if(timeout)   window.clearTimeout(timeout);

          timeout = window.setTimeout(function(){ targetDiv.fadeOut('normal'); }, 6000);

      }

    });

});
