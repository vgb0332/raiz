<div class="modal fade" id="modalLoginForm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header text-center">
                <h4 class="modal-title w-100 font-weight-bold">로그인</h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body mx-3">
                <div class="md-form mb-5">
                    <i class="fa fa-envelope prefix grey-text"></i>
                    <input type="email" id="defaultForm-email" class="form-control validate">
                    <label data-error="" data-success="" for="defaultForm-email">
                      이메일 <span type="email" class='check-span' style="display:none;"></span>
                    </label>
                </div>

                <div class="md-form mb-4">
                    <i class="fa fa-lock prefix grey-text"></i>
                    <input type="password" id="defaultForm-pass" class="form-control validate">
                    <label data-error="" data-success="" for="defaultForm-pass">
                      비밀번호 <span type="password" class='check-span' style="display:none;"></span>
                    </label>
                </div>

            </div>
            <div class="modal-footer d-flex justify-content-center">
                <div class="options text-center text-md-right mt-1">
                    <div id="sns_login" class="">
                        <button id="facebook_login" class="btn facebook-color" onclick="loginWithFacebook();">Facebook 로그인</button>
                        <button id="kakao_login" class="btn daum-color" onclick="loginWithKakao();">카카오계정 로그인</button>
                        <button id="google_login" class="btn google-color">구글계정 로그인</button>
                        <button id="naverLogin" class="btn naver-color" onclick="loginWithNaver();">네이버계정 로그인</button>
                    </div>
                   <p><a id="forgot_id" href="#" class="blue-text">아이디</a>가 기억이 안나요</p>
                   <p><a id="forgot_pass" href="#" class="blue-text">비밀번호</a>가 기억이 안나요</p>
                   <p>회원이 아니신가요? <a href="#" id="not_user" class="raiz-color">회원가입</a></p>
                </div>
                <button id="raiz_login" class="btn raiz-background-color">로그인</button>
            </div>

        </div>
    </div>
</div>
