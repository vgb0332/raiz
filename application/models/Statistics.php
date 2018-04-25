<?php

Class Statistics extends CI_Model {
  function __construct(){
    parent::__construct();
  }


  function getStcsSido(){
    $query = $this->db->query(
              "SELECT sidoCd , sidoNm , ST_AsText(polygon) as polygon #, ST_AsText(point) as center
              FROM raiz2.sensusHJsido
              ");
    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }


  function getStcsSgg($code){
      $query = $this->db->query(
                "SELECT sigunguCd , sigunguNm , ST_AsText(polygon) as polygon #, ST_AsText(ST_Centroid(polygon)) as center
                FROM raiz2.sensusHJsgg
                WHERE sigunguCd LIKE '$code%';
                ");
    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsDong($code){
      $query = $this->db->query(
                "SELECT a.dongCd , a.dongNm , ST_AsText(a.polygon) as polygon #, ST_AsText(ST_Centroid(a.polygon)) as center
                FROM raiz2.HJcode as b
                JOIN raiz2.sensusHJdong as a ON b.emdCd = a.dongCd
                WHERE b.sigunguHJCd = $code
                ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsAggr($code){
      $query = $this->db->query(
                "SELECT dongCd, TOT_REG_CD, SHAPE_AREA, TOTAL_POP, MEDIUM_AGE, ST_AsText(polygon) as polygon #, ST_AsText(ST_Centroid(polygon)) as center
                FROM raiz2.sensusHJaggzone
                where dongCd = $code
                ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsTotaljobs($code){
      $query = $this->db->query(
                "SELECT value
                FROM raiz2.2016TotalJobs
                WHERE tot_oa_cd = $code
                ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsTotalHouse($code,$type){
    if ($type == '집계구') {
      $query = $this->db->query(
                "SELECT value
                FROM raiz2.2016TotalHouse
                WHERE tot_oa_cd = $code
                ");
    }
    elseif ($type == '읍면동' || $type == '시군구') {
      $query = $this->db->query(
                "SELECT sum(value) as value
                FROM raiz2.2016TotalHouse
                WHERE tot_oa_cd like '$code%'
                ");
    }

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsHouseSize($code,$type){
    if ($type == '집계구') {
      $query = $this->db->query(
                "SELECT a.name,b.value
                FROM raiz2.stcsCd as a, (select * from raiz2.2016HouseSize where tot_oa_cd = $code) as b
                WHERE a.item = b.item
                ");
    }
    elseif ($type == '읍면동' || $type == '시군구') {
      $query = $this->db->query(
                "SELECT a.name,b.value
                FROM raiz2.stcsCd as a,
                (select base_year, tot_oa_cd, item, sum(value) as value from raiz2.2016HouseSize where tot_oa_cd like '$code%' group by item) as b
                WHERE a.item = b.item
                ");
    }


    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsHouseHold($code,$type){
    if ($type == '집계구') {
      $query = $this->db->query(
                "SELECT a.name,b.value
                FROM raiz2.stcsCd as a, (select * from raiz2.2016HouseHold where tot_oa_cd = $code) as b
                WHERE a.item = b.item
                ");
    }
    elseif ($type == '읍면동' || $type == '시군구') {
      $query = $this->db->query(
                "SELECT a.name,b.value
                FROM raiz2.stcsCd as a,
                (select base_year, tot_oa_cd, item, sum(value) as value from raiz2.2016HouseHold where tot_oa_cd like '$code%' group by item) as b
                WHERE a.item = b.item
                ");
    }


    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsTotalFamily($code,$type){
    if ($type == '집계구') {
      $query = $this->db->query(
                "SELECT a.name,b.value
                FROM raiz2.stcsCd as a, (select * from raiz2.2016TotalFamily where tot_oa_cd = $code) as b
                WHERE a.item = b.item
                ");
    }
    elseif ($type == '읍면동' || $type == '시군구') {
      $query = $this->db->query(
                "SELECT a.name,b.value
                FROM raiz2.stcsCd as a,
                (select base_year, tot_oa_cd, item, sum(value) as value from raiz2.2016TotalFamily where item = 'to_ga_001' and tot_oa_cd like '$code%' group by item) as b
                WHERE a.item = b.item
                UNION
                SELECT a.name,c.value
                FROM raiz2.stcsCd as a,
                (select base_year, tot_oa_cd, item, round(avg(value),2) as value from raiz2.2016TotalFamily where item = 'to_ga_002' and tot_oa_cd like '$code%' group by item) as c
                where a.item = c.item;
                ");
    }


    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsJobsPop($code,$type){
    if ($type == '집계구') {
      $query = $this->db->query(
                "SELECT a.name,b.value
                FROM raiz2.stcsCd as a, (select * from raiz2.2016JobsPop where tot_oa_cd = $code) as b
                WHERE a.item = b.item
                ");
    }
    elseif ($type == '읍면동' || $type == '시군구') {
      $query = $this->db->query(
                "SELECT a.name,b.value
                FROM raiz2.stcsCd as a,
                (select base_year, tot_oa_cd, item, sum(value) as value from raiz2.2016JobsPop where tot_oa_cd like '$code%' group by item) as b
                WHERE a.item = b.item
                ");
    }


    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsJobsBiz($code,$type){
    if ($type == '집계구') {
      $query = $this->db->query(
                "SELECT a.name,b.value
                FROM raiz2.stcsCd as a, (select * from raiz2.2016JobsBiz where tot_oa_cd = $code) as b
                WHERE a.item = b.item
                ");
    }
    elseif ($type == '읍면동' || $type == '시군구') {
      $query = $this->db->query(
                "SELECT a.name,b.value
                FROM raiz2.stcsCd as a,
                (select base_year, tot_oa_cd, item, sum(value) as value from raiz2.2016JobsBiz where tot_oa_cd like '$code%' group by item) as b
                WHERE a.item = b.item
                ");
    }


    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsHouseType($code,$type){
    if ($type == '집계구') {
      $query = $this->db->query(
                "SELECT a.name,b.value
                FROM raiz2.stcsCd as a, (select * from raiz2.2016HouseType where tot_oa_cd = $code) as b
                WHERE a.item = b.item
                ");
    }
    elseif ($type == '읍면동' || $type == '시군구') {
      $query = $this->db->query(
                "SELECT a.name,b.value
                FROM raiz2.stcsCd as a,
                (select base_year, tot_oa_cd, item, sum(value) as value from raiz2.2016HouseType where tot_oa_cd like '$code%' group by item) as b
                WHERE a.item = b.item
                ");
    }


    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsSexAge($code,$type){
    if ($type == '집계구') {
      $query = $this->db->query(
                "SELECT right(item,2) as item,value
                FROM raiz2.2016SexAgePop
                WHERE tot_oa_cd = $code
                and right(item,3) > 30"
                );
    }
    elseif ($type == '읍면동' || $type == '시군구') {
      $index = substr($code,0,2);
      $index = (int)$index;
      $query = $this->db->query(
                "SELECT right(item,2) as item,sum(value) as value
                FROM raiz2.2016SexAgePop
                WHERE tot_oa_cd > ($index-1)*100000000000 and tot_oa_cd < ($index+1)*100000000000 and
                right(item,3) > 30
                and tot_oa_cd like '$code%' group by item;"
                );
    }

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsOldind($code,$type){
    if ($type == '집계구') {
      $query = $this->db->query(
                "SELECT value
                FROM raiz2.2016OldIndices
                WHERE tot_oa_cd = $code
                ");
    }
    elseif ($type == '읍면동' || $type == '시군구') {
      $query = $this->db->query(
                "SELECT round(avg(value),2) as value
                FROM raiz2.2016OldIndices
                WHERE tot_oa_cd like '$code%' group by item;
                ");
    }


    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsPopdens($code,$type){
    if ($type == '집계구') {
      $query = $this->db->query(
                "SELECT value
                FROM raiz2.2016PopDensity
                WHERE tot_oa_cd = $code
                ");
    }
    elseif ($type == '읍면동' || $type == '시군구') {
      $query = $this->db->query(
                "SELECT round(avg(value),2) as value
                FROM raiz2.2016PopDensity
                WHERE tot_oa_cd like '$code%' group by item;
                ");
    }


    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsSupportY($code,$type){
    if ($type == '집계구') {
      $query = $this->db->query(
                "SELECT value
                FROM raiz2.2016SupportYoung
                WHERE tot_oa_cd = $code
                ");
    }
    elseif ($type == '읍면동' || $type == '시군구') {
      $query = $this->db->query(
                "SELECT round(avg(value),2) as value
                FROM raiz2.2016SupportYoung
                WHERE tot_oa_cd like '$code%' group by item;
                ");
    }

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsSupportO($code,$type){
    if ($type == '집계구') {
      $query = $this->db->query(
                "SELECT value
                FROM raiz2.2016SupportOld
                WHERE tot_oa_cd = $code
                ");
    }
    elseif ($type == '읍면동' || $type == '시군구') {
      $query = $this->db->query(
                "SELECT round(avg(value),2) as value
                FROM raiz2.2016SupportOld
                WHERE tot_oa_cd like '$code%' group by item;
                ");
    }


    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsAggrSum($code){
    $query = $this->db->query(
              "SELECT sum(SHAPE_AREA) as SHAPE_AREA,sum(TOTAL_POP) as TOTAL_POP,avg(MEDIUM_AGE) as MEDIUM_AGE
              FROM raiz2.sensusHJaggzone
              where dongCd like '$code%'
              ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getYoudongPoint($code){
    // $query = $this->db->query(
    //           "SELECT code, name, sigunguCd, dongCd, aggCd, ST_AsText(point) as point #, ST_AsText(point) as center
    //           FROM raiz2.youdong_seoul_locationCd
    //           WHERE sigunguCd = $code;
    //           ");
    $query = $this->db->query(
              "SELECT a.code, a.name , b.type , b.day, b.time, b.value, astext(a.point) as point
              FROM (SELECT * FROM raiz2.youdong_seoul_locationCd where sigunguCd = $code) as a
              , raiz2.youdong_seoul_value as b
              WHERE a.code = b.code;
              ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getYoudongValue($code){
    $query = $this->db->query(
              "SELECT a.code, a.name , b.type , b.day, b.time, b.value, astext(a.point) as point
              FROM (SELECT * FROM raiz2.youdong_seoul_locationCd where sigunguCd = $code) as a
              , raiz2.youdong_seoul_value as b
              WHERE a.code = b.code;
              ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function gmtest($code) {
    // $code = substr($code, 0, 5);
    $query = $this->db->query(
              "SELECT * FROM raiz2.auction_mm where sigunguCd = $code;
              ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function gmSig($code) {
    // $code = substr($code, 0, 5);
    $query = $this->db->query(
              "SELECT address,sigunguCd,count(*) as sum FROM raiz2.auction_mm
              WHERE sigunguCd LIKE '$code%' GROUP BY sigunguCd;
              ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getBJDongPoly($code) {
    // $code = substr($code, 0, 5);
    $query = $this->db->query(
              "SELECT name,sigunguCd,bjdongCd,polygon FROM getEMD
              WHERE sigunguCd = $code;
              ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

function getParticBiz($bjdcode,$sggcode) {
  // $code = substr($code, 0, 5);
  $query = $this->db->query(
            "SELECT 상호명,지점명,상권업종대분류명,상권업종중분류명,상권업종소분류명,지번주소,층정보,법정동코드,경도,위도 FROM raiz2.getParticBiz
            WHERE 시군구코드 = $sggcode and RIGHT(법정동코드,5) = $bjdcode order by 지번주소;
            ");

  $result = $query->result_array();
  return json_encode($result, JSON_UNESCAPED_UNICODE);
}

function getFindArea($code1,$code2,$poly) {

  if ($code1 == $code2) {
    $query = $this->db->query(
              "SELECT polygon FROM getLandPolygonText
              WHERE sigunguCd = $code1 AND
              (st_within(ST_GeomFromText(polygon),ST_GeomFromText($poly)));
              ");
  }
  else {
    $query = $this->db->query(
              "SELECT polygon FROM getLandPolygonText
              WHERE sigunguCd = $code1 OR sigunguCd = $code2 AND
              (st_within(ST_GeomFromText(polygon),ST_GeomFromText($poly)));
              ");
  }

  $result = $query->result_array();
  return json_encode($result, JSON_UNESCAPED_UNICODE);
}


function getFindArea2($code1,$code2,$poly) {

  if ($code1 == $code2) {
    $query = $this->db->query(
              "SELECT m1.sigunguCd, m1.bjdongCd,m1.ldCodeNm as '주소', m1.bun as '번', m1.ji as '지', m1.lndpclAr as '면적', m1.lndcgrCodeNm as '지목', m1.prposArea1Nm as '용도지역 1', m1.prposArea2Nm as '용도지역 2', m1.tpgrphHgCodeNm as '지형높이', m1.tpgrphFrmCodeNm as '지형형상', m1.roadSideCodeNm as '도로접면' , m2.pblntfPclnd as '공시지가', m2.pblntfDe as '공시일', m1.PRICE as '실거래가', m1.YM as '거래년도', m1.DAY as '거래일' from
              (select c.sigunguCd,c.bjdongCd,c.ldCodeNm,c.bun,c.ji,c.lndcgrCodeNm,c.prposArea1Nm,c.prposArea2Nm,c.tpgrphHgCodeNm,c.tpgrphFrmCodeNm,c.roadSideCodeNm,c.lndpclAr,d.PRICE,d.YM,d.DAY from
              (select a.sigunguCd,a.bjdongCd,b.ldCodeNm,a.bun,a.ji,b.lndcgrCodeNm,b.prposArea1Nm,b.prposArea2Nm,b.tpgrphHgCodeNm,b.tpgrphFrmCodeNm,b.roadSideCodeNm,b.lndpclAr from
              (SELECT sigunguCd, bjdongCd, bun, ji FROM getLandPolygonText
              WHERE sigunguCd = $code1 AND
              st_within(ST_GeomFromText(polygon),ST_GeomFromText($poly))) as a,
              getLandCharacteristics as b
              WHERE b.sigunguCd = $code1 and a.bjdongCd = b.bjdongCd and a.bun = b.bun and a.ji = b.ji group by a.bjdongCd,a.bun,a.ji) as c
              LEFT JOIN (select * from (select * from getLandTrade where sigunguCd = $code1 order by YM desc) as tmp group by tmp.bjdongCd,tmp.bun_1,tmp.ji_1) as d
              on c.bjdongCd = d.bjdongCd and c.bun = d.bun_1 and c.ji = d.ji_1 order by bjdongCd,bun,ji,YM,DAY asc) as m1,
              (select bjdongCd,bun,ji,pblntfPclnd,pblntfDe from IndvdLandPriceService where sigunguCd = $code1) as m2
              WHERE m1.bjdongCd = m2.bjdongCd and m1.bun = m2.bun and m1.ji = m2.ji;
              ");
  }
  else {
    $query = $this->db->query(
              "SELECT m1.sigunguCd, m1.bjdongCd,m1.ldCodeNm as '주소', m1.bun as '번', m1.ji as '지', m1.lndpclAr as '면적', m1.lndcgrCodeNm as '지목', m1.prposArea1Nm as '용도지역 1', m1.prposArea2Nm as '용도지역 2', m1.tpgrphHgCodeNm as '지형높이', m1.tpgrphFrmCodeNm as '지형형상', m1.roadSideCodeNm as '도로접면' , m2.pblntfPclnd as '공시지가', m2.pblntfDe as '공시일', m1.PRICE as '실거래가', m1.YM as '거래년도', m1.DAY as '거래일' from
              (select c.sigunguCd,c.bjdongCd,c.ldCodeNm,c.bun,c.ji,c.lndcgrCodeNm,c.prposArea1Nm,c.prposArea2Nm,c.tpgrphHgCodeNm,c.tpgrphFrmCodeNm,c.roadSideCodeNm,c.lndpclAr,d.PRICE,d.YM,d.DAY from
              (select a.sigunguCd,a.bjdongCd,b.ldCodeNm,a.bun,a.ji,b.lndcgrCodeNm,b.prposArea1Nm,b.prposArea2Nm,b.tpgrphHgCodeNm,b.tpgrphFrmCodeNm,b.roadSideCodeNm,b.lndpclAr from
              (SELECT sigunguCd, bjdongCd, bun, ji FROM getLandPolygonText
              WHERE sigunguCd = $code1 AND
              st_within(ST_GeomFromText(polygon),ST_GeomFromText($poly))) as a,
              getLandCharacteristics as b
              WHERE b.sigunguCd = $code1 and a.bjdongCd = b.bjdongCd and a.bun = b.bun and a.ji = b.ji group by a.bjdongCd,a.bun,a.ji) as c
              LEFT JOIN (select * from (select * from getLandTrade where sigunguCd = $code1 order by YM desc) as tmp group by tmp.bjdongCd,tmp.bun_1,tmp.ji_1) as d
              on c.bjdongCd = d.bjdongCd and c.bun = d.bun_1 and c.ji = d.ji_1 order by bjdongCd,bun,ji,YM,DAY asc) as m1,
              (select bjdongCd,bun,ji,pblntfPclnd,pblntfDe from IndvdLandPriceService where sigunguCd = $code1) as m2
              WHERE m1.bjdongCd = m2.bjdongCd and m1.bun = m2.bun and m1.ji = m2.ji;
              ");
  }

  $result = $query->result_array();
  return json_encode($result, JSON_UNESCAPED_UNICODE);
}


}
