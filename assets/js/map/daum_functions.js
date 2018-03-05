function coord2RegionCode(coords, callback) {
    // 좌표로 법정동 상세 주소 정보를 요청합니다
    geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
}

// 키워드 검색을 요청하는 함수입니다
function searchPlacesByKeyword( keyword ) {

    if (!keyword.replace(/^\s+|\s+$/g, '')) {
        // alert('키워드를 입력해주세요!');
        return false;
    }

    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    ps.keywordSearch( keyword, fillKeywordSuggestions);
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
    if (status === daum.maps.services.Status.OK) {

        console.log(data);

    } else if (status === daum.maps.services.Status.ZERO_RESULT) {

        console.log('검색 결과가 존재하지 않습니다.');


    } else if (status === daum.maps.services.Status.ERROR) {

        console.log('검색 결과 중 오류가 발생했습니다.');


    }
}
