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

                <input id="keyword-input" autocomplete="off" type="text" class="form-control" name="keyword" placeholder="  키워드를 입력하세요">
                <span onclick="javascript:return false;"id="keyword-submit" class="input-group-addon"><i class="ti-search" style="color:#ffffff;"></i></span>

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
            <li id="rhouse-sil-btn" data-index='1'>
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
          <li id="apt-sil" data-index='0'>
            <div class="sil-location-name">
            </div>
            <div class="form-group">
                <div href="#apt-sil-filter" data-toggle='collapse' class="sil-filter-index">
                  <span class="ti-filter" data-toggle="tooltip" data-placement="left" title="필터 검색"></span>
                  <script type="text/javascript">
                    $('[data-toggle="tooltip"]').tooltip();
                  </script>
                </div>

                <div id="apt-sil-filter" class="collapse sil-filter-content">
                    <div class="sil-filter-dropdown">
                      <button class="btn" btn-primary dropdown-toggle type="button" data-toggle="dropdown">
                        기간 선택(기본값: 최근 1년) <span class="caret"></span>
                      </button>
                      <ul class="dropdown-menu sil-filter-dropdown-menu">
                        <li data-type=month value=6> 최근 6개월 </li>
                        <li data-type=year value=1>  최근 1년  </li>
                        <li data-type=year value=2>  최근 2년  </li>
                        <li data-type=year value=3>  최근 3년  </li>
                        <li data-type=year value=4>  최근 4년  </li>
                        <li data-type=year value=5>  최근 5년  </li>
                      </ul>
                      <div class="filter-search-btn" style="width:100%; height:50px;">
                          <span class="ti-reload"></span>
                      </div>

                    </div>

                </div>
            </div>
            <div class="sil-result-container">
              <div class="cs-loader">
                <div class="cs-loader-inner">
                  <label>	●</label><label> ●</label>
                  <label>	●</label><label> ●</label>
                  <label>	●</label><label> ●</label>
                </div>
              </div>
              <ul class="sil-result-list">
              </ul>
            </div>
          </li>
          <li id="rhouse-sil" data-index='1'>
            <div class="sil-location-name">
            </div>
            <div class="form-group">
                <div href="#rhouse-sil-filter" data-toggle='collapse' class="sil-filter-index">
                  <span class="ti-filter" data-toggle="tooltip" data-placement="left" title="필터 검색"></span>
                  <script type="text/javascript">
                    $('[data-toggle="tooltip"]').tooltip();
                  </script>
                </div>
            </div>
            <div id="rhouse-sil-filter" class="collapse sil-filter-content">
              <div class="sil-filter-dropdown">
                <button class="btn" btn-primary dropdown-toggle type="button" data-toggle="dropdown">
                  기간 선택(기본값: 최근 1년) <span class="caret"></span>
                </button>
                <ul class="dropdown-menu sil-filter-dropdown-menu">
                  <li data-type=month value=6> 최근 6개월 </li>
                  <li data-type=year value=1>  최근 1년  </li>
                  <li data-type=year value=2>  최근 2년  </li>
                  <li data-type=year value=3>  최근 3년  </li>
                  <li data-type=year value=4>  최근 4년  </li>
                  <li data-type=year value=5>  최근 5년  </li>
                </ul>
                <div class="filter-search-btn" style="width:100%; height:50px;">
                    <span class="ti-reload"></span>
                </div>

              </div>
            </div>
            <div class="sil-result-container">
              <div class="cs-loader">
                <div class="cs-loader-inner">
                  <label>	●</label><label> ●</label>
                  <label>	●</label><label> ●</label>
                  <label>	●</label><label> ●</label>
                </div>
              </div>
              <ul class="sil-result-list">
              </ul>
            </div>
          </li>
          <li id="store-sil" data-index='2'>
            <div class="sil-location-name">
            </div>
            <div href="#store-sil-filter" data-toggle='collapse' class="sil-filter-index">
              <span class="ti-filter" data-toggle="tooltip" data-placement="left" title="필터 검색"></span>
              <script type="text/javascript">
                $('[data-toggle="tooltip"]').tooltip();
              </script>
            </div>
            <div id="store-sil-filter" class="collapse sil-filter-content">
              <div class="sil-filter-dropdown">
                <button class="btn" btn-primary dropdown-toggle type="button" data-toggle="dropdown">
                  기간 선택(기본값: 최근 1년) <span class="caret"></span>
                </button>
                <ul class="dropdown-menu sil-filter-dropdown-menu">
                  <li data-type=month value=6> 최근 6개월 </li>
                  <li data-type=year value=1>  최근 1년  </li>
                  <li data-type=year value=2>  최근 2년  </li>
                  <li data-type=year value=3>  최근 3년  </li>
                  <li data-type=year value=4>  최근 4년  </li>
                  <li data-type=year value=5>  최근 5년  </li>
                </ul>
                <div class="filter-search-btn" style="width:100%; height:50px;">
                    <span class="ti-reload"></span>
                </div>

              </div>
            </div>
            <div class="sil-result-container">
              <div class="cs-loader">
                <div class="cs-loader-inner">
                  <label>	●</label><label> ●</label>
                  <label>	●</label><label> ●</label>
                  <label>	●</label><label> ●</label>
                </div>
              </div>
              <ul class="sil-result-list">
              </ul>
            </div>
          </li>
          <li id="toji-sil" data-index='3'>
            <div class="sil-location-name">
            </div>
            <div href="#toji-sil-filter" data-toggle='collapse' class="sil-filter-index">
              <span class="ti-filter" data-toggle="tooltip" data-placement="left" title="필터 검색"></span>
              <script type="text/javascript">
                $('[data-toggle="tooltip"]').tooltip();
              </script>
            </div>
            <div id="toji-sil-filter" class="collapse sil-filter-content">
              <div class="sil-filter-dropdown">
                <button class="btn" btn-primary dropdown-toggle type="button" data-toggle="dropdown">
                  기간 선택(기본값: 최근 1년) <span class="caret"></span>
                </button>
                <ul class="dropdown-menu sil-filter-dropdown-menu">
                  <li data-type=month value=6> 최근 6개월 </li>
                  <li data-type=year value=1>  최근 1년  </li>
                  <li data-type=year value=2>  최근 2년  </li>
                  <li data-type=year value=3>  최근 3년  </li>
                  <li data-type=year value=4>  최근 4년  </li>
                  <li data-type=year value=5>  최근 5년  </li>
                </ul>
                <div class="filter-search-btn" style="width:100%; height:50px;">
                    <span class="ti-reload"></span>
                </div>

              </div>
            </div>
            <div class="sil-result-container">
              <div class="cs-loader">
                <div class="cs-loader-inner">
                  <label>	●</label><label> ●</label>
                  <label>	●</label><label> ●</label>
                  <label>	●</label><label> ●</label>
                </div>
              </div>
              <ul class="sil-result-list">
              </ul>
            </div>
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

        <ul class="raiz-side-tab-list">
            <li id="apt-junwal-btn" data-index='0'>
                <button class="btn">아파트&nbsp;<span class="ti-angle-down"></span></button>
            </li>
            <li id="rhouse-junwal-btn" data-index='1'>
                <button class="btn">연립다세대&nbsp;<span class="ti-angle-down"></span></button>
            </li>
        </ul>
        <ul class="raiz-side-tab-content">

            <li id="apt-junwal" data-index='0'>
              <div class="junwal-location-name">
              </div>
              <div href="#apt-junwal-filter" data-toggle='collapse' class="junwal-filter-index">
                <span class="ti-filter" data-toggle="tooltip" data-placement="left" title="필터 검색"></span>
                <script type="text/javascript">
                  $('[data-toggle="tooltip"]').tooltip();
                </script>
              </div>
              <div id="apt-junwal-filter" class="collapse junwal-filter-content">
                  <div class="junwal-filter-dropdown">
                    <button class="btn" btn-primary dropdown-toggle type="button" data-toggle="dropdown">
                      기간 선택(기본값: 최근 1년) <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu junwal-filter-dropdown-menu">
                      <li data-type=month value=6> 최근 6개월 </li>
                      <li data-type=year value=1>  최근 1년  </li>
                      <li data-type=year value=2>  최근 2년  </li>
                      <li data-type=year value=3>  최근 3년  </li>
                      <li data-type=year value=4>  최근 4년  </li>
                      <li data-type=year value=5>  최근 5년  </li>
                    </ul>
                    <div class="filter-search-btn" style="width:100%; height:50px;">
                        <span class="ti-reload"></span>
                    </div>

                  </div>

              </div>
              <div class="junwal-result-container">
                <div class="cs-loader">
                  <div class="cs-loader-inner">
                    <label>	●</label><label> ●</label>
                    <label>	●</label><label> ●</label>
                    <label>	●</label><label> ●</label>
                  </div>
                </div>
                <ul class="junwal-result-list">
                </ul>
              </div>
            </li>
            <li id="rhouse-junwal" data-index='1'>
              <div class="junwal-location-name">
              </div>
              <div href="#rhouse-junwal-filter" data-toggle='collapse' class="junwal-filter-index">
                <span class="ti-filter" data-toggle="tooltip" data-placement="left" title="필터 검색"></span>
                <script type="text/javascript">
                  $('[data-toggle="tooltip"]').tooltip();
                </script>
              </div>
              <div id="rhouse-junwal-filter" class="collapse junwal-filter-content">
                <div class="junwal-filter-dropdown">
                  <button class="btn" btn-primary dropdown-toggle type="button" data-toggle="dropdown">
                    기간 선택(기본값: 최근 1년) <span class="caret"></span>
                  </button>
                  <ul class="dropdown-menu junwal-filter-dropdown-menu">
                    <li data-type=month value=6> 최근 6개월 </li>
                    <li data-type=year value=1>  최근 1년  </li>
                    <li data-type=year value=2>  최근 2년  </li>
                    <li data-type=year value=3>  최근 3년  </li>
                    <li data-type=year value=4>  최근 4년  </li>
                    <li data-type=year value=5>  최근 5년  </li>
                  </ul>
                  <div class="filter-search-btn" style="width:100%; height:50px;">
                      <span class="ti-reload"></span>
                  </div>

                </div>
              </div>
              <div class="junwal-result-container">
                <div class="cs-loader">
                  <div class="cs-loader-inner">
                    <label>	●</label><label> ●</label>
                    <label>	●</label><label> ●</label>
                    <label>	●</label><label> ●</label>
                  </div>
                </div>
                <ul class="junwal-result-list">
                </ul>
              </div>
            </li>

        </ul>
      </div>
      <div class="junwal-footer">

      </div>
  </div>

  <div class="raiz-side-tab raiz-stat-tab" style="display:none;">
      <div class="side-tab-header stat-header">
        <span class="ti-stat"> 통계</span>
        <span class="raiz-side-tab-return ti-angle-left"></span>
      </div>
      <div class="stat-body" style="text-align:center;">
        <div>
          <button type="button" id="stcsOnOff" class="btn-success btn waves-effect">통계 Layer 켜기</button>
          <a onclick="initStcs();" class="icon-reload" style="position: absolute;padding-top: 15px;"></a>
          <div id="stcsLayer" style="display:none">
            <h4>통계지역 선택하기</h4>
            <div class="btn-group btn-toggle" data-toggle="tooltip" data-placement="right" title="on일때, 지역을 클릭하시면 통계를 볼 수 있습니다">
              <script type="text/javascript">
                $('[data-toggle="tooltip"]').tooltip();
              </script>
              <button class="btn btn-lg btn-default">OFF</button>
              <button id="stcsToggle" value="0" class="btn btn-lg">ON</button>
            </div>
            <div>
              <a onclick="stat_side_btn(this.name)" id="stat-side-sido" name=""></a></br>
              <a onclick="stat_side_btn(this.name)" id="stat-side-sgg" name=""></a></br>
              <a onclick="stat_side_btn(this.name)" id="stat-side-dong" name=""></a></br>
            </div>
          </div>
        </div>
        <hr>
        <div>
          <button onclick="youdongStart();" style="width:115px" type="button" class="btn btn-pink">서울시 유동인구</button>
        </div>
        <div>
          <button onclick="bizStart();" type="button" style="width:115px" class="btn btn-indigo">상권 정보</button>
        </div>
        <div>
          <button onclick="GM_test();" type="button" style="width:115px" class="btn btn-brown">경매 매물(test)</button>
        </div>
      </div>
      <div class="search-footer">
      </div>
  </div>
</div>
