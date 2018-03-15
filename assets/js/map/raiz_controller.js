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
  $(".raiz-side-tab-container").removeClass("stcs-container");
  $(".raiz-side-tab-container:hidden").show("slide", {direction : "left"}, 200);
  $(".raiz-side-tab ").not(".raiz-search-tab").hide(function(){

      $(".raiz-search-tab:hidden").show();

  });

});

$(".raiz-sil-button").on('click', function(){
  console.log('실거래');
  $(".raiz-side-tab-container").removeClass("stcs-container");
  $(".raiz-side-tab-container:hidden").show("slide", {direction : "left"}, 200);
  $(".raiz-side-tab ").not(".raiz-sil-tab").hide(function(){

    $(".raiz-sil-tab:hidden").show();

  });
});

$(".raiz-junwal-button").on('click', function(){
  console.log('전월');
  $(".raiz-side-tab-container").removeClass("stcs-container");
  $(".raiz-side-tab-container:hidden").show("slide", {direction : "left"}, 200);
  $(".raiz-side-tab ").not(".raiz-junwal-tab").hide(function(){

    $(".raiz-junwal-tab:hidden").show();

  });
});

$(".raiz-stat-button").on('click', function(){
  console.log('통계');
  $(".raiz-side-tab-container").addClass("stcs-container");
  $(".raiz-side-tab-container:hidden").show("slide", {direction : "left"}, 200);
  $(".raiz-side-tab ").not(".raiz-stat-tab").hide(function(){

    $(".raiz-stat-tab:hidden").show();

  });
});
