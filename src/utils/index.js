/**
 * Created by jiachenpan on 16/11/18.
 */
export let date = {
  _date_cur_date: new Date(),
  _date_reg_all: /^[12][0-9]{3}(-|\/)(0?[0-9]|1[0-2])(-|\/)(0?[1-9]|[1-2][0-9]|3[0-1]).(0?[0-9]|1[0-9]|2[0-3]):(0?[0-9]|[1-5][0-9]):(0?[0-9]|[1-5][0-9])$/,
  _date_reg_year_month: /^[12][0-9]{3}(-|\/)(0?[0-9]|1[0-2])$/,
  _date_reg_year_month_date: /^[12][0-9]{3}(-|\/)(0?[0-9]|1[0-2])(-|\/)(0?[1-9]|[1-2][0-9]|3[0-1])$/,
  _date_reg_year_month_date_hour: /^[12][0-9]{3}(-|\/)(0?[0-9]|1[0-2])(-|\/)(0?[1-9]|[1-2][0-9]|3[0-1]).(0?[0-9]|1[0-9]|2[0-3])$/,
  _date_reg_year_month_date_hour_minute: /^[12][0-9]{3}(-|\/)(0?[0-9]|1[0-2])(-|\/)(0?[1-9]|[1-2][0-9]|3[0-1]).(0?[0-9]|1[0-9]|2[0-3]):(0?[0-9]|[1-5][0-9])$/,
  _date_reg_time: /^(0?[0-9]|1[0-9]|2[0-3]):(0?[0-9]|[1-5][0-9]):(0?[0-9]|[1-5][0-9])$/,

  /***
   * @param {Object|Number|String} date
   * @param {Object} format
   */
  getdate: function(date, format) {
    /* eslint-disable */
    let now = this.tojsdate(date),
      year = now.getFullYear(),
      month = now.getMonth() + 1,
      day = now.getDate(),
      hour = now.getHours(),
      minute = now.getMinutes(),
      second = now.getSeconds(),
      result,
      fill = function(val) {
        return (val < 10 ? '0' : '') + val;
      };
    month = fill(month);
    day = fill(day);
    hour = fill(hour);
    minute = fill(minute);
    second = fill(second);

    switch (format) {
      case 'YY-MM':
      case 'yyyy-MM':
        result = year + '-' + month;
        break;
      case 'MM-DD':
        result = month + '-' + day;
        break;
      case 'YY-MM-DD':
      case 'yyyy-MM-dd':
        result = year + '-' + month + '-' + day;
        break;
      case 'YY-MM-DD HH:MM:SS':
        result = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        break;
      case 'YY-MM-DD HH:MM':
        result = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
        break;
      case 'YY/MM/DD HH:MM':
        result = year + '/' + month + '/' + day + ' ' + hour + ':' + minute;
        break;
      case 'HH:MM':
        result = hour + ':' + minute;
        break;
      case 'HH:MM:SS':
        result = hour + ':' + minute + ':' + second;
        break;
      default:
        result = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
    }
    return result;
  },
  // 以后所有的时间都从这块来, 这块的时间将会配合时间矫正来处理.
  getcurdate: function() {
    return new Date(this._date_cur_date);
  },
  // 转化成为js 的时间
  tojsdate: function(date) {
    if (!this.is_date(date)) {
      return this.getcurdate();
    }
    if (typeof date === 'string') {
      if (/^\d{11,}$/.test(date)) {
        return new Date(+date);
      }
      date = date.replace(/-/g, '/');
      if (this._date_reg_year_month.test(date)) {
        date += '/01';
      }
    }
    return new Date(date);
  },
  /**
   *
   *  Number y、mo、d、h、m、s 分别表示年/月/日/小时/分/秒.  如果没带后缀, 则默认为天.
   *  @param {Object|Number|String} oldDate
   *  @param {String|Number} changeDate
   */
  getdiffdate: function(oldDate, changeDate, format) {
    var curDate = this.tojsdate(oldDate);
    if (/^(-?\d+)y$/.test(changeDate)) {
      curDate.setFullYear(curDate.getFullYear() + +RegExp.$1);
    } else if (/^(-?\d+)mo$/.test(changeDate) && RegExp.$1 !== 0) {
      // 缓存当前的天
      let _cacheDay = curDate.getDate();

      // 重置到月初. 如果当前的 getDate() 大于目标月的最大日期就悲剧了
      curDate.setDate(1);

      // 设置月份
      curDate.setMonth(curDate.getMonth() + +RegExp.$1);
      curDate.setDate(_cacheDay);

      if (curDate.getDate() !== _cacheDay) {
        // 上个月的最后一天
        curDate.setDate(0);
      }
    } else if (/^(-?\d+)d$/.test(changeDate)) {
      curDate.setDate(curDate.getDate() + +RegExp.$1);
    } else if (/^(-?\d+)h$/.test(changeDate)) {
      curDate.setHours(curDate.getHours() + +RegExp.$1);
    } else if (/^(-?\d+)m$/.test(changeDate)) {
      curDate.setMinutes(curDate.getMinutes() + +RegExp.$1);
    } else if (/^(-?\d+)s$/.test(changeDate)) {
      curDate.setSeconds(curDate.getSeconds() + +RegExp.$1);
    }
    return this.getdate(curDate, format);
  },
  calculate: function(date, offset, format = 'YY-MM-DD') {
    let timestamp = new Date(date);
    let calculateDate = timestamp.setDate(timestamp.getDate() + offset);
    return this.getdate(calculateDate, format);
  },
  format_date: function(date) {
    if (!date || !this.is_date(date)) {
      return false;
    }
    var reg = this._date_reg_time;
    if (reg.test(date)) {
      return date.replace(/-/g, '/');
    } else {
      return this.getdate(date);
    }
  },
  is_date: function(date) {
    if (!date || date === null) {
      return false;
    }
    var newdate;
    if (typeof date === 'string') {
      if (/^\d{11,}$/.test(date)) {
        newdate = new Date(+date);
        return newdate !== 'Invalid Date';
      }
      return this._date_reg_all.test(date) || this._date_reg_year_month.test(date) || this._date_reg_year_month_date.test(date) || this._date_reg_year_month_date_hour.test(date) || this._date_reg_year_month_date_hour_minute.test(date);
    }
    newdate = new Date(date);
    return newdate !== 'Invalid Date';
  }
};
export function formatDate(value, format) {
  if (!value) return '';
  value = date.getdate(value, format);
  return value;
}
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000;
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
  return time_str;
}

