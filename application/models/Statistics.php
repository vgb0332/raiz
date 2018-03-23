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


}
