//自定义标题
function setMetaTitle(title) {
  document.title = title
  let mobile = navigator.userAgent.toLowerCase()
  if (/iphone|ipad|ipod/.test(mobile)) {
    let iframe = document.createElement('iframe')
    iframe.style.visibility = 'hidden'
    // 替换成站标favicon路径或者任意存在的较小的图片即可
    iframe.setAttribute('src', 'static/img/blank.png')
    let iframeCallback = function () {
      setTimeout(function () {
        iframe.removeEventListener('load', iframeCallback)
        document.body.removeChild(iframe)
      }, 0)
    }
    iframe.addEventListener('load', iframeCallback)
    document.body.appendChild(iframe)
  }
}
//日期换算
function dateFormat(dateParam) {
  let date = new Date(dateParam.replace(/-/g,"/"));
  //小于10补零
  let lower10=function (num) {
    return num < 10 ? '0' + num : num;
  };
  //周几
  let daysAway=function (start, end) {
    var startTime = start.getTime(),
      endTime = end.getTime(),
      str = "",
      weekDefine = ['日', '一', '二', '三', '四', '五', '六'];
    if (endTime - startTime < 1) {
      str = "今天"
    } else if (endTime - startTime == 24 * 60 * 60 * 1000) {
      str = "明天"
    } else if (endTime - startTime == 24 * 60 * 60 * 1000 * 2) {
      str = "后天";
    } else {
      str = "周" + weekDefine[end.getDay()];
    }
    return str;
  };
  let year=date.getFullYear(),
    month=date.getMonth()+1,
    dateStr=date.getDate(),
    now=new Date(),
    dateShorthand=lower10(month)+'月'+lower10(dateStr)+'日',
    dateDay=daysAway(new Date(now.getFullYear(),now.getMonth(),now.getDate()),new Date(year,month-1,dateStr));

  let obj={
    DateShort:dateShorthand,
    DateDay:dateDay
  }
  return obj;
  // state.departDateList.departDate=year+'-'+lower10(month)+'-'+lower10(dateStr);
  // state.departDateList.departShorthand=lower10(month)+'-'+lower10(dateStr);
  // state.departDateList.otherShorthand=lower10(month)+'月'+lower10(dateStr)+'日';
  // // state.departDateList.departDay=
  // console.log(state.departDateList.departDate);
}
//计算两个日期相关天数
function dateDiff (startDateString, endDateString) {
  var separator = "-"; //日期分隔符
  var startDates = startDateString.split(separator);
  var endDates = endDateString.split(separator);
  var startDate = new Date(startDates[0], startDates[1]-1, startDates[2]);
  var endDate = new Date(endDates[0], endDates[1]-1, endDates[2]);
  return parseInt(Math.abs(endDate - startDate ) / 1000 / 60 / 60 /24);//把相差的毫秒数转换为天数
}
//根据生日计算年龄
function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export {
  setMetaTitle,
  dateFormat,
  dateDiff,
  getAge
}
