/*
  Custom AJAX made by Mark Jung(2018-02-05)
  parameter : url(string), data(object), callback(function)
  return : null

  * on Success : data will be parsed into JSON object, it will print out original data, and JSON parsed data
                  So the callback function should handle data as JSON.
*/
function customAjax(url,data,callback) {
   var ajax_call = $.ajax({
     type: "post",
     url: url,
     data:data,
     success: function(data) {
        // console.log(data); // predefined logic if any
        console.log(JSON.parse(data));
        if(typeof callback == 'function') {
           callback(JSON.parse(data));
        }
     }
  });
  return ajax_call;
}

function comma(number) {

    var minusText = "";

    if (parseFloat(number) < 0) {
        minusText = "-";
    }

    number = '' + number;
    number = number.replace("-", "");
    if (number.length > 3) {

        var mod = number.length % 3;
        var output = (mod > 0 ? (number.substring(0,mod)) : '');
        for (var i=0 ; i < Math.floor(number.length / 3); i++) {
            if ((mod == 0) && (i == 0))
                output += number.substring(mod+ 3 * i, mod + 3 * i + 3);
            else
                output+= ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
        }
        return (minusText + '' + output);
    }
    else return minusText + '' + number;
}

function price_format(value, scale) {
    var p = String(value).replace(',', '');
    if(scale === '만원'){
      if (p.length <= 4) {
          return p + "만원";
      } else if (p.length >= 5 && p.length <= 8) {
          if (parseInt(p.slice(p.length - 4, p.length)) == 0)
              return p.slice(0, p.length - 4) + "억 ";
          else
              return p.slice(0, p.length - 4) + "억 " + String(parseInt(p.slice(p.length - 4, p.length))) + "만원";
      } else if (p.length > 8 && p.length <= 11) {
          if (parseInt(p.slice(p.length - 8, p.length)) == 0)
              return p.slice(0, p.length - 8) + "조 ";
          else if (parseInt(p.slice(p.length - 4, p.length)) == 0)
              return p.slice(0, p.length - 8) + "조 " + String(parseInt(p.slice(p.length - 8, p.length - 4))) + "억";
          else
              return p.slice(0, p.length - 8) + "조 " + String(parseInt(p.slice(p.length - 8, p.length - 4))) + "억 " + String(parseInt(p.slice(p.length - 4, p.length))) + "만원";
      }
    }

    if(scale === '일원'){
      if (p.length <= 4) {
          return p + "원";
      } else if (p.length >= 5 && p.length <= 8) {
          if (parseInt(p.slice(p.length - 4, p.length)) == 0)
              return p.slice(0, p.length - 4) + "만 ";
          else
              return p.slice(0, p.length - 4) + "만 " + String(parseInt(p.slice(p.length - 4, p.length))) + "만원";
      } else if (p.length > 8 && p.length <= 11) {
          if (parseInt(p.slice(p.length - 8, p.length)) == 0)
              return p.slice(0, p.length - 8) + "억 ";
          else if (parseInt(p.slice(p.length - 4, p.length)) == 0)
              return p.slice(0, p.length - 8) + "억 " + String(parseInt(p.slice(p.length - 8, p.length - 4))) + "억";
          else
              return p.slice(0, p.length - 8) + "억 " + String(parseInt(p.slice(p.length - 8, p.length - 4))) + "억 " + String(parseInt(p.slice(p.length - 4, p.length))) + "만원";
      }
    }

}
