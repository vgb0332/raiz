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
            <div href="#rhouse-sil-filter" data-toggle='collapse' class="rhouse-filter-index">
              <span class="ti-filter" data-toggle="tooltip" data-placement="left" title="필터 검색"></span>
              <script type="text/javascript">
                $('[data-toggle="tooltip"]').tooltip();
              </script>
            </div>
            <div id="rhouse-sil-filter" class="collapse sil-filter-content">
              연립 조건입니다용!
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
            <div href="#store-sil-filter" data-toggle='collapse' class="store-filter-index">
              <span class="ti-filter" data-toggle="tooltip" data-placement="left" title="필터 검색"></span>
              <script type="text/javascript">
                $('[data-toggle="tooltip"]').tooltip();
              </script>
            </div>
            <div id="store-sil-filter" class="collapse sil-filter-content">
              상가 조건입니다용!
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
            <div href="#toji-sil-filter" data-toggle='collapse' class="toji-filter-index">
              <span class="ti-filter" data-toggle="tooltip" data-placement="left" title="필터 검색"></span>
              <script type="text/javascript">
                $('[data-toggle="tooltip"]').tooltip();
              </script>
            </div>
            <div id="toji-sil-filter" class="collapse sil-filter-content">
              토지 조건입니다용!
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
          <button type="button" id="stcsOnOff" class="btn-outline-success btn waves-effect">통계 Layer 켜기</button>
          <a onclick="initStcs();" class="icon-reload"></a>
        </div>
        <div>
          <a onclick="stat_side_btn(this.name)" id="stat-side-sido" name="">a</a></br>
          <a onclick="stat_side_btn(this.name)" id="stat-side-sgg" name="">b</a></br>
          <a onclick="stat_side_btn(this.name)" id="stat-side-dong" name="">c</a></br>
        </div>
        <div>
          <h4>통계지역 선택하기</h4>
          <div class="btn-group btn-toggle">
            <button class="btn btn-lg btn-default">OFF</button>
            <button id="stcsToggle" value="0" class="btn btn-lg">ON</button>
          </div>
        </div>
        <div>
          <button onclick="youdongStart();" style="width:130px" type="button" class="btn btn-pink">서울시 유동인구</button>
        </div>
        <div>
          <button type="button" style="width:130px" class="btn btn-indigo">상권 정보</button>
        </div>
        <div>
          <button type="button" style="width:130px" class="btn btn-brown">전자 지도 배경</button>
        </div>
        <div>
          <svg version="1.1" width="100%" height="50%" style="stroke: none; stroke-dashoffset: 0.5; stroke-linejoin: round; fill: none; position: relative; " viewBox="0 0 7215 5095">
            <!-- <defs></defs> -->
            <path style="fill:white" id="daum-maps-shape-322" d="M3839 2152 L3863 2156 3863 2158 3862 2161 3863 2163 3864 2166 3855 2194 3871 2200 3872 2219 3859 2258 3852 2263 3849 2296 3855 2305 3862 2301 3863 2301 3868 2304 3879 2292 3915 2284 3942 2265 3952 2273 3960 2304 3960 2311 3961 2312 3962 2317 3961 2319 3961 2321 3963 2323 3949 2323 3941 2324 3939 2325 3938 2325 3934 2324 3921 2348 3902 2388 3932 2404 3927 2420 3928 2420 3927 2421 3907 2448 3884 2457 3869 2474 3856 2468 3838 2479 3831 2497 3808 2504 3806 2522 3796 2525 3781 2527 3758 2508 3757 2465 3750 2463 3750 2465 3750 2467 3749 2468 3748 2471 3748 2472 3746 2473 3746 2475 3745 2476 3744 2476 3742 2477 3740 2477 3739 2479 3737 2479 3736 2479 3734 2479 3733 2479 3732 2480 3729 2481 3726 2480 3724 2480 3724 2479 3723 2477 3722 2477 3721 2475 3720 2474 3720 2473 3719 2472 3718 2470 3717 2468 3716 2466 3716 2463 3716 2462 3715 2460 3669 2489 3652 2508 3638 2509 3624 2514 3610 2489 3589 2508 3588 2509 3587 2511 3586 2512 3586 2514 3585 2516 3584 2517 3582 2518 3581 2518 3579 2517 3577 2517 3575 2517 3575 2516 3575 2514 3574 2513 3562 2484 3560 2485 3552 2478 3550 2462 3533 2433 3539 2422 3524 2416 3498 2434 3495 2448 3491 2446 3490 2446 3487 2446 3486 2445 3485 2446 3483 2446 3480 2446 3481 2444 3477 2441 3471 2444 3468 2444 3455 2447 3453 2447 3465 2423 3462 2418 3459 2417 3454 2414 3453 2414 3452 2407 3470 2386 3465 2374 3472 2358 3463 2335 3443 2327 3431 2337 3415 2322 3394 2318 3386 2308 3396 2303 3409 2275 3424 2261 3435 2247 3429 2233 3437 2221 3507 2278 3538 2267 3551 2240 3571 2247 3572 2208 3583 2184 3588 2152 3620 2140 3627 2131 3650 2138 3659 2178 3688 2166 3681 2132 3698 2116 3699 2091 3721 2083 3730 2053 3749 2057 3754 2070 3776 2066 3779 2080 3796 2065 3821 2062 3841 2075 3836 2092 3842 2110 3835 2126 3839 2152 Z" transform="translate(0,0)" class="stcs-polygon stcs-item">
            </path>
          </svg>
          <!-- <svg id="side-tab-svg" version="1.1" width="100%" height="100%" style="stroke: none; stroke-dashoffset: 0.5; stroke-linejoin: round; fill: none; position: relative;" viewBox="0 0 100 100">
            <defs></defs>
            <path id="daum-maps-shape-322" d=" M3839 2152 L3863 2156 3863 2158 3862 2161 3863 2163 3864 2166 3855 2194 3871 2200 3872 2219 3859 2258 3852 2263 3849 2296 3855 2305 3862 2301 3863 2301 3868 2304 3879 2292 3915 2284 3942 2265 3952 2273 3960 2304 3960 2311 3961 2312 3962 2317 3961 2319 3961 2321 3963 2323 3949 2323 3941 2324 3939 2325 3938 2325 3934 2324 3921 2348 3902 2388 3932 2404 3927 2420 3928 2420 3927 2421 3907 2448 3884 2457 3869 2474 3856 2468 3838 2479 3831 2497 3808 2504 3806 2522 3796 2525 3781 2527 3758 2508 3757 2465 3750 2463 3750 2465 3750 2467 3749 2468 3748 2471 3748 2472 3746 2473 3746 2475 3745 2476 3744 2476 3742 2477 3740 2477 3739 2479 3737 2479 3736 2479 3734 2479 3733 2479 3732 2480 3729 2481 3726 2480 3724 2480 3724 2479 3723 2477 3722 2477 3721 2475 3720 2474 3720 2473 3719 2472 3718 2470 3717 2468 3716 2466 3716 2463 3716 2462 3715 2460 3669 2489 3652 2508 3638 2509 3624 2514 3610 2489 3589 2508 3588 2509 3587 2511 3586 2512 3586 2514 3585 2516 3584 2517 3582 2518 3581 2518 3579 2517 3577 2517 3575 2517 3575 2516 3575 2514 3574 2513 3562 2484 3560 2485 3552 2478 3550 2462 3533 2433 3539 2422 3524 2416 3498 2434 3495 2448 3491 2446 3490 2446 3487 2446 3486 2445 3485 2446 3483 2446 3480 2446 3481 2444 3477 2441 3471 2444 3468 2444 3455 2447 3453 2447 3465 2423 3462 2418 3459 2417 3454 2414 3453 2414 3452 2407 3470 2386 3465 2374 3472 2358 3463 2335 3443 2327 3431 2337 3415 2322 3394 2318 3386 2308 3396 2303 3409 2275 3424 2261 3435 2247 3429 2233 3437 2221 3507 2278 3538 2267 3551 2240 3571 2247 3572 2208 3583 2184 3588 2152 3620 2140 3627 2131 3650 2138 3659 2178 3688 2166 3681 2132 3698 2116 3699 2091 3721 2083 3730 2053 3749 2057 3754 2070 3776 2066 3779 2080 3796 2065 3821 2062 3841 2075 3836 2092 3842 2110 3835 2126 3839 2152 Z" transform="translate(0,0)" class="stcs-polygon stcs-item">
            </path>
          </svg> -->
        </div>
      </div>
      <div class="search-footer">
      </div>
  </div>
</div>
