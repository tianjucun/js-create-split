const { split2 } = require("../code/split-create");
const { normalSplit } = require("../code/normal-split-create");
const { TestUnit } = require("./testUnit")

let fn1 = String.prototype.split;
let fn2 = split2;
const tester = new TestUnit(fn1, fn2);

// 一个字符
tester.addUnit({ s: ",", r: "," });
tester.addUnit({ s: ",", r: /,/ });
tester.addUnit({ s: ",", r: /.*/ });

// 字符串为空
tester.addUnit({ s: "" });

// 不同类型
tester.addUnit({ s: 1 });
tester.addUnit({ s: true });
tester.addUnit({ s: 1.2 });
tester.addUnit({ s: { s: "zhangsan" } });

// 特殊值
tester.addUnit({ s: null }); // error
tester.addUnit({ s: undefined }); // error
tester.addUnit({ s: NaN });

// 测试分隔符类型
tester.addUnit({ s: "1", r: 1 });
tester.addUnit({ s: "1.1", r: 1.1 });
tester.addUnit({ s: "atrueb", r: true });
tester.addUnit({ s: "undefined", r: undefined });
tester.addUnit({ s: "null", r: null });
tester.addUnit({ s: "Infinity", r: Infinity });

tester.addUnit({ s: "Infinity", r: new RegExp() });

tester.addUnit({ s: "a*aa**aaa***", r: "a" });
tester.addUnit({ s: "a*aa**aaa***", r: /a/ });
tester.addUnit({ s: "a*aa**aaa***a", r: /a*/ });
tester.addUnit({ s: "*aaa**a*", r: /a*/ });
tester.addUnit({ s: "*aaa**a*a", r: /a*/ });

tester.addUnit({ s: "a*aa**aaa***a", r: /a*/, lim: 3 });

tester.addUnit({ s: "a*aa**aaa***a", r: /(a)(aa)*/ });
tester.addUnit({ s: "a*aa**aaa***a", r: /(a)(aa)*/, lim: 0 });
tester.addUnit({ s: "a*aa**aaa***a", r: /(a)(aa)*/, lim: 4 });

tester.addUnit({ s: "a*aa**aaa***a", r: "*" });

tester.addUnit({ s: "}", r: "}" });
tester.addUnit({ s: "]", r: "]" });

// 大于\uFFFF的 Unicode 字符
tester.addUnit({ s: '𝟘𝟙𝟚𝟛', r: '' })
tester.addUnit({ s: '𨭎', r: '' })

tester.addUnit({ s: '123', r: '', lim: -1 })
tester.addUnit({ s: '123', r: '', lim: undefined })
tester.addUnit({ s: '123', r: '', lim: null })
tester.addUnit({ s: '123', r: '', lim: true })
tester.addUnit({ s: '123', r: '', lim: false })
tester.addUnit({ s: '123', r: '', lim: NaN })
tester.addUnit({ s: '123', r: '', lim: Infinity })
tester.addUnit({ s: '123', r: '', lim: Math.pow(2, 32) - 1 })



tester.addUnit({ s: "a*a*a*a", r: /a*/ });
tester.addUnit({ s: "a*a*a*", r: /a*/ });





tester.test();
