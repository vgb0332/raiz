$("#modalRegisterForm").find(".signup-sex .btn").on("click", function(e){

  var button = $(this);
  var sex = $(this).attr('data-value');

  if(sex === 'male'){
    $("#modalRegisterForm").find(".signup-sex .btn").not($(this)).removeClass('selected').removeClass('btn-deep-orange');
    $(this).removeClass('btn-blue-grey').addClass('btn-info').addClass('selected');

    $("#modalRegisterForm").find(".signup-sex .ti-heart").css({color: '#1891be'});
  }
  else{
    $(this).removeClass('btn-blue-grey').addClass('btn-deep-orange').addClass('selected');
    $("#modalRegisterForm").find(".signup-sex .btn").not($(this)).removeClass('selected').removeClass('btn-info');
    $("#modalRegisterForm").find(".signup-sex .ti-heart").css({color: '#ff7043'});
  }

});

$("#modalRegisterForm").find(".signup-birthday #birthday").focusout(function(e){

    var birthday = $(this).val();
    if(birthday === ''){
      $(this).siblings('label .check-span')
      .hide();

      $(this)
      .removeClass('form-input-wrong')
      .removeClass('form-input-right');
      return;
    }
    else{

      var year = birthday.split('-')[0];
      var month = birthday.split('-')[1];
      var day =  birthday.split('-')[2];

      if (year < 1900){
            $(this).parent().find('label .check-span')
            .css('color', '#F44336')
            .text("년도를 확인하세요")
            .show();

            $(this)
            .removeClass('form-input-right')
            .addClass('form-input-wrong');
            return false;
       }
    }

});

$("#modalRegisterForm").find(".signup-pass input").focusout(function(e){

    var password = $(this).val();
    if(password == ''){
      $(this).parent().find('label .check-span')
      .hide();

      $(this)
      .removeClass('form-input-wrong')
      .removeClass('form-input-right');
      return false;
    }

    if(/^[a-zA-Z0-10]{10,15}$/.test(password)){

      $(this).parent().find('label .check-span')
      .css('color', '#F44336')
      .text("2~10자의 한글, 영문, 숫자만 사용할 수 있습니다")
      .show();

      $(this)
      .removeClass('form-input-right')
      .addClass('form-input-wrong');
      return false;

    }

    var checkNumber = password.search(/[0-9]/g);

    var checkEnglish = password.search(/[a-z]/ig);

    if(checkNumber <0 || checkEnglish <0){

      $(this).parent().find('label .check-span')
      .css('color', '#F44336')
      .text("숫자와 영문자를 혼용하여야 합니다")
      .show();

      $(this)
      .removeClass('form-input-right')
      .addClass('form-input-wrong');
      return false;

    }

    $(this).parent().find('label .check-span')
    .removeClass('ti-close')
    .addClass('ti-check')
    .css('color', '#00C851')
    .text("")
    .show();


});

$("#modalRegisterForm").find(".signup-passcheck input").focusout(function(e){

    var password = $(this).val();
    var orginal_password = $("#modalRegisterForm").find(".signup-pass input").val();
    if(password === '') {
      $(this).parent().find('label span')
      .hide();

      $(this)
      .removeClass('form-input-wrong')
      .removeClass('form-input-right');
      return;
    }
    if(orginal_password !== '' && password !== orginal_password){
      $(this).parent().find('label .check-span')
      .css('color', '#F44336')
      .text("비밀번호가 불일치합니다")
      .show();

      $(this)
      .removeClass('form-input-right')
      .addClass('form-input-wrong');
    }
    else{

      $(this)
      .removeClass('form-input-wrong')
      .addClass('form-input-right');

      $(this).parent().find('label .check-span')
      .removeClass('ti-close')
      .addClass('ti-check')
      .text('')
      .css('color', '#00C851')
      .show();
    }

});

