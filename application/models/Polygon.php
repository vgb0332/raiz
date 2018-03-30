<?php

Class Polygon extends CI_Model {
  function __construct(){
    parent::__construct();
  }

  function getPolyInfo($values){
    $type = $values['type'];

    if($type === 'aptJunwal'){
      $sigunguCd = substr($values['bjdongCd'], 0, 5);
      $bjdongCd = substr($values['bjdongCd'], 5, 5);
      $filter_type = $values['filter_type'];
      $filter_value = $values['filter_value'];

      $current_time = date("Y-m");
      $last_time = date("Y-m", strtotime('-' . $filter_value . ' ' . $filter_type));
      $last_year = explode("-", $last_time)[0];
      $last_month = explode("-", $last_time)[1];
      // return json_encode($last_year, JSON_UNESCAPED_UNICODE);
      $query = $this->db->query(
               "SELECT a.sigunguCd as 지역코드, a.bjdongCd as 법정동코드,
                b.년, b.월, b.일, b.이름, b.지번, b.전용면적, b.층,
                 b.보증금액, b.월세금액, a.point, a.polygon, b.번, b.지
                FROM
                (select sigunguCd, bjdongCd, bun,ji,st_asText(geomfromtext(polygon)) as polygon, st_asText(st_centroid(geomfromtext(polygon))) as point
                  from getLandPolygonText
                  where sigunguCd = $sigunguCd AND bjdongCd = $bjdongCd) as a,

                (select 번, 지, 년, 월, 일, 아파트 as 이름, 지번, 전용면적, 층, 보증금액, 월세금액
                  from getRTMSDataSvcAptRent
                  where 지역코드 = $sigunguCd
                  and 법정동코드 = $bjdongCd
                  and 년 >= $last_year AND 월 >= $last_month) as b

                WHERE a.bun = b.번
                AND   a.ji = b.지
                GROUP BY b.지번 desc
                ORDER BY b.지번, b.이름
                ");

      $result = $query->result_array();
      return json_encode($result, JSON_UNESCAPED_UNICODE);
    }

    if($type === 'rhouseJunwal'){
      $sigunguCd = substr($values['bjdongCd'], 0, 5);
      $bjdongCd = substr($values['bjdongCd'], 5, 5);
      $filter_type = $values['filter_type'];
      $filter_value = $values['filter_value'];

      $current_time = date("Y-m");
      $last_time = date("Y-m", strtotime('-' . $filter_value . ' ' . $filter_type));
      $last_year = explode("-", $last_time)[0];
      $last_month = explode("-", $last_time)[1];
      // return json_encode($last_year, JSON_UNESCAPED_UNICODE);
      $query = $this->db->query(

                "SELECT a.sigunguCd as 지역코드, a.bjdongCd as 법정동코드, b.년, b.월, b.일, b.이름, b.지번, b.전용면적, b.층, b.보증금액, b.월세금액, a.point, a.polygon, b.번, b.지
                FROM
                (select sigunguCd, bjdongCd, bun,ji,st_asText(geomfromtext(polygon)) as polygon, st_asText(st_centroid(geomfromtext(polygon))) as point
                  from getLandPolygonText
                  where sigunguCd = $sigunguCd AND bjdongCd = $bjdongCd ) as a,

                (select 번, 지, 년, 월, 일, 연립다세대 as 이름, 지번, 전용면적, 층, 보증금액, 월세금액
                  from getRTMSDataSvcRHRent
                  where 지역코드 = $sigunguCd
                  and 법정동코드 = $bjdongCd
                  and 년 >= $last_year AND 월 >= $last_month ) as b

                WHERE a.bun = b.번
                AND   a.ji = b.지
                GROUP BY b.지번 desc
                ORDER BY b.지번, b.이름
                ");

      $result = $query->result_array();
      return json_encode($result, JSON_UNESCAPED_UNICODE);
    }
    if($type === 'tojiSil'){
      $sigunguCd = substr($values['bjdongCd'], 0, 5);
      $bjdongCd = substr($values['bjdongCd'], 5, 5);
      $current_time = date("Y-m");
      $last_time = date("Y-m", strtotime('-1 year'));
      $last_year = explode("-", $last_time)[0];
      $last_month = explode("-", $last_time)[1];
      // return json_encode($values, JSON_UNESCAPED_UNICODE);
      $query = $this->db->query(
                "SELECT a.sigunguCd as 지역코드, a.bjdongCd as 법정동코드, b.년, b.월, b.일, b.이름, b.지번, b.전용면적, b.거래금액, a.point, a.polygon, b.번, b.지
                FROM
                (select sigunguCd, bjdongCd, bun,ji,st_asText(geomfromtext(polygon)) as polygon, st_asText(st_centroid(geomfromtext(polygon))) as point
                  from getLandPolygonText
                  where sigunguCd = $sigunguCd AND bjdongCd = $bjdongCd) as a,

                (select bun_1 as 번, ji_1 as 지, substring(YM, 1, 4) as 년,
                        substring(YM, 5, 2) as 월,
                        DAY as 일,
                        YONGDO as 이름,
                        CONCAT(TRIM(LEADING '0' FROM bun_1), '-', TRIM(LEADING '0' FROM ji_1)) as 지번,
                        AREA as 전용면적, PRICE as 거래금액
                  from getLandTrade
                  where sigunguCd = $sigunguCd
                  and bjdongCd = $bjdongCd
                  and substring(YM, 1, 4) >= $last_year
                  AND substring(YM, 5, 2) >= $last_month) as b

                WHERE a.bun = b.번
                AND   a.ji = b.지
                GROUP BY b.지번 desc
                ORDER BY b.지번, b.이름
                ");

      $result = $query->result_array();
      return json_encode($result, JSON_UNESCAPED_UNICODE);
    }
    if($type === 'storeSil'){
      $sigunguCd = substr($values['bjdongCd'], 0, 5);
      $bjdongCd = substr($values['bjdongCd'], 5, 5);
      $filter_type = $values['filter_type'];
      $filter_value = $values['filter_value'];

      $current_time = date("Y-m");
      $last_time = date("Y-m", strtotime('-' . $filter_value . ' ' . $filter_type));
      $last_year = explode("-", $last_time)[0];
      $last_month = explode("-", $last_time)[1];

      $query = $this->db->query(
                "SELECT a.sigunguCd as 지역코드, a.bjdongCd as 법정동코드, b.년, b.월,
                        b.일, b.이름, b.지번, b.전용면적, b.층, b.거래금액, a.point, a.polygon, b.bun_1 as 번, b.ji_1 as 지
                FROM
                (select sigunguCd, bjdongCd, bun, ji, st_asText(geomfromtext(polygon)) as polygon, st_asText(st_centroid(geomfromtext(polygon))) as point
                  from getLandPolygonText
                  where sigunguCd = $sigunguCd AND bjdongCd = $bjdongCd ) as a,

                (select substring(계약년월, 1, 4) as 년,
                        substring(계약년월, 5, 2) as 월,
                        계약일 as 일,
                        용도지역 as 이름,
                        CONCAT(TRIM(LEADING '0' FROM bun_1), '-', TRIM(LEADING '0' FROM ji_1)) as 지번,
                        bun_1, ji_1, sigunguCd, bjdongCd, 전용면적, 층, 거래금액
                  from getCommerceBusiness
                  where sigunguCd = $sigunguCd
                  and bjdongCd = $bjdongCd
                  and substring(계약년월, 1, 4) >= $last_year AND substring(계약년월, 5, 2) >= $last_month ) as b

                WHERE lpad(a.bun, 4, '0') = b.bun_1
                AND   lpad(a.ji, 4, '0') = b.ji_1
                GROUP BY b.지번 desc
                ORDER BY b.지번
                ");

      $result = $query->result_array();
      return json_encode($result, JSON_UNESCAPED_UNICODE);
    }
    if($type === 'rhouseSil'){
      $sigunguCd = substr($values['bjdongCd'], 0, 5);
      $bjdongCd = substr($values['bjdongCd'], 5, 5);
      $filter_type = $values['filter_type'];
      $filter_value = $values['filter_value'];

      $current_time = date("Y-m");
      $last_time = date("Y-m", strtotime('-' . $filter_value . ' ' . $filter_type));
      $last_year = explode("-", $last_time)[0];
      $last_month = explode("-", $last_time)[1];
      // return json_encode($values, JSON_UNESCAPED_UNICODE);
      $query = $this->db->query(
                "SELECT b.년, b.월, b.일, b.이름, b.지번, b.전용면적, b.층, b.거래금액, a.point, a.polygon, b.번, b.지
                FROM
                (select sigunguCd, bjdongCd, bun,ji,st_asText(geomfromtext(polygon)) as polygon, st_asText(st_centroid(geomfromtext(polygon))) as point
                  from getLandPolygonText
                  where sigunguCd = $sigunguCd AND bjdongCd = $bjdongCd ) as a,

                (select 번, 지, 년, 월, 일, 연립다세대 as 이름, 지번, 전용면적, 층, 거래금액
                  from getRTMSDataSvcRHTrade
                  where 지역코드 = $sigunguCd
                  and 법정동코드 = $bjdongCd
                  and 년 >= $last_year AND 월 >= $last_month ) as b

                WHERE a.bun = b.번
                AND   a.ji = b.지
                GROUP BY b.지번 desc
                ORDER BY b.지번, b.이름
                ");

      $result = $query->result_array();
      return json_encode($result, JSON_UNESCAPED_UNICODE);
    }

    if($type === 'aptSil'){
      $sigunguCd = substr($values['bjdongCd'], 0, 5);
      $bjdongCd = substr($values['bjdongCd'], 5, 5);
      $filter_type = $values['filter_type'];
      $filter_value = $values['filter_value'];

      $current_time = date("Y-m");
      $last_time = date("Y-m", strtotime('-' . $filter_value . ' ' . $filter_type));
      $last_year = explode("-", $last_time)[0];
      $last_month = explode("-", $last_time)[1];
      // return json_encode($last_year, JSON_UNESCAPED_UNICODE);
      $query = $this->db->query(
                "SELECT a.sigunguCd as 지역코드, a.bjdongCd as 법정동코드, b.년, b.월, b.일, b.이름, b.지번, b.전용면적, b.층, b.거래금액, a.point, a.polygon, b.번, b.지
                FROM
                (select sigunguCd, bjdongCd, bun,ji,st_asText(geomfromtext(polygon)) as polygon, st_asText(st_centroid(geomfromtext(polygon))) as point
                  from getLandPolygonText
                  where sigunguCd = $sigunguCd AND bjdongCd = $bjdongCd) as a,

                (select 번, 지, 년, 월, 일, 아파트 as 이름, 지번, 전용면적, 층, 거래금액
                  from getRTMSDataSvcAptTrade
                  where 지역코드 = $sigunguCd
                  and 법정동코드 = $bjdongCd
                  and 년 >= $last_year AND 월 >= $last_month) as b

                WHERE a.bun = b.번
                AND   a.ji = b.지
                GROUP BY b.지번 desc
                ORDER BY b.지번, b.이름
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
                "SELECT b.*, a.sigunguCd, a.bjdongCd, a.bun, a.ji, a.pnu, a.polygon
                FROM
                (select sigunguCd, bjdongCd, bun, ji, pnu, polygon
                  from getLandPolygonText
                  where sigunguCd = $sigunguCd
                      and bjdongCd = $bjdongCd
                      and ST_CONTAINS(geomfromtext(polygon), point($x, $y))) as a,

                (select *
                  from getLandCharacteristics
                  where sigunguCd = $sigunguCd
                      and bjdongCd = $bjdongCd) as b
                WHERE a.bun = b.bun
                AND   a.ji = b.ji
                AND 	a.pnu = b.pnu
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
