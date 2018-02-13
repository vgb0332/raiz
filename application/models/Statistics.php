<?php

Class Statistics extends CI_Model {
  function __construct(){
    parent::__construct();
  }

  function getStcsSgg(){
      $query = $this->db->query(
                "SELECT sigunguCd , sigunguNm , polygon
                FROM raiz2.sensusHJsgg
                WHERE sigunguCd LIKE '11%';
                ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsDong($code){
      $query = $this->db->query(
                "SELECT a.ADM_CD , a.ADM_NM ,a.polygon FROM raiz2.HJcode as b
                JOIN raiz2.sensusHJdong as a ON b.emdCd = a.ADM_CD
                WHERE b.sigunguHJCd = $code
                ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

  function getStcsAggr($code){
      $query = $this->db->query(
                "SELECT ADM_CD, TOT_REG_CD, SHAPE_AREA, TOTAL_POP, MEDIUM_AGE, polygon
                FROM raiz2.AggregZone 
                where ADM_CD = $code
                ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

}
