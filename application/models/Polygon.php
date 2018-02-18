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

      $this->db->cache_off();
      $query1 = $this->db->query(
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

        $result1 = $query1->result_array();
        $query1->free_result();

        if(count($result1) > 0){
          $pnu = $result1[0]['pnu'];
          $bun = $result1[0]['bun'];
          $ji = $result1[0]['ji'];

          $this->db->where('sigunguCd', $sigunguCd);
          $this->db->where('bjdongCd' , $bjdongCd);
          $this->db->where('bun', $bun);
          $this->db->where('ji', $ji);
          $this->db->where('pnu', $pnu);
          $result2 = $this->db->get('getBuildingPolygon')->result_array();

        }
        else{
          $result2 = [];
        }

        $result = array(
          'land' => $result1,
          'building' => $result2
        );
    }


    return json_encode($result, JSON_UNESCAPED_UNICODE);
  }

}
