// 通过正则手写实现 split 函数

const Max_Array_Len = 2 ** 32 - 1;
function validArrayLenAndGet (val) {
  if(typeof val === 'undefined') {
    return Max_Array_Len;
  }
  let num = new Number(val);
  if (+num && isFinite(num)) { // 排除了等于零的情况
    return num > 0
      ? num > Max_Array_Len
        ? 0
        : Math.floor(num)
      : Max_Array_Len
  }
  return 0;
}

const IsNotEmptyRegExp = /[^(?:)]/g;
function splitEachItems(s = '', limit) {
  let matchArr = s.match(IsNotEmptyRegExp);
  if(typeof limit !== 'number') {
    return matchArr;
  }
  return matchArr.slice(0, limit);
}

function split2(separator, limit) {
  let O = this;
  if (O == null) {
    throw new TypeError(
      "Uncaught TypeError: String.prototype.split called on null or undefined"
    );
  }
  if(typeof separator == 'undefined') {
    return [O.toString()];
  }
  let s = O.toString();
  
  if(limit < 0) {
    console.log(limit);
  }
  let lim = validArrayLenAndGet(limit);
  let r = new String(separator);
  if (lim === 0 || s.length === 0) {
    return [];
  }
  if (r.length === 0) {
    return splitEachItems(s, lim);
  }

  // Convert to regular
  const isRegExp = (o) =>
    Object.prototype.toString.call(o) === "[object RegExp]";
  const EmptyRegExpSource = "(?:)";
  let separatorRE;
  if (isRegExp(separator)) {
    separatorRE = separator;
    const reFlags = separatorRE.global
      ? separatorRE.flags
      : "g" + separatorRE.flags;
    separatorRE = new RegExp(separatorRE.source, reFlags);
  } else {
    const regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;
    separatorRE = new RegExp(r.replace(regexEscapeRE, "\\$&"), "g");
  }
  console.log(separatorRE);
  // Optimize
  if (separatorRE.source === EmptyRegExpSource) {
    return splitEachItems(s, lim);
  }

  // Regular Match
  let lastIndex = (separatorRE.lastIndex = 0);
  let match,
    index = 0,
    len = s.length,
    pendingPushCount = 0;
  let substrings = [];
  while ((match = separatorRE.exec(s))) {
    index = match.index;
    if (separatorRE.lastIndex === index) {
      ++separatorRE.lastIndex;
      if (index < len && !pendingPushCount++) {
        continue;
      }
    }
    substrings.push(s.substring(lastIndex, index));
    // check limit
    if(substrings.length >= lim) {
      return substrings;
    }
    if (match.length > 1) {
      substrings = substrings.concat(match.slice(1));
    }
    lastIndex = index + match[0].length;
    if (pendingPushCount > 0) {
      --pendingPushCount;
    }
  }

  // No match left
  if (index < s.length || pendingPushCount > 0) {
    substrings.push(s.substring(lastIndex));
  }

  return substrings;
}

module.exports.split2 = split2;

// const str = "aaaa***a*a",
//   separator = /a*/;
// console.log(String.prototype.split2.call(str, separator));
// console.log(String.prototype.split.call(str, separator));
