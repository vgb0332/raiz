"use strict";

// $(".raiz-button").on('click', function(){
//   $(".raiz-side-tab-container").toggle("slide", { direction: "left" }, 200);
// });
$(".raiz-side-tab-container").show();

$(".raiz-search-button").on('click', function(){
  console.log('검색');
  $(".raiz-side-tab ").not(".raiz-search-tab").hide(function(){

      $(".raiz-search-tab").show();

  });

});

$(".raiz-sil-button").on('click', function(){
  console.log('실거래');
  $(".raiz-side-tab ").not(".raiz-sil-tab").hide(function(){

    $(".raiz-sil-tab").show();

  });
});

$(".raiz-junwal-button").on('click', function(){
  console.log('전월');
  $(".raiz-side-tab ").not(".raiz-junwal-tab").hide(function(){

    $(".raiz-junwal-tab").show();

  });
});
