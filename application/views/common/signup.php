
<div class="modal fade" id="modalRegisterForm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header text-center">
                <h4 class="modal-title w-100 font-weight-bold">회원가입</h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div id="modalRegisterForm_info" class="modal-body mx-3">
                <div class="signup-nickname md-form mb-5">
                    <i class="fa ti-user prefix"></i>
                    <input type="text" id="name" class="form-control">
                    <label data-error="" data-success="" for="orangeForm-name">
                      닉네임 <span class='check-span' style="display:none;"></span>
                    </label>
                </div>
                <div class="signup-email md-form mb-5">
                    <i class="fa ti-email prefix"></i>
                    <input type="email" id="email" class="form-control">
                    <label data-error="" data-success="" for="orangeForm-email">
                      이메일 <span class='check-span' style="display:none;"></span>
                    </label>
                </div>

                <div class="signup-pass md-form mb-5">
                    <i class="fa ti-lock prefix"></i>
                    <input type="password" id="raiz_pass" class="form-control">
                    <label data-error="" data-success="" for="orangeForm-raiz_pass">
                      비밀번호  <span class='check-span' style="display:none;"></span>
                    </label>
                </div>

                <div class="signup-passcheck md-form mb-5">
                    <i class="fa ti-check prefix"></i>
                    <input type="password" id="pass_check" class="form-control">
                    <label data-error="" data-success="" for="orangeForm-pass_check">
                      비밀번호 확인 <span class='check-span' style="display:none;"></span>
                    </label>
                </div>

                <div class="signup-birthday md-form mb-5">
                    <i class="fa ti-gift prefix"></i>
                    <input type="date" id="birthday" class="form-control">
                    <label style="left: 6rem;" data-success="O" for="orangeForm-birthday">
                      <span class='check-span' ></span>
                    </label>
                </div>

                <div class="signup-sex md-form mb-5">
                    <i class="fa ti-heart" style="font-size:2rem;"></i>
                    <button data-value='male' type="button" class="btn btn-blue-grey">남자</button>
                    <button data-value='female' type="button" class="btn btn-blue-grey">여자</button>
                    <span style="display:none;" class='check-span' ></span>
                </div>

            </div>
            <div class="modal-footer d-flex justify-content-center">
                <div class="options text-center text-md-right mt-1">
                  <p>이미 회원이신가요? <a href="#" id='already_user' class="raiz-color">로그인</a></p>
                </div>
                <button id="register" class="btn raiz-background-color">가입하기</button>
            </div>
        </div>
    </div>
</div>
