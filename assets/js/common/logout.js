function logout(){
  console.log(login_type);
  customAjax($SITE_URL+'auth/logout', {}, function(result){
    location.reload();
  });

  if(login_type === 'google'){
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      customAjax($SITE_URL+'auth/logout', {}, function(result){
        document.location.href = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://www.re-go.kr/raiz1.3/map";
      });
    });
  }
  else if(login_type === 'naver'){
    $.post(
      '<?php echo base_url();?>map/Auth/logout',
      {},
      function(data, status){
        if(status === 'success'){
          naverLogin.logout();
          location.reload();
        }
        else{
          showDialog('alert', '로그아웃 오류');
        }
      }
    );
  }

}
