"use strict";
console.log('side tab js loaded');
console.log($("#keyword-input"));
$("#keyword-input").keyup( function(e){
  e.preventDefault();
  console.log('key up');
  if(e.keyCode === 13){
    $("#keyword-submit").click();
  }
});
