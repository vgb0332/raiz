
<!-- Container (Contact Section) -->
<div id="contact" class="container">
  <h3 class="text-center">Contact</h3>
  <!-- <p class="text-center"><em>We love our fans!</em></p> -->

  <div class="row">
    <div class="col-md-4">
      <!-- <p>Fan? Drop a note.</p> -->
      <p><span class="glyphicon glyphicon-map-marker"></span>[463-400] 성남시 분당구 삼평동 629 경기창조경제혁신센터 8F R21</p>
      <p><span class="glyphicon glyphicon-phone"></span>Phone1: +82 01022643338 </p>
      <p><span class="glyphicon glyphicon-phone"></span>Phone2: +82 01093945554 </p>
      <p><span class="glyphicon glyphicon-envelope"></span>Email: raiz.help@gmail.com</p>
    </div>
    <div class="col-md-8">
      <div class="row">
        <div class="col-sm-6 form-group">
          <input class="form-control" id="contact_name" name="name" placeholder="이름" type="text" required>
        </div>
        <div class="col-sm-6 form-group">
          <input class="form-control" id="contact_email" name="email" placeholder="이메일" type="email" required>
        </div>
      </div>
      <textarea class="form-control" id="contact_comments" name="comments" placeholder="Comment" rows="5"></textarea>
      <br>
      <div class="row">
        <div class="col-md-12 form-group">
          <button id="contact_send" class="btn pull-right" type="submit">보내기 <span class="ti-reload rotating" style="display:none;"></span></button>
          <span id="contact_result" style="color:red; display:none;float:right;padding-top:0.5em;padding-right:1em;">test</span>
        </div>
      </div>
    </div>
  </div>
  <br>
  <!-- <h3 class="text-center">From The Blog</h3>
  <ul class="nav nav-tabs">
    <li class="active"><a data-toggle="tab" href="#home">Mike</a></li>
    <li><a data-toggle="tab" href="#menu1">Chandler</a></li>
    <li><a data-toggle="tab" href="#menu2">Peter</a></li>
  </ul>

  <div class="tab-content">
    <div id="home" class="tab-pane fade in active">
      <h2>Mike Ross, Manager</h2>
      <p>Man, we've been on the road for some time now. Looking forward to lorem ipsum.</p>
    </div>
    <div id="menu1" class="tab-pane fade">
      <h2>Chandler Bing, Guitarist</h2>
      <p>Always a pleasure people! Hope you enjoyed it as much as I did. Could I BE.. any more pleased?</p>
    </div>
    <div id="menu2" class="tab-pane fade">
      <h2>Peter Griffin, Bass player</h2>
      <p>I mean, sometimes I enjoy the show, but other times I enjoy other things.</p>
    </div>
  </div> -->
</div>

<script type="text/javascript">
  $("#contact_send").click( function(e) {

    var name = $("#contact_name").val();
    var email = $("#contact_email").val();
    var comments = $("#contact_comments").val();

    if(name === '') {
      $("#contact_result").text('성함을 적어주세요 ^^').show();
      return false;
    }

    if(email === '') {
      $("#contact_result").text('이메일을 입력해주세요 ^^').show();
      return false;
    }

    if(!ValidateEmail(email)){
      $("#contact_result").text('이메일 형식을 확인해주세요 ^^').show();
      return false;
    }

    if(comments === ''){
      $("#contact_result").text('내용을 적어주세요 ^^').show();
      return false;
    }

    $("#contact_result").hide();
    var values = {
      'name' : name,
      'email' : email,
      'comments' : comments
    };

    // $("#contact_send").empty();
    $("#contact_send span.ti-reload").addClass('rotating').css('display', 'block');

    customAjax($SITE_URL+'email/request', values, function(result){
      $("#contact_send span.ti-reload").removeClass('rotating').css('display', 'none');

      if(result === 'success'){
        $("#contact_result").text('전송이 완료되었습니다').show();
        $("#contact_name").val('');
        $("#contact_email").val('');
        $("#contact_comments").val('');
        setTimeout(function(){
          $("#contact_result").hide();
        }, 5000);
      }
      else{
        $("#contact_result").text('전송이 실패했습니다. 다시 시도해주세요');
        setTimeout(function(){
          $("#contact_result").hide();
        }, 5000);
      }
    });

  });
</script>
