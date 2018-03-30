<!-- Footer -->
<footer class="text-center">
  <a class="up-arrow" href="#home" data-toggle="tooltip" title="TO TOP">
    <span class="glyphicon glyphicon-chevron-up"></span>
  </a><br><br>
  <p>©Copyright 2018 RAIZ All Rights Reserved</p>
</footer>

<!-- MDB -->
<link href="<?php echo base_url();?>assets/vendor/mdb/mdb.min.css" rel="stylesheet">
<script src="<?php echo base_url();?>assets/vendor/mdb/mdb.min.js"></script>

<!-- OWN FILES -->
<link href="<?php echo base_url();?>assets/css/home.css" rel="stylesheet">
<link href="<?php echo base_url();?>assets/css/common.css" rel="stylesheet">
<link href="<?php echo base_url();?>assets/css/themify-icons.css" rel="stylesheet">

<!-- OWN JS FILES -->
<script src="<?php echo base_url();?>assets/js/common/global_variable.js"></script>
<script src="<?php echo base_url();?>assets/js/common/global_functions.js"></script>
<script src="<?php echo base_url();?>assets/js/common/signup.js"></script>
<script src="<?php echo base_url();?>assets/js/common/login.js"></script>
<script src="<?php echo base_url();?>assets/js/common/logout.js"></script>

<script>
$(document).ready(function(){
  // Initialize Tooltip
  $('[data-toggle="tooltip"]').tooltip();

  // Add smooth scrolling to all links in navbar + footer link
  $(".navbar a, footer a[href='#home']").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {

      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 900, function(){

        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
})
</script>

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
</script>

</body>
</html>
