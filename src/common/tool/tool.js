export function Todate(num) { //Fri Oct 31 18:00:00 UTC+0800 2008 
    var str;
    num = num + "";
    var date = "";
    var month = new Array();
    month["Jan"] = "01";
    month["Feb"] = "02";
    month["Mar"] = "03";
    month["Apr"] = "04";
    month["May"] = "05";
    month["Jan"] = "06";
    month["Jul"] = "07";
    month["Aug"] = "08";
    month["Sep"] = "09";
    month["Oct"] = "10";
    month["Nov"] = "11";
    month["Dec"] = "12";
    var week = new Array();
    week["Mon"] = "一";
    week["Tue"] = "二";
    week["Wed"] = "三";
    week["Thu"] = "四";
    week["Fri"] = "五";
    week["Sat"] = "六";
    week["Sun"] = "日";
    str = num.split(" ");
    // date = str[5] + "-";
    date = str[3] + "-" + month[str[1]] + "-" + str[2];
    //date=date+" 周"+week[str[0]];
    return date;
}

export function blur() {
    setTimeout(function () {
        var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
    }, 100);
}

export function getURL(url) {
    let _result = '';
    if (process.env.NODE_ENV === 'development') {
        _result = `/api/${url}`; // 开发环境会自动走代理
    } else if (process.env.NODE_ENV === 'production') {
        _result = `http://yqfk.ntschy.com/api/${url}`; // 正式环境地址
    }
    return _result;
}