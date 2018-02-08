<?php

Class Polygon extends CI_Model {
  function __construct(){
    parent::__construct();
  }

  function getPolyInfo($values){
    $type = $values['type'];
    if($type === 'single'){
      $sigunguCd = substr($values['bjdongCd'], 0, 5);
      $bjdongCd = substr($values['bjdongCd'], 5, 5);
      $x = $values['lat'];
      $y = $values['lng'];

      $query = $this->db->query(
                "SELECT *
                FROM getLandPolygonText as a, getLandCharacteristics as b
                WHERE a.sigunguCd = $sigunguCd
                AND   a.bjdongCd = $bjdongCd
                AND 	b.sigunguCd = a.sigunguCd
                AND   b.bjdongCd = a.bjdongCd
                AND   a.bun = b.bun
                AND   a.ji = b.ji
                AND 	a.pnu = b.pnu
                AND 	ST_CONTAINS(geomfromtext(polygon), point($x, $y))
                LIMIT 1
                ");
    }

    $result = $query->result_array();
    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

}
