var formatTime = function(milliseconds, fmt) {
    let date = new Date(milliseconds);
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes()
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
};
var parseQueryString = function(str) {
    let reg = /(?:[?&])([^?&]+)=([^?&]+)/g;
    let result = {};
    let res;
    while ((res = reg.exec(str)) != null) {
        // console.log('res', res);
        result[res[1]] = res[2];
    }
    return result;
};
var loadFromLocal = function(id, key, def) {
    var seller = localStorage.__seller__;
    var ret = def;
    if (!seller) {
        ret = def;
    } else {
        seller = JSON.parse(seller);
    }
    if (seller[id] && seller[id][key]) {
        ret = seller[id][key];
    }
    // console.log(ret);
    return ret;
};
var saveToLocal = function(id, key, value) {
    var seller = localStorage.__seller__;
    if (!seller) {
        seller = {};
    } else {
        seller = JSON.parse(seller);
    }
    if (!seller[id]) {
        seller[id] = {};
    }
    seller[id][key] = value;
    localStorage.__seller__ = JSON.stringify(seller);
    // console.log(localStorage.__seller__);
};
export {
    formatTime,
    parseQueryString,
    loadFromLocal,
    saveToLocal
};
