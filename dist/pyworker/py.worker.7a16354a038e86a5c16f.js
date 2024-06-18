(()=>{"use strict";const e="/dist/assets/python/auxiliary.py",t="/dist/assets/python/APWP-online_tools.py",r="/dist/assets/json/repodata.json";function n(e){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n(e)}function o(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,o,i,a,s=[],c=!0,l=!1;try{if(i=(r=r.call(e)).next,0===t){if(Object(r)!==r)return;c=!1}else for(;!(c=(n=i.call(r)).done)&&(s.push(n.value),s.length!==t);c=!0);}catch(e){l=!0,o=e}finally{try{if(!c&&null!=r.return&&(a=r.return(),Object(a)!==a))return}finally{if(l)throw o}}return s}}(e,t)||a(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function i(e){return function(e){if(Array.isArray(e))return s(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||a(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(e,t){if(e){if("string"==typeof e)return s(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?s(e,t):void 0}}function s(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function c(){/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */c=function(){return t};var e,t={},r=Object.prototype,o=r.hasOwnProperty,i=Object.defineProperty||function(e,t,r){e[t]=r.value},a="function"==typeof Symbol?Symbol:{},s=a.iterator||"@@iterator",l=a.asyncIterator||"@@asyncIterator",u=a.toStringTag||"@@toStringTag";function f(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{f({},"")}catch(e){f=function(e,t,r){return e[t]=r}}function p(e,t,r,n){var o=t&&t.prototype instanceof b?t:b,a=Object.create(o.prototype),s=new W(n||[]);return i(a,"_invoke",{value:S(e,r,s)}),a}function y(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}t.wrap=p;var d="suspendedStart",h="suspendedYield",m="executing",v="completed",g={};function b(){}function _(){}function w(){}var P={};f(P,s,(function(){return this}));var E=Object.getPrototypeOf,x=E&&E(E(G([])));x&&x!==r&&o.call(x,s)&&(P=x);var j=w.prototype=b.prototype=Object.create(P);function O(e){["next","throw","return"].forEach((function(t){f(e,t,(function(e){return this._invoke(t,e)}))}))}function L(e,t){function r(i,a,s,c){var l=y(e[i],e,a);if("throw"!==l.type){var u=l.arg,f=u.value;return f&&"object"==n(f)&&o.call(f,"__await")?t.resolve(f.__await).then((function(e){r("next",e,s,c)}),(function(e){r("throw",e,s,c)})):t.resolve(f).then((function(e){u.value=e,s(u)}),(function(e){return r("throw",e,s,c)}))}c(l.arg)}var a;i(this,"_invoke",{value:function(e,n){function o(){return new t((function(t,o){r(e,n,t,o)}))}return a=a?a.then(o,o):o()}})}function S(t,r,n){var o=d;return function(i,a){if(o===m)throw new Error("Generator is already running");if(o===v){if("throw"===i)throw a;return{value:e,done:!0}}for(n.method=i,n.arg=a;;){var s=n.delegate;if(s){var c=A(s,n);if(c){if(c===g)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===d)throw o=v,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=m;var l=y(t,r,n);if("normal"===l.type){if(o=n.done?v:h,l.arg===g)continue;return{value:l.arg,done:n.done}}"throw"===l.type&&(o=v,n.method="throw",n.arg=l.arg)}}}function A(t,r){var n=r.method,o=t.iterator[n];if(o===e)return r.delegate=null,"throw"===n&&t.iterator.return&&(r.method="return",r.arg=e,A(t,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var i=y(o,t.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,g;var a=i.arg;return a?a.done?(r[t.resultName]=a.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,g):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function k(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function M(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function W(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(k,this),this.reset(!0)}function G(t){if(t||""===t){var r=t[s];if(r)return r.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var i=-1,a=function r(){for(;++i<t.length;)if(o.call(t,i))return r.value=t[i],r.done=!1,r;return r.value=e,r.done=!0,r};return a.next=a}}throw new TypeError(n(t)+" is not iterable")}return _.prototype=w,i(j,"constructor",{value:w,configurable:!0}),i(w,"constructor",{value:_,configurable:!0}),_.displayName=f(w,u,"GeneratorFunction"),t.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===_||"GeneratorFunction"===(t.displayName||t.name))},t.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,w):(e.__proto__=w,f(e,u,"GeneratorFunction")),e.prototype=Object.create(j),e},t.awrap=function(e){return{__await:e}},O(L.prototype),f(L.prototype,l,(function(){return this})),t.AsyncIterator=L,t.async=function(e,r,n,o,i){void 0===i&&(i=Promise);var a=new L(p(e,r,n,o),i);return t.isGeneratorFunction(r)?a:a.next().then((function(e){return e.done?e.value:a.next()}))},O(j),f(j,u,"Generator"),f(j,s,(function(){return this})),f(j,"toString",(function(){return"[object Generator]"})),t.keys=function(e){var t=Object(e),r=[];for(var n in t)r.push(n);return r.reverse(),function e(){for(;r.length;){var n=r.pop();if(n in t)return e.value=n,e.done=!1,e}return e.done=!0,e}},t.values=G,W.prototype={constructor:W,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(M),!t)for(var r in this)"t"===r.charAt(0)&&o.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function n(n,o){return s.type="throw",s.arg=t,r.next=n,o&&(r.method="next",r.arg=e),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],s=a.completion;if("root"===a.tryLoc)return n("end");if(a.tryLoc<=this.prev){var c=o.call(a,"catchLoc"),l=o.call(a,"finallyLoc");if(c&&l){if(this.prev<a.catchLoc)return n(a.catchLoc,!0);if(this.prev<a.finallyLoc)return n(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return n(a.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return n(a.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&o.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var i=n;break}}i&&("break"===e||"continue"===e)&&i.tryLoc<=t&&t<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=e,a.arg=t,i?(this.method="next",this.next=i.finallyLoc,g):this.complete(a)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),g},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),M(r),g}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var o=n.arg;M(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:G(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),g}},t}function l(e,t,r,n,o,i,a){try{var s=e[i](a),c=s.value}catch(e){return void r(e)}s.done?t(c):Promise.resolve(c).then(n,o)}function u(e){return function(){var t=this,r=arguments;return new Promise((function(n,o){var i=e.apply(t,r);function a(e){l(i,n,o,a,s,"next",e)}function s(e){l(i,n,o,a,s,"throw",e)}a(void 0)}))}}function f(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function p(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?f(Object(r),!0).forEach((function(t){y(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):f(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function y(e,t,r){var o;return o=function(e,t){if("object"!=n(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var o=r.call(e,t||"default");if("object"!=n(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==n(o)?o:String(o))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}importScripts("https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js");var d=[{name:"Euler_poles_101.csv",url:"/dist/assets/resources/Euler_poles_101.csv"},{name:"Euler_poles_102.csv",url:"/dist/assets/resources/Euler_poles_102.csv"},{name:"Euler_poles_201.csv",url:"/dist/assets/resources/Euler_poles_201.csv"},{name:"Euler_poles_301.csv",url:"/dist/assets/resources/Euler_poles_301.csv"},{name:"Euler_poles_304.csv",url:"/dist/assets/resources/Euler_poles_304.csv"},{name:"Euler_poles_501.csv",url:"/dist/assets/resources/Euler_poles_501.csv"},{name:"Euler_poles_503.csv",url:"/dist/assets/resources/Euler_poles_503.csv"},{name:"Euler_poles_701.csv",url:"/dist/assets/resources/Euler_poles_701.csv"},{name:"Euler_poles_801.csv",url:"/dist/assets/resources/Euler_poles_801.csv"},{name:"Euler_poles_802.csv",url:"/dist/assets/resources/Euler_poles_802.csv"},{name:"Euler_poles_901.csv",url:"/dist/assets/resources/Euler_poles_901.csv"},{name:"Global_APWP_DB_Vaes_et_al.xlsx",url:"/dist/assets/resources/Global_APWP_DB_Vaes_et_al.xlsx"},{name:"Global_APWP_Vaes_et_al.xlsx",url:"/dist/assets/resources/Global_APWP_Vaes_et_al.xlsx"}];function h(e){"function"==typeof e.toJs&&(e=Object.fromEntries(e.toJs())),self.postMessage(p(p({},e),{},{id:0}))}var m={loadPyodide:{title:"1/5 Loading python runtime..",content:"We are setting up a local calculation engine, this way none of your data is send to a server or leaves your machine!"},loadMicropip:{title:"2/5 Loading package manager..",content:"We are setting up a local calculation engine, this way none of your data is send to a server or leaves your machine!"},loadLibraries:{title:"3/5 Loading supporting libraries..",content:"We are setting up a local calculation engine, this way none of your data is send to a server or leaves your machine!"},loadData:{title:"4/5 Loading datamodel..",content:"We are setting up a local calculation engine, this way none of your data is send to a server or leaves your machine!"},loadCode:{title:"5/5 Loading calculation code..",content:"We are setting up a local calculation engine, this way none of your data is send to a server or leaves your machine!"},finished:{title:"The calculation engine is ready.",content:"Lets get to work!",messagetime:6e3,spinner:!1},error:{title:"! Error initialising the calculation engine.",content:"More information could be found in the javascript <br/>error console ##__consoleShortcut__##",spinner:!1}};function v(){return(v=u(c().mark((function n(){var o;return c().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,Date.now(),h(m.loadPyodide),n.next=5,loadPyodide({lockFileURL:r});case 5:return self.pyodide=n.sent,pyodide.setStderr({batched:function(e){console.error(e)}}),h(m.loadMicropip),n.next=10,self.pyodide.loadPackage("micropip");case 10:return o=self.pyodide.pyimport("micropip"),h(m.loadLibraries),n.next=14,o.install(["pandas","future","scipy","matplotlib","pmagpy==4.2.109","openpyxl","setuptools"]);case 14:return h(m.loadData),n.next=17,Promise.all(d.map((function(e){return self.pyodide.runPythonAsync('\n                from pyodide.http import pyfetch\n                data = await pyfetch("'.concat(e.url,'")\n\n                with open("').concat(e.name,'", "wb") as f:\n                    f.write(await data.bytes())\n            '))})));case 17:return h(m.loadCode),n.next=20,self.pyodide.runPythonAsync('\n            from pyodide.http import pyfetch\n            auxCode = await pyfetch("'.concat(e,'")\n            from pyodide.http import pyfetch\n            calcCode = await pyfetch("').concat(t,'")\n\n            with open("auxiliary.py", "wb") as f:\n                f.write(await auxCode.bytes())\n            with open("APWP-online_tools.py", "wb") as f:\n                f.write(await calcCode.bytes())\n        '));case 20:self.pyodide.pyimport("auxiliary"),self.pyodide.pyimport("APWP-online_tools"),h(m.finished),n.next=30;break;case 25:n.prev=25,n.t0=n.catch(0),console.error(n.t0.message),console.error(n.t0),h(m.error);case 30:case"end":return n.stop()}}),n,null,[[0,25]])})))).apply(this,arguments)}var g,b;function _(e,t){try{var r=b.parsePaleoPoles(pyodide.toPy(t),h),n=x(r.toJs());h({messagetime:0}),self.postMessage({results:n,id:e}),r.destroy()}catch(t){h({title:"! Error while running calculations",content:"More information could be found in the javascript <br/>error console ##__consoleShortcut__##",messagetime:12e4,spinner:!1}),self.postMessage({error:t.message,id:e})}}function w(e,t){try{var r=b.getReferencePoles(pyodide.toPy(t),h),n=x(r.toJs());h({messagetime:0}),self.postMessage({results:n,id:e}),r.destroy()}catch(t){h({title:"! Error while running calculations",content:"More information could be found in the javascript <br/>error console ##__consoleShortcut__##",messagetime:12e4,spinner:!1}),self.postMessage({error:t.message,id:e})}}function P(e,t){try{var r=b.calcRPD(pyodide.toPy(t),h),n=x(r.toJs());h({messagetime:0}),self.postMessage({results:n,id:e}),r.destroy()}catch(t){h({title:"! Error while running calculations",content:"More information could be found in the javascript <br/>error console ##__consoleShortcut__##",messagetime:12e4,spinner:!1}),self.postMessage({error:t.message,id:e})}}function E(e,t){try{var r=b.calcAPWP(pyodide.toPy(t),h),n=x(r.toJs());h({messagetime:0}),self.postMessage({results:n,id:e}),r.destroy()}catch(t){h({title:"! Error while running calculations",content:"More information could be found in the javascript <br/>error console ##__consoleShortcut__##",messagetime:12e4,spinner:!1}),self.postMessage({error:t.message,id:e})}}function x(e){return e instanceof Map?Object.fromEntries(i(e).map((function(e){var t=o(e,2);return[t[0],x(t[1])]}))):Array.isArray(e)?e.map((function(e){return x(e)})):e}g=function(){return v.apply(this,arguments)}(),self.onmessage=function(){var e=u(c().mark((function e(t){var r,n,o,i;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,g;case 2:void 0===b&&(b=pyodide.pyimport("APWP-online_tools")),r=t.data,n=r.id,o=r.cmd,i=r.options,"parsePaleoPoles"===o?_(n,i):"getReferencePoles"===o?w(n,i):"calcRPD"===o?P(n,i):"calcAPWP"===o?E(n,i):console.error("Pyodide worker tried to perform the unkown command '".concat(o,"'"));case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()})();