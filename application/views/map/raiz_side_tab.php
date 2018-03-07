<div class="raiz-side-tab-container">
  <!-- RAIZ SEARCH TAB -->
  <div class="raiz-side-tab raiz-search-tab" style="display:none;">
      <div class="side-tab-header search-header">
        <span class="ti-search"> 검색</span>
        <span class="raiz-side-tab-return ti-arrow-circle-left"></span>
      </div>
      <div class="search-body">
          <ul class="raiz-side-tab-list">
              <li id="keyword-search-btn" data-index='0'>
                  <button class="btn">키워드 검색&nbsp;&nbsp;&nbsp;&nbsp;<span class="ti-angle-down"></span></button>
              </li>
              <li id="jibun-search-btn" data-index='1'>
                  <button class="btn">지번 검색&nbsp;&nbsp;&nbsp;&nbsp;<span class="ti-angle-down"></span></button>
              </li>
              <li id="building-search-btn" data-index='2'>
                  <button class="btn">건물 검색&nbsp;&nbsp;&nbsp;&nbsp;<span class="ti-angle-down"></span></button>
              </li>
              <li id="toji-search-btn" data-index='3'>
                  <button class="btn">토지 검색&nbsp;&nbsp;&nbsp;&nbsp;<span class="ti-angle-down"></span></button>
              </li>
          </ul>

          <!-- 위의 리스트와 동일한 순서의 컨텐츠가 들어가야합니다. -->
          <ul class="raiz-side-tab-content">
            <li id="keyword-search-list" data-index='0'>
              <div id="keyword-input-group" class="keyword-search input-group">

                <input id="keyword-input" autocomplete="off" type="text" class="form-control" name="keyword" placeholder="키워드를 입력하세요">
                <span onclick="javascript:return false;"id="keyword-submit" class="input-group-addon"><i class="glyphicon glyphicon-search" style="color:#ffffff;"></i></span>

              </div>
              <div class="keyword-suggestions">

                <ul class="keyword-suggestions-list-group">

                </ul>

              </div>
              <div class="keyword-result">
                <ul class="keyword-result-list-group">

                </ul>
              </div>
            </li>
            <li id="jibun-search-list" data-index='1'>
              <div id="jibun-input-group" class="keyword-search input-group">

                <input id="jibun-input" autocomplete="off" type="text" class="form-control" name="jibun" placeholder="주소를 입력하세요">
                <span onclick="javascript:console.log('jibun-search');" id="jibun-submit" class="input-group-addon"><i class="glyphicon glyphicon-search" style="color:#ffffff;"></i></span>

              </div>
              <div class="jibun-suggestions">

                <ul class="jibun-suggestions-list-group">

                </ul>

              </div>
              <div class="jibun-result">
                <ul class="jibun-result-list-group">

                </ul>
              </div>
            </li>
            <li id="building-search-list" data-index='2'>
              건물 검색
            </li>
            <li id="toji-search-list" data-index='3'>
              토지 검색
            </li>
          </ul>
      </div>
      <div class="search-footer">

      </div>
  </div>

  <!-- RAIZ SIL TAB -->
  <div class="raiz-side-tab raiz-sil-tab" style="display:none;">
      <div class="side-tab-header sil-header">
        <span class="ti-map-alt"> 실거래 </span>
        <span class="raiz-side-tab-return ti-angle-left"></span>
      </div>
      <div class="sil-body">

        <ul class="raiz-side-tab-list">
            <li id="apt-sil-btn" data-index='0'>
                <button class="btn">아파트&nbsp;<span class="ti-angle-down"></span></button>
            </li>
            <li id="yunlip-sil-btn" data-index='1'>
                <button class="btn">연립다세대&nbsp;<span class="ti-angle-down"></span></button>
            </li>
            <li id="store-sil-btn" data-index='2'>
                <button class="btn">상업/업무&nbsp;<span class="ti-angle-down"></span></button>
            </li>
            <li id="toji-sil-btn" data-index='3'>
                <button class="btn">토지&nbsp;<span class="ti-angle-down"></span></button>
            </li>
        </ul>

        <!-- 위의 리스트와 동일한 순서의 컨텐츠가 들어가야합니다. -->
        <ul class="raiz-side-tab-content">
          <li id="apt-sil-list" data-index='0'>

          </li>
          <li id="yunlip-sil-list" data-index='1'>

          </li>
          <li id="store-sil-list" data-index='2'>

          </li>
          <li id="toji-sil-list" data-index='3'>

          </li>
        </ul>

      </div>

      <div class="sil-footer">

      </div>
  </div>

  <!-- RAIZ JUNWAL TAB -->
  <div class="raiz-side-tab raiz-junwal-tab" style="display:none;">
      <div class="side-tab-header junwal-header">
        <span class="ti-package"> 전월세 </span>
        <span class="raiz-side-tab-return ti-angle-left"></span>
      </div>
      <div class="junwal-body">

      </div>
      <div class="junwal-footer">

      </div>
  </div>

  <div class="raiz-side-tab raiz-stat-tab" style="display:none;">
      <div class="side-tab-header stat-header">
        <span class="ti-stat"> 통계</span>
        <span class="raiz-side-tab-return ti-angle-left"></span>
      </div>
      <div class="stat-body">

          <a onclick="stat_side_btn(this.name)" id="stat-side-sido" name="">a</a></br>
          <a onclick="stat_side_btn(this.name)" id="stat-side-sgg" name="">b</a></br>
          <a onclick="stat_side_btn(this.name)" id="stat-side-dong" name="">c</a></br>

          <ul class="raiz-side-tab-list">
              <li>
                  <button class="btn" onclick="getStcsPopdens();">인구 밀도 x&nbsp;&nbsp;&nbsp;&nbsp;<span class="ti-angle-down"></span></button>
              </li>
              <li>
                  <button class="btn">유년 부양비 x&nbsp;&nbsp;&nbsp;&nbsp;<span class="ti-angle-down"></span></button>
              </li>
              <li>
                  <button class="btn" onclick="getStcsOldind();">노령화 지수&nbsp;&nbsp;&nbsp;&nbsp;<span class="ti-angle-down"></span></button>
              </li>
              <li>
                  <button class="btn">노년 부양비 x&nbsp;&nbsp;&nbsp;&nbsp;<span class="ti-angle-down"></span></button>
              </li>
          </ul>

          <!-- 위의 리스트와 동일한 순서의 컨텐츠가 들어가야합니다. -->
          <ul class="raiz-side-tab-content">
            <li>
              인구 밀도
            </li>
            <li>
              유년 부양비
            </li>
            <li>
              노령화 지수
            </li>
            <li>
              노년 부양비
              <button class="offset">Offset</button>
              <button class="offset">Offset</button>
              <button class="offset">Offset</button>
              <button class="offset">Offset</button>
            </li>
          </ul>
      </div>
      <div class="search-footer">

      </div>
  </div>

</div>
