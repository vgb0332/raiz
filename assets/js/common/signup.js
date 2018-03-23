$("#modalRegisterForm").find(".signup-sex .btn").on("click", function(e){

  var button = $(this);
  var sex = $(this).attr('data-value');

  if(sex === 'male'){
    $("#modalRegisterForm").find(".signup-sex .btn").not($(this)).removeClass('btn-deep-orange');
    $(this).removeClass('btn-blue-grey').addClass('btn-info');
    $("#modalRegisterForm").find(".signup-sex .ti-heart").css({color: '#1891be'});
  }
  else{
    $(this).removeClass('btn-blue-grey').addClass('btn-deep-orange');
    $("#modalRegisterForm").find(".signup-sex .btn").not($(this)).removeClass('btn-info');
    $("#modalRegisterForm").find(".signup-sex .ti-heart").css({color: '#ff7043'});
  }

});

$("#modalRegisterForm").find(".signup-birthday input").focusout(function(e){

    var birthday = $(this).val();

    if(birthday === '') return;
    if(isValidDate(birthday)){
      $(this).attr('data-success', 'X');
    }
    else{
      $(this).attr('data-success', 'O');
    }

});

$("#modalRegisterForm").find(".signup-passcheck input").focusout(function(e){

    var password = $(this).val();

    if(birthday === '') return;
    if(password !== $("#modalRegisterForm").find(".signup-pass input").val()){
      console.log('wrong');
    }
    else{
      console.log(password);
    }

});


function isValidDate(dateStr) {
     var year = Number(dateStr.split('-')[0]);
     var month = Number(dateStr.split('-')[1]);
     var day = Number(dateStr.split('-')[2]);
     var today = new Date(); // 날자 변수 선언
     var yearNow = today.getFullYear();
     var adultYear = yearNow - 20;

     var text = '';

     if (year < 1900 || year > adultYear){
          text = ("년도를 확인하세요. "+adultYear+"년생 이전 출생자만 등록 가능합니다.");
          return false;
     }
     if (month < 1 || month > 12) {
          text = ("달은 1월부터 12월까지 입력 가능합니다.");
          return false;
     }
    if (day < 1 || day > 31) {
          text = ("일은 1일부터 31일까지 입력가능합니다.");
          return false;
     }
     if ((month==4 || month==6 || month==9 || month==11) && day==31) {
          text = (month+"월은 31일이 존재하지 않습니다.");
          return false;
     }
     if (month == 2) {
          var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
          if (day>29 || (day==29 && !isleap)) {
               text = (year + "년 2월은  " + day + "일이 없습니다.");
               return false;
          }
     }
     return true;
}
