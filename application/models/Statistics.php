<?php

Class Statistics extends CI_Model {
  function __construct(){
    parent::__construct();
  }


  function getStcsSido(){
    $query = $this->db->query(
              "SELECT sidoCd , sidoNm , ST_AsText(polygon) as polygon , ST_AsText(point) as center
              FROM raiz2.sensusHJsido
              ");
    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }


  function getStcsSgg($code){
      $query = $this->db->query(
                "SELECT sigunguCd , sigunguNm , ST_AsText(polygon) as polygon , ST_AsText(ST_Centroid(polygon)) as center
                FROM raiz2.sensusHJsgg
                WHERE sigunguCd LIKE '$code%';
                ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsDong($code){
      $query = $this->db->query(
                "SELECT a.dongCd , a.dongNm , ST_AsText(a.polygon) as polygon , ST_AsText(ST_Centroid(a.polygon)) as center FROM raiz2.HJcode as b
                JOIN raiz2.sensusHJdong as a ON b.emdCd = a.dongCd
                WHERE b.sigunguHJCd = $code
                ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsAggr($code){
      $query = $this->db->query(
                "SELECT dongCd, TOT_REG_CD, SHAPE_AREA, TOTAL_POP, MEDIUM_AGE, ST_AsText(polygon) as polygon, ST_AsText(ST_Centroid(polygon)) as center
                FROM raiz2.sensusHJaggzone
                where dongCd = $code
                ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsOldind($code){
      $query = $this->db->query(
                "SELECT tot_oa_cd, item, value
                FROM raiz2.2016OldIndices
                WHERE tot_oa_cd LIKE '$code%'
                ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsPopdens($code){
      $query = $this->db->query(
                "SELECT tot_oa_cd, item, value
                FROM raiz2.2016PopDensity
                WHERE tot_oa_cd LIKE '$code%'
                ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

}