export function formatTime(time, option) {
  time = +time * 1000;
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前';
  } else if (diff < 3600 * 24 * 2) {
    return '1天前';
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分';
  }
}

// 格式化时间
export function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf('?') + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen(val) {
  let len = 0;
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/gi) != null) {
      len += 1;
    } else {
      len += 0.5;
    }
  }
  return Math.floor(len);
}

export function cleanArray(actual) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

export function param(json) {
  if (!json) return '';
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return '';
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
    })
  ).join('&');
}

export function param2Obj(url) {
  const search = url.split('?')[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  );
}

export function html2Text(val) {
  const div = document.createElement('div');
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

export function objectMerge(target, source) {
  /* Merges two  objects,
     giving the last one precedence */

  if (typeof target !== 'object') {
    target = {};
  }
  if (Array.isArray(source)) {
    return source.slice();
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property];
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty);
    } else {
      target[property] = sourceProperty;
    }
  });
  return target;
}

export function scrollTo(element, to, duration) {
  if (duration <= 0) return;
  const difference = to - element.scrollTop;
  const perTick = (difference / duration) * 10;
  setTimeout(() => {
    console.log(new Date());
    element.scrollTop = element.scrollTop + perTick;
    if (element.scrollTop === to) return;
    scrollTo(element, to, duration - 10);
  }, 10);
}

export function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += '' + className;
  } else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

export const pickerOptions = [
  {
    text: '今天',
    onClick(picker) {
      const end = new Date();
      const start = new Date(new Date().toDateString());
      end.setTime(start.getTime());
      picker.$emit('pick', [start, end]);
    }
  },
  {
    text: '最近一周',
    onClick(picker) {
      const end = new Date(new Date().toDateString());
      const start = new Date();
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
      picker.$emit('pick', [start, end]);
    }
  },
  {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString());
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      picker.$emit('pick', [start, end]);
    }
  },
  {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString());
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      picker.$emit('pick', [start, end]);
    }
  }
];

export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90;
  } else {
    return new Date(new Date().toDateString());
  }
}

export function debounce(func, wait, immediate) {
  /* eslint-disable */
  let timeout,
    args,
    context,
    timestamp,
    result;

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function(...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone');
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = source[keys].constructor === Array ? [] : {};
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}
export function deepCopy(obj) {
  var o = obj.constructor === Array ? [] : {};
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = typeof obj[i] === 'object' ? deepCopy(obj[i]) : obj[i];
    }
  }
  return o;
}

/**
 * 按层级排序部门
 * fixme 现在代码是将每个层级都剥离了出来，为的是适用后面可能出现的需求，但是如果后期需求无特殊更改，本代码可优化精简
 */
export function formatTreeData(list, needChildrens) {
  let arr = {
    list0: {},
    list1: {},
    list2: {},
    list3: {},
    list4: {},
    list5: {},
    list6: {},
    list: list,
    listObj: {}
  };
  let key;
  let obj2;
  let key2;
  let parent;
  let idOfLevel0;
  let parentLevel;
  list.length &&
    list.forEach(obj => {
      obj.name = obj.name || '';
      obj.disableOpen = false;
      obj.label = obj.name || '';
      obj.id = obj.groupId || '';
      obj.englishName = obj.englishName || '';
      obj.level = obj.level;
      obj.groupId = obj.groupId || '';
      obj.parentId = obj.parentId || '';
      // obj.childrens = [{label: "", id: ""}];
      key = obj.groupId;
      if (arr['list' + obj.level]) {
        arr['list' + obj.level][key] = obj;
        arr['list' + obj.level][key]['children'] = {};
      }
      if (obj.level == 0) {
        idOfLevel0 = obj.groupId;
      }
    });
  for (let level = 6; level > 0; level--) {
    for (let item in arr['list' + level]) {
      obj2 = arr['list' + level][item];
      parentLevel = level - 1;
      parent = arr['list' + parentLevel][obj2.parentId];
      if (!parent) {
        continue;
      }
      key2 = obj2.groupId;
      if (!parent.hasOwnProperty('childrens')) {
        parent['childrens'] = [];
      }
      parent['children'][key2] = obj2;
      parent['childrens'].push(obj2);
      if (!obj2.hasOwnProperty('childrens') && needChildrens) {
        obj2['childrens'] = [{ label: '' }];
        obj2['isLast'] = true;
      }
    }
  }
  arr.listObj = Object.assign({}, arr.list0, arr.list1, arr.list2, arr.list3, arr.list4, arr.list5, arr.list6);
  let menuArr = [];
  let defaultOpen = [];
  for (let key in arr.list0) {
    menuArr.push(arr.list0[key]);
    arr.list0[key].disabled = true;
    arr.list0[key].hasLoad = true;
    defaultOpen.push(key);
  }
  return {
    defaultOpen,
    menuArr,
    arr
  };
}
