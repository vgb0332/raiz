"use strict"

var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new daum.maps.LatLng(37.56642102997891, 126.97877971258067), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
        disableDoubleClickZoom: true,
    };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new daum.maps.Map(mapContainer, mapOption);

var geocoder = new daum.maps.services.Geocoder();

var categoryOverlay = new daum.maps.CustomOverlay({});

/*
  ajax_type => DB에서 데이터를 요청할 때, 타입을 지정해주어 폴리곤의 형태를 정한다.
            => toji : 토지
            => building : 건물
            => toji_sil : 토지 실거래
  ** 각 타입에 맞는 폴리곤도 지정해주세요
*/
var ajax_type = 'toji';
