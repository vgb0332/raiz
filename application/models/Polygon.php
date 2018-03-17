<?php

Class Polygon extends CI_Model {
  function __construct(){
    parent::__construct();
  }

  function getPolyInfo($values){
    $type = $values['type'];
    if($type === 'tojiSil'){
      $sigunguCd = substr($values['bjdongCd'], 0, 5);
      $bjdongCd = substr($values['bjdongCd'], 5, 5);
      $current_time = date("Y-m");
      $last_time = date("Y-m", strtotime('-1 year'));
      $last_year = explode("-", $last_time)[0];
      $last_month = explode("-", $last_time)[1];
      // return json_encode($values, JSON_UNESCAPED_UNICODE);
      $query = $this->db->query(
                "SELECT substring(b.YM, 1, 4) as 년,
                        substring(b.YM, 5, 2) as 월,
                        b.DAY as 일,
                        b.YONGDO as 이름,
                        CONCAT(TRIM(LEADING '0' FROM b.bun_1), '-', TRIM(LEADING '0' FROM b.ji_1)) as 지번,
                        b.AREA as 전용면적, b.PRICE as 거래금액,
                        st_asText(st_centroid(geomfromtext(a.polygon))) as point
                FROM  getLandPolygonText as a, getLandTrade as b
                WHERE a.sigunguCd = $sigunguCd
                AND   a.bjdongCd = $bjdongCd
                AND 	b.sigunguCd = $sigunguCd
                AND   b.bjdongCd = $bjdongCd
                AND   a.bun = b.bun_1
                AND   a.ji = b.ji_1
                AND   substring(b.YM, 1, 4) >= $last_year
                AND   substring(b.YM, 5, 2) >= $last_month
                ORDER BY b.bun_1, b.ji_1
                ");

      $result = $query->result_array();
      return json_encode($result, JSON_UNESCAPED_UNICODE);
    }
    if($type === 'storeSil'){
      $sigunguCd = substr($values['bjdongCd'], 0, 5);
      $bjdongCd = substr($values['bjdongCd'], 5, 5);
      $current_time = date("Y-m");
      $last_time = date("Y-m", strtotime('-1 year'));
      $last_year = explode("-", $last_time)[0];
      $last_month = explode("-", $last_time)[1];
      // return json_encode($values, JSON_UNESCAPED_UNICODE);
      /*substring(b.계약년월, 1, 4) as 년,
              substring(b.계약년월, 5, 2) as 월,
              b.계약일, b.용도지역 as 이름,
              b.지번, b.전용/연면적 as 전용면적,
              b.층,
              b.거래금액,
              st_asText(st_centroid(geomfromtext(a.polygon))) as point*/
      $query = $this->db->query(
                "SELECT substring(b.계약년월, 1, 4) as 년,
                        substring(b.계약년월, 5, 2) as 월,
                        b.계약일 as 일,
                        b.용도지역 as 이름,
                        CONCAT(TRIM(LEADING '0' FROM b.bun_1), '-', TRIM(LEADING '0' FROM b.ji_1)) as 지번,
                        b.전용면적,
                        b.층,
                        b.거래금액,
                        st_asText(st_centroid(geomfromtext(a.polygon))) as point
                FROM  getLandPolygonText as a, getCommerceBusiness as b
                WHERE a.sigunguCd = $sigunguCd
                AND   a.bjdongCd = $bjdongCd
                AND 	b.sigunguCd = $sigunguCd
                AND   b.bjdongCd = $bjdongCd
                AND   LPAD(a.bun, 4, '0') = b.bun_1
                AND   LPAD(a.ji, 4, '0') = b.ji_1
                AND   substring(b.계약년월, 1, 4) >= $last_year
                AND   substring(b.계약년월, 5, 2) >= $last_month
                ORDER BY b.지번
                ");

      $result = $query->result_array();
      return json_encode($result, JSON_UNESCAPED_UNICODE);
    }
    if($type === 'rhouseSil'){
      $sigunguCd = substr($values['bjdongCd'], 0, 5);
      $bjdongCd = substr($values['bjdongCd'], 5, 5);
      $current_time = date("Y-m");
      $last_time = date("Y-m", strtotime('-1 year'));
      $last_year = explode("-", $last_time)[0];
      $last_month = explode("-", $last_time)[1];
      // return json_encode($values, JSON_UNESCAPED_UNICODE);
      $query = $this->db->query(
                "SELECT b.년, b.월, b.일, b.연립다세대 as 이름, b.지번, b.전용면적, b.층, b.거래금액, st_asText(st_centroid(geomfromtext(a.polygon))) as point
                FROM  getLandPolygonText as a, getRTMSDataSvcRHTrade as b
                WHERE a.sigunguCd = $sigunguCd
                AND   a.bjdongCd = $bjdongCd
                AND 	b.지역코드 = $sigunguCd
                AND   b.법정동코드 = $bjdongCd
                AND   a.bun = b.번
                AND   a.ji = b.지
                AND   b.년 >= $last_year
                AND   b.월 >= $last_month
                ORDER BY b.지번, b.연립다세대
                ");

      $result = $query->result_array();
      return json_encode($result, JSON_UNESCAPED_UNICODE);
    }

    if($type === 'aptSil'){
      $sigunguCd = substr($values['bjdongCd'], 0, 5);
      $bjdongCd = substr($values['bjdongCd'], 5, 5);
      $current_time = date("Y-m");
      $last_time = date("Y-m", strtotime('-1 year'));
      $last_year = explode("-", $last_time)[0];
      $last_month = explode("-", $last_time)[1];
      // return json_encode($last_month, JSON_UNESCAPED_UNICODE);
      $query = $this->db->query(
                "SELECT b.년, b.월, b.일, b.아파트 as 이름, b.지번, b.전용면적, b.층, b.거래금액, st_asText(st_centroid(geomfromtext(a.polygon))) as point
                FROM  getLandPolygonText as a, getRTMSDataSvcAptTrade as b
                WHERE a.sigunguCd = $sigunguCd
                AND   a.bjdongCd = $bjdongCd
                AND 	b.지역코드 = $sigunguCd
                AND   b.법정동코드 = $bjdongCd
                AND   a.bun = b.번
                AND   a.ji = b.지
                AND   b.년 >= $last_year
                AND   b.월 >= $last_month
                ORDER BY b.지번, b.아파트
                ");

      $result = $query->result_array();
      return json_encode($result, JSON_UNESCAPED_UNICODE);

    }
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
