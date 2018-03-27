$("#not_user").on("click", function(e){

  $("#modalRegisterForm").modal('show');
  $("#modalLoginForm").modal("hide");

});

$("#modalLoginForm input[type=email]").focus(function(e){
  $("#modalLoginForm .check-span[type=email]").hide();
});

$("#modalLoginForm input[type=password]").focus(function(e){
  $("#modalLoginForm .check-span[type=password]").hide();
});

$("#raiz_login").on("click", function(e){

  var email = $("#modalLoginForm input[type=email]").val();
  var pass = $("#modalLoginForm input[type=password]").val();

  if(email === ''){
    $("#modalLoginForm .check-span[type=email]")
    .text('이메일 입력').css('color' , 'red').show();
    return false;
  }
  else if(!ValidateEmail(email)){
    $("#modalLoginForm .check-span[type=email]")
    .text('이메일 형식 확인하세요').css('color' , 'red').show();
    return false;
  }

  if(pass === ''){
    $("#modalLoginForm .check-span[type=email]").hide();

    $("#modalLoginForm .check-span[type=password]")
    .text('비밀번호 입력').css('color' , 'red').show();
    return false;
  }

  var values = {
    'email' : email,
    'password' : pass
  };

  customAjax($SITE_URL+'auth/raiz_login', values, function(result){
    console.log(result);
    if(result === 'success'){
      location.reload();
    }
    else{
      toaster('아이디 혹은 비밀번호가 일치하지않습니다', 'warning');
    }
  });

});

function loginWithNaver() {
  toaster('준비중입니다', 'info');
}

function loginWithKakao() {

  // 로그인 창을 띄웁니다.
  Kakao.Auth.loginForm({
    success: function(authObj) {
      // 로그인 성공시, API를 호출합니다.
      Kakao.API.request({
        url: '/v1/user/me',
        success: function(res) {
          console.log(res);
          customAjax($SITE_URL+'auth/sns_login', { type: 'kakao' , user: JSON.stringify(res) }, function(result){
            if(result === 'success'){
              location.reload();
            }
            else{
              toaster('로그인 실패', 'warning');
            }
          });
        },
        fail: function(error) {
          console.log(error);
          toaster('로그인 실패', 'warning');
        }
      });
    },
    fail: function(err) {
      alert(JSON.stringify(err));
    }
  });
}

function loginWithFacebook() {

  FB.login(function(response) {
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      FB.api('/me?fields=id,name,email,picture.width(100).height(100).as(picture_small)', function(res) {
        console.log(res);
        customAjax($SITE_URL+'auth/sns_login', { type: 'facebook' , user: JSON.stringify(res) }, function(result){
          if(result === 'success'){
            location.reload();
          }
          else{
            toaster('로그인 실패', 'warning');
          }
        });
      });
    } else {
      // The person is not logged into this app or we are unable to tell.
      console.log('not logged in');
    }
  });
}

function loginWithGoogle(googleUser){

  var profile = googleUser.getBasicProfile();

  var user = {};
  user['id'] = profile.getId();
  user['nickname'] = profile.getName();
  user['profile_image'] = profile.getImageUrl();
  user['email'] = profile.getEmail();

  console.log(user);
  customAjax($SITE_URL+'auth/sns_login', { type: 'google' , user: JSON.stringify(user) }, function(result){
    if(result === 'success'){
      location.reload();
    }
    else{
      toaster('로그인 실패', 'warning');
    }
  });
}

function onSignIn(googleUser) {

  var profile = googleUser.getBasicProfile();
  var user = {};
  user['id'] = profile.getId();
  user['nickname'] = profile.getName();
  user['profile_image'] = profile.getImageUrl();
  user['email'] = profile.getEmail();

  console.log(user);
  // $.post(
  //   '<?php echo base_url();?>map/Auth/loginWithGoogle',
  //   { user: JSON.stringify(user) },
  //   function(data, status){
  //     if(status === 'success'){
  //       location.reload();
  //       // console.log(data);
  //     }
  //     else{
  //       showDialog('alert', '로그인 실패');
  //     }
  //   }
  // );
}
