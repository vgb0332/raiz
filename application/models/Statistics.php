<?php

Class Statistics extends CI_Model {
  function __construct(){
    parent::__construct();
  }

  function getStcsPop(){
      $query = $this->db->query(
                "SELECT *
                FROM raiz2.AggregZone
                WHERE ADM_CD like '11230%'
                ");

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

}
