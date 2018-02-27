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

  function getStcsOldind($code){
      $query = $this->db->query(
                "SELECT value
                FROM raiz2.2016OldIndices
                WHERE tot_oa_cd LIKE '$code%'
                ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsPopdens($code){
      $query = $this->db->query(
                "SELECT value
                FROM raiz2.2016PopDensity
                WHERE tot_oa_cd = $code
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

  function getStcsTotalHouse($code){
      $query = $this->db->query(
                "SELECT value
                FROM raiz2.2016TotalHouse
                WHERE tot_oa_cd = $code
                ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsHouseSize($code){
      $query = $this->db->query(
                "SELECT a.name,b.value
                FROM raiz2.stcsCd as a, (select * from raiz2.2016HouseSize where tot_oa_cd = $code) as b
                WHERE a.item = b.item
                ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsHouseHold($code){
      $query = $this->db->query(
                "SELECT a.name,b.value
                FROM raiz2.stcsCd as a, (select * from raiz2.2016HouseHold where tot_oa_cd = $code) as b
                WHERE a.item = b.item
                ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsTotalFamily($code){
      $query = $this->db->query(
                "SELECT a.name,b.value
                FROM raiz2.stcsCd as a, (select * from raiz2.2016TotalFamily where tot_oa_cd = $code) as b
                WHERE a.item = b.item
                ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsJobsPop($code){
      $query = $this->db->query(
                "SELECT a.name,b.value
                FROM raiz2.stcsCd as a, (select * from raiz2.2016JobsPop where tot_oa_cd = $code) as b
                WHERE a.item = b.item
                ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsJobsBiz($code){
      $query = $this->db->query(
                "SELECT a.name,b.value
                FROM raiz2.stcsCd as a, (select * from raiz2.2016JobsBiz where tot_oa_cd = $code) as b
                WHERE a.item = b.item
                ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsHouseType($code){
      $query = $this->db->query(
                "SELECT a.name,b.value
                FROM raiz2.stcsCd as a, (select * from raiz2.2016HouseType where tot_oa_cd = $code) as b
                WHERE a.item = b.item
                ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

}
