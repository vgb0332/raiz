<script type="text/javascript" src="https://openapi.map.naver.com/openapi/v3/maps.js?clientId=DX5aYb4n7jxGROt0PIPR&submodules=panorama"></script>

<!-- MDB -->
<link href="<?php echo base_url();?>assets/vendor/mdb/mdb.min.css" rel="stylesheet">
<script src="<?php echo base_url();?>assets/vendor/mdb/mdb.min.js"></script>

<!-- DOM4 -->
<script src="<?php echo base_url();?>assets/vendor/dom4/dom4.min.js"></script>
<!-- SVG JS -->

<!-- OWN CSS FILES(FOR OVERRIDDING, ALWAYS AFTER VENDOR CSS, JS FILES PLEASE) -->
<link href="<?php echo base_url();?>assets/css/common.css" rel="stylesheet">
<link href="<?php echo base_url();?>assets/css/map.css" rel="stylesheet">
<link href="<?php echo base_url();?>assets/css/polygon.css" rel="stylesheet">
<link href="<?php echo base_url();?>assets/css/themify-icons.css" rel="stylesheet">
<link href="<?php echo base_url();?>assets/css/simple-line-icon.css" rel="stylesheet">

<!-- GHUNCSS -->
<link href="<?php echo base_url();?>assets/css/ghun.css" rel="stylesheet">

<!-- OWN JS FILES -->
<script src="<?php echo base_url();?>assets/js/common/global_variable.js"></script>
<script src="<?php echo base_url();?>assets/js/map/map_variable.js"></script>
<script src="<?php echo base_url();?>assets/js/map/raiz_window.js"></script>
<script src="<?php echo base_url();?>assets/js/map/raiz_controller.js"></script>
<script src="<?php echo base_url();?>assets/js/map/raiz_side_tab.js"></script>
<script src="<?php echo base_url();?>assets/js/map/raiz_curAddr.js"></script>
<script src="<?php echo base_url();?>assets/js/common/global_functions.js"></script>
<script src="<?php echo base_url();?>assets/js/map/daum_functions.js"></script>
<script src="<?php echo base_url();?>assets/js/map/map_controller.js"></script>
<script src="<?php echo base_url();?>assets/js/map/map_functions.js"></script>
<script src="<?php echo base_url();?>assets/js/map/main_activity.js"></script>
<script src="<?php echo base_url();?>assets/js/common/signup.js"></script>
<script src="<?php echo base_url();?>assets/js/common/login.js"></script>
<script src="<?php echo base_url();?>assets/js/common/logout.js"></script>
<!-- <script src="<?php echo base_url();?>assets/js/map/3dtest.js"></script> -->
<!-- <script src="<?php echo base_url();?>assets/js/map/3d_functions.js"></script> -->
<script src="<?php echo base_url();?>assets/js/map/3d_functions2.js"></script>
<script src="<?php echo base_url();?>assets/js/map/statistics.js"></script>


<!-- MOBILE CHECK -->
<!-- is_mobile variable can be checked in common/global_variable.js default is false -->
<?php
if($is_mobile){
?>
  <script type="text/javascript">  is_mobile = true; </script>
<?php
}
?>

  <script type="text/javascript">  login_type = "<?php echo $this->session->userdata('type'); ?>" </script>

<!-- SNS init -->
<script type="text/javascript">
  //kakao
  Kakao.init('bc10b2d63f82032b01864827f2f7d7ff');

  //facebook
  window.fbAsyncInit = function() {
    FB.init({
      appId            : '1880086172301711',
      autoLogAppEvents : true,
      xfbml            : true,
      status           : true,
      cookie           : true,
      version          : 'v2.11'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

   //google
   gapi.load('auth2', function() {
    auth2 = gapi.auth2.init({
      client_id: '766578953193-clebs9v51rgap5t2fa09ki2pjk0h7tc6.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
      scope: 'profile',
    });

    var element = document.getElementById('google_login');
    auth2.attachClickHandler(element, {},
      function(googleUser) {
          loginWithGoogle(googleUser);
        }, function(error) {
          console.log('Sign-in error', error);
        }
      );
   });



   // var naverLogin = new naver.LoginWithNaverId(
  	// {
  	// 	clientId: "Ma4jxG6UCNH4LwE5CWvr",
  	// 	callbackUrl: "http://www.re-go.kr/raiz1.3/map/main",
  	// 	isPopup: false,
  	// 	callbackHandle: true,
   //    loginButton: {color: "green", type: 3, height: 44} /* 로그인 버튼의 타입을 지정 */
  	// 	/* callback 페이지가 분리되었을 경우에 callback 페이지에서는 callback처리를 해줄수 있도록 설정합니다. */
  	// }).init();

</script>

<!-- welcome info -->
<script type="text/javascript">

  $(document).ready(function() {

      toaster('환영합니다! 원하시는 건물이나 땅을 오른쪽 클릭해보세요!');

  });

</script>
