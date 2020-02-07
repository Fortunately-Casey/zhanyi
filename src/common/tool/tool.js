export function Todate(chinadatetime) { //Fri Oct 31 18:00:00 UTC+0800 2008 
    var d = new Date(chinadatetime);
    var month = (d.getMonth() + 1) >= 10 ? (d.getMonth() + 1) : "0" + (d.getMonth() + 1);
    var date = d.getDate() >= 10 ? d.getDate() : "0" + d.getDate();
    var datetime = d.getFullYear() + '-' + month + '-' + date;
    return datetime;
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
        _result = `/api${url}`; // 开发环境会自动走代理
    } else if (process.env.NODE_ENV === 'production') {
        _result = `http://yqfk.ntschy.com/api${url}`; // 正式环境地址
    }
    return _result;
}

export function chinaDateTime(chinadatetime) {
    // // 转为正常的时间格式 年-月-日 时:分:秒
    // var T_pos = utc_datetime.indexOf('T');
    // var Z_pos = utc_datetime.indexOf('Z');
    // var year_month_day = utc_datetime.substr(0,T_pos);
    // var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
    // var new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06

    // // 处理成为时间戳
    // timestamp = new Date(Date.parse(new_datetime));
    // timestamp = timestamp.getTime();
    // timestamp = timestamp/1000;

    // // 增加8个小时，北京时间比utc时间多八个时区
    // var timestamp = timestamp+8*60*60;

    // // 时间戳转为时间
    // var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
    // return beijing_datetime; // 2017-03-31 16:02:06
    var d = new Date(chinadatetime);
    var month = (d.getMonth() + 1) >= 10 ? (d.getMonth() + 1) : "0" + (d.getMonth() + 1);
    var date = d.getDate() >= 10 ? d.getDate() : "0" + d.getDate();
    var hour = d.getHours() >= 10 ? d.getHours() : "0" + d.getHours();
    var minutes = d.getMinutes() >= 10 ? d.getMinutes() : "0" + d.getMinutes();
    var datetime = d.getFullYear() + '-' + month + '-' + date + ' ' + hour + ':' + minutes;
    return datetime;
}