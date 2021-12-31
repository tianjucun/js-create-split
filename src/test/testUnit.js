function covertToArray(objParam) {
  let arr = objParam;
  if (!Array.isArray(objParam)) {
    let keys = Object.keys(objParam);
    arr = keys.map((key) => {
      return objParam[key];
    });
  }
  return arr;
}

const red = (str) => `\x1b[31m${str}\x1b[0m`;
const green = (str) => `\x1b[34m${str}\x1b[0m`;
const purple = (str) => `\x1b[35m${str}\x1b[0m`;

class TestUnit {
  constructor(fn1, fn2) {
    this.loggers = [];
    this.unitGroup = [];
    this.fn1 = fn1;
    this.fn2 = fn2;
  }
  addUnit(args) {
    this.unitGroup.push(args);
  }
  log(msg) {
    this.loggers.push(msg);
  }
  arrayIsEq(arr1, arr2) {
    if (Array.isArray(arr1) && Array.isArray(arr2)) {
      return arr1.length == arr2.length && arr1.every((val, idx) => {
        let eq = val === arr2[idx];
        // add logger
        return eq;
      });
    }
    // add logger
    return false;
  }
  createLogger(r1, r2, p, idx, passed) {
    return `unit(${idx}): ${passed ? '✔' : '❌'}
          input:   (${p}),
          output1: (${JSON.stringify(r1)}),
          output2: (${JSON.stringify(r2)})`;
  }
  test() {
    let a = this.fn1,
      b = this.fn2;
    const ctx = this;
    let p, p_s, aRes, bRes;
    let t = {
      s: [],
      e: [],
      c: [],
    };
    this.unitGroup.forEach((params, idx) => {
      try {
        p = covertToArray(params);
        p_s = p.join();
        let ctx = p.shift();
        aRes = a.apply(ctx, p);
        bRes = b.apply(ctx, p);
        if (this.arrayIsEq(aRes, bRes)) {
          this.log(green(this.createLogger(aRes, bRes, p_s, idx, true)));
          t.s.push(idx);
        } else {
          this.log(red(this.createLogger(aRes, bRes, p_s, idx, false)));
          t.e.push(idx);
        }
      } catch (err) {
        // internal error
        ctx.log(red(this.createLogger(aRes, bRes, p_s, idx, false)));
        ctx.log(
          red(`unit(${idx}): => call error ❌
          errors:  ${err.stack})`)
        );
        t.c.push(idx);
      }
    });

    // sum logger
    this.log(
      purple(`test(${this.unitGroup.length}): 
      success: (${t.s.length})=>(${t.s});
      ${red(`error:   (${t.e.length})=>(${t.e});`)}
      ${red(`internal error: (${t.c.length})=>(${t.c})`)}`)
    );

    if (this.loggers.length > 0) {
      this.log("----------------------Logger---------------------------");
      this.loggers.forEach((log) => {
        console.log(log);
      });
      this.log("----------------------Logger---------------------------");
    }
    return this.loggers;
  }
}

module.exports.TestUnit = TestUnit;
