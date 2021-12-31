function convertToNumber(val) {
  let num = new Number(val);
  if(isFinite(num)) {
    return Math.floor(Math.abs(num))
  }
  return 0;
}

function isRegExp(o) {
  return Object.prototype.toString.call(o) == "[object RegExp]";
}

const nativeSplit = String.prototype.split;

function split(separator, limit) {
  let O = this;
  if(O == null) {
    throw new TypeError();
  }
  if(isRegExp(separator)) {
    return nativeSplit.call(O, separator, limit);
  }
  let s = O.toString();
  if(typeof separator == 'undefined') {
    return [s]
  } 
  const MAX_LIMIT = 2 ** 32 - 1;
  let lim = limit === undefined ? MAX_LIMIT : Math.min(convertToNumber(limit), MAX_LIMIT);
  let r = new String(separator);
  if(lim == 0 || s.length == 0) {
    return [];
  }
  const separatorLength = r.length;
  if(separatorLength == 0) {
    return s.match(/[^(?:)]/g);
  }

  // Match
  let i = 0;
  let j;
  let substrings = [];
  while((j = s.indexOf(r, i)) != -1) {
    substrings.push(
      s.substring(i, j)
    );
    if(substrings.length >= limit) {
      return substrings;
    }
    i = j + separatorLength;
  }
  substrings.push(
    s.substring(i)
  );
  return substrings;
}

module.exports.normalSplit = split;
