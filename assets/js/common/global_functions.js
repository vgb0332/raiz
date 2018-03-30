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
          // console.log(JSON.parse(data));
          try {
            var result = JSON.parse(data);
          }
          catch(e){
            result = (data);
          }
        if(typeof callback == 'function') {
          callback(result);
        }
     }
  });
  return ajax_call;
}

function round(num) {
  return +(Math.round(num + "e+2")  + "e-2");
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
              return p.slice(0, p.length - 4) + "억원 ";
          else
              return p.slice(0, p.length - 4) + "억 " + String(parseInt(p.slice(p.length - 4, p.length))) + "만원";
      } else if (p.length > 8 && p.length <= 11) {
          if (parseInt(p.slice(p.length - 8, p.length)) == 0)
              return p.slice(0, p.length - 8) + "조원 ";
          else if (parseInt(p.slice(p.length - 4, p.length)) == 0)
              return p.slice(0, p.length - 8) + "조 " + String(parseInt(p.slice(p.length - 8, p.length - 4))) + "억원";
          else
              return p.slice(0, p.length - 8) + "조 " + String(parseInt(p.slice(p.length - 8, p.length - 4))) + "억 " + String(parseInt(p.slice(p.length - 4, p.length))) + "만원";
      }
    }

    if(scale === '일원'){
      if (p.length <= 4) {
          return p + "원";
      } else if (p.length >= 5 && p.length <= 8) {
          if (parseInt(p.slice(p.length - 4, p.length)) == 0)
              return p.slice(0, p.length - 4) + "만";
          else
              return p.slice(0, p.length - 4) + "만 " + String(parseInt(p.slice(p.length - 4, p.length))) + "만";
      } else if (p.length > 8 && p.length <= 11) {
          if (parseInt(p.slice(p.length - 8, p.length)) == 0)
              return p.slice(0, p.length - 8) + "억";
          else if (parseInt(p.slice(p.length - 4, p.length)) == 0)
              return p.slice(0, p.length - 8) + "억 " + String(parseInt(p.slice(p.length - 8, p.length - 4))) + "억";
          else
              return p.slice(0, p.length - 8) + "억 " + String(parseInt(p.slice(p.length - 8, p.length - 4))) + "억 " + String(parseInt(p.slice(p.length - 4, p.length))) + "만원";
      }
    }

}

function price_format_short(value)
{
  if (value == '-')
  {
    return "-";
  }

  if (value == '0')
  {
    return "0원";
  }

  var p = String(value).replace(',', '');

  if (p.length <= 4)
  {
    return Number(p).toLocaleString() + "만";
  }
  else if (p.length >= 5 && p.length <= 8)
  {
    if (parseInt(p.slice(p.length - 4, p.length)) == 0)
      return Number(p.slice(0, p.length - 4)).toLocaleString() + "억";
    else
      return Number(round(parseFloat(p) / 10000)).toLocaleString() + "억";
  }
  else if (p.length > 8 && p.length <= 11)
  {
    if (parseInt(p.slice(p.length - 8, p.length)) == 0)
      return Number(p.slice(0, p.length - 8)).toLocaleString() + "조";
    else
      return Number(round(parseFloat(p) / 100000000)).toLocaleString() + "조";
  }
}


function lpad(s, padLength, padString){

    while(s.length < padLength)
        s = padString + s;
    return s;
}

function rpad(s, padLength, padString){
    while(s.length < padLength)
        s += padString;
    return s;
}

function toaster(text, type, time) {
    // Get the snackbar DIV
    // var x = document.getElementById("snackbar");
    time = typeof time !== 'undefined' ? time : '5000';
    var x = document.createElement("div");
    x.className = "snackbar show";

    // Add the "show" class to DIV
    // x.className = "show";
    if(type === 'success'){
      x.style.backgroundColor = '#00c850';
    }
    else if(type === 'info'){
      x.style.backgroundColor = '#34b5e5';
    }
    else if(type === 'error'){
      x.style.backgroundColor = '#ef9da6';
    }
    else if(type === 'warning'){
      x.style.backgroundColor = '#fe8801';
    }

    if(text.length > 20){
      x.style.marginLeft = '-220px';
    }

    x.innerHTML = text;

    document.body.appendChild(x);
    // console.log($(x).css('animation'));
    $(x).css({'-webkit-animation': 'fadein 0.5s fadeout 0.5s ' + (time/1000).toFixed(1) + 's',
              'animation': 'fadein 0.5s fadeout 0.5s ' + (time/1000).toFixed(1) + 's'
            });
    // After 3 seconds, remove the show class from DIV
    toaster_timeout = setTimeout(function(){ x.className = x.className.replace("snackbar show", "snackbar"); }, time);
}