$("#modalRegisterForm").find(".signup-nickname input").focusout(function(e){

    var nickname = $(this).val();

    if(nickname === '') {
      $(this).parent().find('label .check-span')
      .hide();

      $(this)
      .removeClass('form-input-wrong')
      .removeClass('form-input-right');
      return;
    }

    if(nickname.length < 2 || nickname.length > 10) {
      $(this).parent().find('label .check-span')
      .css('color', '#F44336')
      .text("2~10자의 한글, 영문, 숫자만 사용할 수 있습니다")
      .show();

      $(this)
      .removeClass('form-input-right')
      .addClass('form-input-wrong');
      return false;
    }

    var chk = /[0-9]|[a-z]|[A-Z]|[가-힣]/;

    var wrong = false;

    for( var i = 0; i <= nickname.length -1 ; i++ ) {
       if(chk.test(nickname.charAt(i))){
         wrong = false;
       }
       else {
         wrong = true;
         break;
       }
    }

    if(wrong){

        $(this).parent().find('label .check-span')
        .css('color', '#F44336')
        .text("2~10자의 한글, 영문, 숫자만 사용할 수 있습니다")
        .show();

        $(this)
        .removeClass('form-input-right')
        .addClass('form-input-wrong');

    }
    else {

        $(this)
        .removeClass('form-input-wrong')
        .addClass('form-input-right');

        $(this).parent().find('label .check-span')
        .removeClass('ti-close')
        .addClass('ti-check')
        .css('color', '#00C851')
        .text("")
        .show();
    }

});

$("#modalRegisterForm").find(".signup-email input").focusout(function(e){

    var email = $(this).val();
    if(email === '') {
      $(this).parent().find('label .check-span')
      .hide();

      $(this)
      .removeClass('form-input-wrong')
      .removeClass('form-input-right');
      return;
    }
    if(ValidateEmail(email)){
        $(this)
        .removeClass('form-input-wrong')
        .addClass('form-input-right');

        $(this).parent().find('label .check-span')
        .removeClass('ti-close')
        .addClass('ti-check')
        .text("")
        .css('color', '#00C851')
        .show();
    }
    else{
        $(this).parent().find('label .check-span')
        .css('color', '#F44336')
        .text("잘못된 이메일 형식입니다")
        .show();

        $(this)
        .removeClass('form-input-right')
        .addClass('form-input-wrong');
    }
});

function ValidateEmail(mail) {
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true);
  }
    return (false);
}

$("#already_user").on("click", function(e){

    $("#modalRegisterForm").modal('hide');
    $("#modalLoginForm").modal("show");

});

$("#register").on("click", function(e){
  var check = checkValidity();
  if( !check ){
    return false;
  }

  var nickname = $("#modalRegisterForm_info .md-form #name").val();
  var email = $("#modalRegisterForm_info .md-form #email").val();
  var password = $("#modalRegisterForm_info .md-form #raiz_pass").val();
  var birth = $("#modalRegisterForm_info .md-form #birthday").val();
  var sex = $("#modalRegisterForm_info .signup-sex .selected").attr('data-value');
  var values = {
    'nickname' : nickname,
    'email' : email,
    'password' : password,
    'birth' : birth,
    'sex' : sex
  };

  customAjax($SITE_URL+'auth/raiz_register', values, function(data){
    console.log(data);
    if(data === 'success'){
      toaster('회원가입이 완료되었습니다!', 'success');
      $("#already_user").trigger("click");
    }

    else if(data === 'duplicate'){
      toaster('이미 회원이십니다~', 'warning');

    }

    else{
      toaster('내부 에러입니다 잠시 후 다시 시도하시고 그래도 안되시면 문의해주세요', 'error');
    }
  });


});

function checkValidity(){
  var dom = $("#modalRegisterForm_info .md-form .form-control");
  var check = true;
  $.each(dom, function(index, input) {

      var val = $(input).val();

      if(val === '') {
        $(this).parent().find('label .check-span')
        .css('color', '#F44336')
        .text("정보를 입력해주세요")
        .show();

        $(this)
        .removeClass('form-input-right')
        .addClass('form-input-wrong');
        check = false;
        return false;
      }

      if($(input).hasClass('for-input-wrong')) {
        return false;
      }

  });

  if(!check) return false;

  var date_dom = $("#modalRegisterForm_info .signup-sex .btn");

  var sex_dom = $("#modalRegisterForm_info .signup-sex .btn");
  var sex_selected = false;
  $.each(sex_dom, function(index, button) {
    if( $(button).hasClass('selected') ){
      sex_selected = true;
    }
  });

  if(!sex_selected) {
    sex_dom.siblings('.check-span').text('선택해주세요')
                                    .css('color', '#F44336')
                                    .show();
    return false;
  }
  else {
    sex_dom.siblings('.check-span').hide();
  }

  return true;
}
