<nav class="navbar raiz-navbar navbar-default navbar-fixed-top">
  <div class="container-fluid">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#raizNavbar">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#" onclick="javascript:window.location.reload();">
        <img src="<?php echo base_url();?>assets/img/Logo.png" alt="RAIZ">
      </a>
    </div>
    <div class="collapse navbar-collapse" id="raizNavbar">
      <ul class="nav navbar-nav navbar-right">
        <li><a href="<?php echo base_url();?>">HOME</a></li>
        <li><a href="<?php echo base_url();?>map">MAP</a></li>
        <!-- <li><a href="#search">검색</a></li>
        <li><a href="#community">커뮤니티</a></li> -->
        <!-- <li><a href="#contact">CONTACT</a></li> -->
        <li><a href="#signup" data-toggle="modal" data-target="#modalRegisterForm">회원가입</a></li>
        <?php
          if($this->session->userdata('is_login')){
         ?>
              <!-- <li><a href="Auth/logout" data-toggle="modal"><span class="glyphicon glyphicon-log-out"></span> 로그아웃</a></li> -->
              <li class="dropdown">
                   <a style="padding-top:10px;padding-bottom:10px;" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                       <!-- The Profile picture inserted via div class below, with shaping provided by Bootstrap -->
                       <div class="profile-img">
                         <img style="width:30px; height:30px;" src= "<?php echo $this->session->userdata('profile_image'); ?>" alt="">
                         <?php
                          echo $this->session->userdata('nickname');
                          ?>
                         <span class="caret"></span>
                       </div>

                   </a>
                   <ul class="dropdown-menu">
                       <li>
                           <a href="#"><span class="glyphicon glyphicon-user"></span> 프로필 설정</a>
                       </li>
                       <li role="separator" class="divider"></li>
                       <li>
                           <a href="#" onclick="logout();"><span class="glyphicon glyphicon-log-out"></span> 로그아웃</a>
                       </li>
                   </ul>
               </li>
         <?php
          } else{
          ?>
              <li><a href="#" id="login-button" data-toggle="modal" data-target = "#modalLoginForm"><span class="glyphicon glyphicon-log-in"></span> 로그인</a></li>
          <?php
          }
         ?>
        <!-- <li class="dropdown">
          <a class="dropdown-toggle" data-toggle="dropdown" href="#"> MORE <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a href="#">Merchandise</a></li>
            <li><a href="#">Extras</a></li>
            <li><a href="#">Media</a></li>
          </ul>
        </li> -->
        <!-- <li><a href="#"><span class="glyphicon glyphicon-search"></span></a></li> -->
      </ul>
    </div>
  </div>
</nav>
