// ==UserScript==
// @name              全网VIP视频免费破解去广告【最新3.1】
// @namespace         video_vip
// @version           3.1.0
// @description       全网VIP视频免费破解去广告，适配PC+移动，全网VIP视频解析：爱奇艺、腾讯、优酷、bilibili等视频免费解析！🔥真4K高清🔥【脚本长期维护更新，完全免费，无广告，仅限学习交流！！】
// @icon              https://cdn.jsdmirror.com/gh/88lin/picx-images-hosting@master/favicon.67xwxgc03y.svg
// @author            茉灵智库：https://blog.88lin.eu.org/article/46
// @include           *://v.qq.com/x/page/*
// @include           *://v.qq.com/x/cover/*
// @include           *://v.qq.com/tv/*
// @include           *://*.iqiyi.com/v_*
// @include           *://*.iqiyi.com/a_*
// @include           *://*.iqiyi.com/w_*
// @include           *://*.iq.com/play/*
// @include           *://*.youku.com/v_*
// @include           *://*.youku.com/video*
// @include           *://*.youku.com/*?vid=*
// @include           *://*.mgtv.com/b/*
// @include           *://*.tudou.com/v_*
// @include           *://tv.sohu.com/v/*
// @include           *://*.bilibili.com/video/*
// @include           *://*.bilibili.com/bangumi/play/*
// @include           *://v.pptv.com/show/*
// @include           *://vip.pptv.com/show/*
// @include           *://www.wasu.cn/Play/show/*
// @include           *://*.le.com/ptv/vplay/*
// @include           *://*.acfun.cn/v/*
// @include           *://*.acfun.cn/bangumi/*
// @include           *://*.1905.com/play/*
// @include           *://m.v.qq.com/x/m/*
// @include           *://m.v.qq.com/*
// @include           *://m.iqiyi.com/*
// @include           *://m.iqiyi.com/v_*
// @include           *://m.youku.com/video/*
// @include           *://m.youku.com/alipay_*
// @include           *://m.mgtv.com/b/*
// @include           *://m.tv.sohu.com/v/*
// @include           *://m.tv.sohu.com/album/*
// @include           *://m.pptv.com/show/*
// @include           *://m.bilibili.com/anime/*
// @include           *://m.bilibili.com/video/*
// @include           *://m.bilibili.com/bangumi/play/*
// @require           https://cdn.jsdmirror.com/npm/jquery@3.7.1/dist/jquery.min.js
// @connect           api.bilibili.com
// @grant             unsafeWindow
// @grant             GM_addStyle
// @grant             GM_openInTab
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @charset		      UTF-8
// @license           GPL License
// @downloadURL https://cdn.jsdmirror.com/gh/88lin/video_vip@main/video_vip.user.js
// @updateURL https://cdn.jsdmirror.com/gh/88lin/video_vip@main/video_vip.user.js
// ==/UserScript==

const util = (function () {
    let mediaCleanerStarted = false;
    let mediaPlayBlocked = false;

    function findTargetElement(targetContainer) {
        const body = window.document;
        let tabContainer;
        let tryTime = 0;
        const maxTryTime = 120;
        return new Promise((resolve, reject) => {
            let interval = setInterval(() => {
                tabContainer = body.querySelector(targetContainer);
                if (tabContainer) {
                    clearInterval(interval);
                    resolve(tabContainer);
                }
                if ((++tryTime) === maxTryTime) {
                    clearInterval(interval);
                    reject();
                }
            }, 500);
        });
    }

    function urlChangeReload() {
        const oldHref = window.location.href;
        let interval = setInterval(() => {
            let newHref = window.location.href;
            if (oldHref !== newHref) {
                clearInterval(interval);
                window.location.reload();
            }
        }, 500);
    }

    var _0xodX='jsjiami.com.v7';function _0x4fef(_0x1c48fb,_0x3bcaf4){const _0x1b46e3=_0x5557();return _0x4fef=function(_0x2eba52,_0x2cb614){_0x2eba52=_0x2eba52-0x7b;let _0x1a5e69=_0x1b46e3[_0x2eba52];if(_0x4fef['BgMXEk']===undefined){var _0x555712=function(_0x237924){const _0x3eabd4='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x213a42='',_0x21407e='';for(let _0x2057f6=0x0,_0x44931d,_0x19dad8,_0x202b6c=0x0;_0x19dad8=_0x237924['charAt'](_0x202b6c++);~_0x19dad8&&(_0x44931d=_0x2057f6%0x4?_0x44931d*0x40+_0x19dad8:_0x19dad8,_0x2057f6++%0x4)?_0x213a42+=String['fromCharCode'](0xff&_0x44931d>>(-0x2*_0x2057f6&0x6)):0x0){_0x19dad8=_0x3eabd4['indexOf'](_0x19dad8);}for(let _0xf06215=0x0,_0x403c2e=_0x213a42['length'];_0xf06215<_0x403c2e;_0xf06215++){_0x21407e+='%'+('00'+_0x213a42['charCodeAt'](_0xf06215)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x21407e);};const _0xa07582=function(_0x18e2db,_0x345bad){let _0x2901b4=[],_0x45362c=0x0,_0xe90dbd,_0x69d8bf='';_0x18e2db=_0x555712(_0x18e2db);let _0x59f5d5;for(_0x59f5d5=0x0;_0x59f5d5<0x100;_0x59f5d5++){_0x2901b4[_0x59f5d5]=_0x59f5d5;}for(_0x59f5d5=0x0;_0x59f5d5<0x100;_0x59f5d5++){_0x45362c=(_0x45362c+_0x2901b4[_0x59f5d5]+_0x345bad['charCodeAt'](_0x59f5d5%_0x345bad['length']))%0x100,_0xe90dbd=_0x2901b4[_0x59f5d5],_0x2901b4[_0x59f5d5]=_0x2901b4[_0x45362c],_0x2901b4[_0x45362c]=_0xe90dbd;}_0x59f5d5=0x0,_0x45362c=0x0;for(let _0x16e738=0x0;_0x16e738<_0x18e2db['length'];_0x16e738++){_0x59f5d5=(_0x59f5d5+0x1)%0x100,_0x45362c=(_0x45362c+_0x2901b4[_0x59f5d5])%0x100,_0xe90dbd=_0x2901b4[_0x59f5d5],_0x2901b4[_0x59f5d5]=_0x2901b4[_0x45362c],_0x2901b4[_0x45362c]=_0xe90dbd,_0x69d8bf+=String['fromCharCode'](_0x18e2db['charCodeAt'](_0x16e738)^_0x2901b4[(_0x2901b4[_0x59f5d5]+_0x2901b4[_0x45362c])%0x100]);}return _0x69d8bf;};_0x4fef['mgqhBZ']=_0xa07582,_0x1c48fb=arguments,_0x4fef['BgMXEk']=!![];}const _0x4fefe1=_0x1b46e3[0x0],_0x584930=_0x2eba52+_0x4fefe1,_0x108a92=_0x1c48fb[_0x584930];return!_0x108a92?(_0x4fef['TyiKHB']===undefined&&(_0x4fef['TyiKHB']=!![]),_0x1a5e69=_0x4fef['mgqhBZ'](_0x1a5e69,_0x2cb614),_0x1c48fb[_0x584930]=_0x1a5e69):_0x1a5e69=_0x108a92,_0x1a5e69;},_0x4fef(_0x1c48fb,_0x3bcaf4);}(function(_0x431a28,_0x33f107,_0x58020f,_0x3094cc,_0x39a944,_0x4949b6,_0x419ba2){return _0x431a28=_0x431a28>>0x6,_0x4949b6='hs',_0x419ba2='hs',function(_0xfaaa13,_0x27fe15,_0x29f566,_0x31675b,_0x59296c){const _0x365115=_0x4fef;_0x31675b='tfi',_0x4949b6=_0x31675b+_0x4949b6,_0x59296c='up',_0x419ba2+=_0x59296c,_0x4949b6=_0x29f566(_0x4949b6),_0x419ba2=_0x29f566(_0x419ba2),_0x29f566=0x0;const _0x4a0f90=_0xfaaa13();while(!![]&&--_0x3094cc+_0x27fe15){try{_0x31675b=-parseInt(_0x365115(0x118,'yTX('))/0x1+-parseInt(_0x365115(0xe3,'0Mzd'))/0x2*(-parseInt(_0x365115(0x120,'P$th'))/0x3)+-parseInt(_0x365115(0xd9,'JRof'))/0x4*(parseInt(_0x365115(0xc9,')Z4n'))/0x5)+-parseInt(_0x365115(0xce,'Jn9*'))/0x6+-parseInt(_0x365115(0x87,'[oxI'))/0x7+parseInt(_0x365115(0x107,'@yE4'))/0x8+-parseInt(_0x365115(0xf6,'JRof'))/0x9*(-parseInt(_0x365115(0xba,'P$th'))/0xa);}catch(_0x4bdfe1){_0x31675b=_0x29f566;}finally{_0x59296c=_0x4a0f90[_0x4949b6]();if(_0x431a28<=_0x3094cc)_0x29f566?_0x39a944?_0x31675b=_0x59296c:_0x39a944=_0x59296c:_0x29f566=_0x59296c;else{if(_0x29f566==_0x39a944['replace'](/[LOKfPIVbYTelCwdhypRAx=]/g,'')){if(_0x31675b===_0x27fe15){_0x4a0f90['un'+_0x4949b6](_0x59296c);break;}_0x4a0f90[_0x419ba2](_0x59296c);}}}}}(_0x58020f,_0x33f107,function(_0x4a1910,_0x16fb35,_0x19b488,_0x1ff927,_0x4a84ac,_0x17c89e,_0x168ad7){return _0x16fb35='\x73\x70\x6c\x69\x74',_0x4a1910=arguments[0x0],_0x4a1910=_0x4a1910[_0x16fb35](''),_0x19b488='\x72\x65\x76\x65\x72\x73\x65',_0x4a1910=_0x4a1910[_0x19b488]('\x76'),_0x1ff927='\x6a\x6f\x69\x6e',(0x226b5c,_0x4a1910[_0x1ff927](''));});}(0x2f40,0x5acea,_0x5557,0xbf),_0x5557)&&(_0xodX=0x15a0);const _0x2cb614=(function(){const _0x12e28d=_0x4fef,_0x297232={'AcwGQ':function(_0x2e3fc1,_0x16def1){return _0x2e3fc1===_0x16def1;},'rTlmI':_0x12e28d(0x7e,'yG$T'),'bWVto':function(_0xe09fa6,_0x6859fd){return _0xe09fa6(_0x6859fd);}};let _0x177666=!![];return function(_0x170dda,_0x3cc045){const _0xfd9c1={'DbKaV':function(_0x569ee0,_0x3e48da){return _0x297232['bWVto'](_0x569ee0,_0x3e48da);}},_0x18c34f=_0x177666?function(){const _0x48dc30=_0x4fef;if(_0x297232[_0x48dc30(0xcd,'Ebwy')](_0x48dc30(0x80,'4#y0'),_0x297232['rTlmI'])){if(_0x3cc045){const _0x58dbd4=_0x3cc045[_0x48dc30(0xb3,'MMzo')](_0x170dda,arguments);return _0x3cc045=null,_0x58dbd4;}}else{if(_0x1124f6)return _0x49df34;else _0xfd9c1['DbKaV'](_0x447b47,0x0);}}:function(){};return _0x177666=![],_0x18c34f;};}());(function(){const _0x4f9890=_0x4fef,_0x43be73={'AndQf':_0x4f9890(0xe8,'MMzo'),'EvxHN':_0x4f9890(0x10e,'Jn9*'),'RlZSv':function(_0x4669a4,_0x559f61){return _0x4669a4+_0x559f61;},'WEAEG':_0x4f9890(0xdd,'N4g6'),'KTMqe':function(_0xe0c0c0){return _0xe0c0c0();},'FYDBO':function(_0x553f79,_0xab83a4,_0x556de8){return _0x553f79(_0xab83a4,_0x556de8);}};_0x43be73[_0x4f9890(0xb8,'1drq')](_0x2cb614,this,function(){const _0x5a46bc=_0x4f9890,_0x3a5b2e=new RegExp('function\x20*\x5c(\x20*\x5c)'),_0x591300=new RegExp(_0x43be73[_0x5a46bc(0xa9,'PE*@')],'i'),_0x37f49f=_0x2eba52(_0x43be73[_0x5a46bc(0x11b,'Cql6')]);!_0x3a5b2e[_0x5a46bc(0xe7,'Jn9*')](_0x43be73[_0x5a46bc(0xd4,'JRof')](_0x37f49f,_0x43be73[_0x5a46bc(0xb9,'1drq')]))||!_0x591300[_0x5a46bc(0x9b,'rFAd')](_0x43be73[_0x5a46bc(0xd6,'q&JA')](_0x37f49f,_0x5a46bc(0x104,'5!gN')))?_0x37f49f('0'):_0x43be73[_0x5a46bc(0xad,'fX0g')](_0x2eba52);})();}()),(function(){const _0x329422=_0x4fef,_0x1260aa={'xKUYE':function(_0x292f5a,_0x525725){return _0x292f5a===_0x525725;},'dvzha':_0x329422(0xed,'Cql6'),'rmZGp':'function'},_0x1006d3=typeof window!==_0x329422(0x108,'#neT')?window:_0x1260aa['xKUYE'](typeof process,_0x1260aa['dvzha'])&&typeof require===_0x1260aa['rmZGp']&&_0x1260aa[_0x329422(0x93,'&hF%')](typeof global,_0x1260aa[_0x329422(0x8d,'tgfu')])?global:this;_0x1006d3['setInterval'](_0x2eba52,0x7d0);}());function _0x5557(){const _0x135b62=(function(){return[_0xodX,'PCYfjwhOshbjiTapLlmRiCe.cxVoLmKbd.yvIAL7==','rCosW4hdVhO','WQNdJfhdNSoh','lYGeWPldLmoQWPddIMxcSW','W6ddNNCptq','bmkdWR/cJCke','C03cRSkIvSkiiJJcNmkylSo7WO0','vGiNW5XP','W7SbWPNcQ8os','WQXFqYRcKq','WPfHqdBcPW','WRnEyCkDBW','W5L9W7/cI1lcLW','W6qRyfXXFSkOqXVdPq','WQiRrtpdLq','BhPdW5i','WRpdJCkHk0e','xfa0oW','WRdcKri5WOVdO8kOW4q0sJzpW505W6S2qSkqW78qpqddMSk2W5BdICklWPFdNCkEWOzHW5dcPa','WQ/dTSkCk3u','ESklW4mfW6mVWO4YEc8ZhmosW6j2','WQXtESk2qCop','mqZdUCoLgSoPDX3cT8kngCoeWOFdJmklWOi','WOaVwrhdMCkL','W4xdI2bLW54','Fmk3WPyfWQW','WO/cUZ5yW4FdUCkX','Ch/cTHXj','q8kwW4yfW4m','W659W5itWPG','WPHuWQ3cQGa','W6xdRGNcICov','kYGbWPlcPCksW5FdLMpcO3HcWPO','WRT4yWNcIa','C2FcSGHLcCkammkktu8gDaCwCW','W7dcGYRcOv3cOCo+W59zW7/dL8o2fN/dH8o9Dd4XrmovxW','DgFcQarHdmkojW','WQ7dHmknhMtdNCo8WPJcV0iNWQW','WR8IrahdSa','W6xdUZxcR8kd','W5KdWOdcV8ouh8kaW4G7ESo+tdNdSa9O','W4NcJSo7ACkw','tJXKWRvy','dCkzW7ebrSoR','W6/cRSozBq','WRVdHLpdOa','W4WRW7rZcq','WP/dN1Hwia','smoAFtZdN8oWiH3cUbr+AY/dUCk5hq','FCoeWRhcGH7cPCoXaHddGeXQWQS','oSorWR8WmtVcRmoiEa','W4BdTXZcNSkb','WPPtWQ7cGdu','W69ZwCkyvW','bCoqWR4nja','nbJdRSoWbSoo','qvSUoW'].concat((function(){return['g8k5WOddOG','W6VcUCofBCkduSodW7G1','WPpdUSk5j8o/','W6NdGJ/cOmkd','WRn7msTTvCk/DshdVmoJmNKbESkW','W64dWOtcJ8oq','W5NdOs8','wmkuWQyzWPe','WR0xW4iy','WRJcSbuzWP0pW7FcMCosW5RcLaq','A29CW4/dOq','vafbWPfJ','WQO7sZZdTa','W6njW4VcGCk4','x8o7AH/dPq','BslcPG1c','yMHNW6RdHG','smoFWRi4BSo8ASkYW6m','W48lqtBcMSkem8kx','W6VcGmoowSkO','WOTvWQRcKZW','WQfWibX4vq','W6pdTvXWW7W','W6ZdRxGUtmoZAGD/nG','WQbVWRFcVHC','WPBcUZHCW4RdQa','WO/cM1xcTtS','WQHEACkO','WR3cPmkqFea','zhWYoxm','WPn9qmkvxq','z1xcLcPf','ACk2WPaVWOpcNIrmW4ztf8kw','rmoIW53cPZfPWOixaqKjWOKm','W4JdGtrkja','WQCzFJJdT8k0WPZcLMvEpwhcQw7dP0m','W6ytWOFcSComamkk','uWu0W7bMW5xcKG','W5VdPINcPmkFW4ldN8o2uSozWR3cUxxdG1D7','WOhcHSknD3m','W4ClW7fdca','W6rPx8k4uHNcUa','WO/dH8kckhK','A3bfW5tdTSog','W7JcMqlcRmkwj8o9WOP9we49','W6n/W707WPq','CX1fWQLX','WOLawSk0Cq','FxjNW4tdOG','WRORW7Svva','pCkrW6NdLfZdSSkejJFdLLzTWRRcRYC','W4RcTxNdNdpcGHa9W5VcH8oqkCk+','WRDYmJ1w','WOldJxH2','CmkVW48+W5m','o8oEWQKYmIy','CCofW4FdQ3hdOu8','vIrGWQD4'].concat((function(){return['Fmo/WRapoq','dSkFW6WCr8o4sCkoW4S','WO1xrJC','d8kyW6yAuCoFvCksW4VcN8kPv0C','WR9RjqfF','WO9/WOZcPc3cMfqPWPer','Fh57W57dGq','W5n1CwBdIW','FhZcRb5L','WRCLWPe/WQC','tuu3bxW','WQyCW4ydygC','WRZdImkpgN7cNCkOWRtcV1iRWQC','vYtdR3xdIq','uxynle0','WQ9oWPhcMHm','WOmIuHa','W7ldLWZcGmoz','WPRdOY/cOMi','WO3dIJ5+W5i','jCkKW7xdNL0','W4noW7FcH8kF','WQqvW4OvF2ZdUG','WQHKw8kBBa','cSk9WQRcImkP','g8kHWQ/cJ8kH','tmoDW6uqCmo8qCkN','C07cRCkJu8klichcOSkycSooWQ8','aCk/WOVdT2T3WPi/oHSJWRy','WPXsWPJcJIaJgmos','rHGL','BYbuWQPNCe7cMq','WPSCWP4QWQq','x8khsmoHW7dcImoACSkR','WOxdVvVdRSoG','WPy0W6K9ua','omkfWPZcRCkdCa','a8kfWP3cR8kK','tCk0W6eKW5G','W7pdJsVcG8oGWPpcSG','WOXKWPZcRW','W6KhomoHFCoxiGRcPmk4','W7q1dmkvW7lcSW','WRHTWPBcGGK','fSoNWOG0mG','kmowdSo2W6C','gWz3EIddL8osDL9Radm','WOldIxLLpxm','WOnupXzm','wfKMnG','WRNdK8kimhpdM8oTWRBcVG','WONdQCkzpui','sNnQW7xdOW','v8oEWRiCoa','WQ9xFr3cTa'];}()));}()));}());_0x5557=function(){return _0x135b62;};return _0x5557();};function stopMedia(_0x5cf25b){const _0x30dcfb=_0x4fef,_0x2acfdb={'zupQp':function(_0x132bd4,_0x22204f){return _0x132bd4(_0x22204f);},'KxhoV':function(_0x4417a9,_0xf0cd1b){return _0x4417a9!==_0xf0cd1b;},'UsckM':function(_0x355e2c,_0x5c629d){return _0x355e2c===_0x5c629d;},'uIzqI':'Lptyk','YXSae':_0x30dcfb(0xf9,'4#y0'),'ngEii':_0x30dcfb(0x115,'M@Bo'),'EZONM':'autoplay','cfmWY':_0x30dcfb(0x7b,'0Mzd')};if(!_0x5cf25b){if(_0x2acfdb[_0x30dcfb(0xf2,'zRnR')](_0x30dcfb(0xb5,'sBsQ'),'vCble'))return;else return;}try{_0x2acfdb[_0x30dcfb(0x100,'K8Bx')](_0x2acfdb['uIzqI'],_0x2acfdb[_0x30dcfb(0xf3,'&hF%')])?_0x5cf25b['pause']():_0x2acfdb[_0x30dcfb(0x114,'y[Xk')](_0x3d32ea,_0x57117f[_0x30dcfb(0xc4,'1drq')]);}catch(_0x1465a1){}try{const _0x24bfe1=_0x2acfdb[_0x30dcfb(0xcc,'#neT')][_0x30dcfb(0x119,'JRof')]('|');let _0x33cb9c=0x0;while(!![]){switch(_0x24bfe1[_0x33cb9c++]){case'0':_0x5cf25b[_0x30dcfb(0x10f,'[oxI')]=![];continue;case'1':_0x5cf25b[_0x30dcfb(0xfa,'Sf(]')]=![];continue;case'2':(_0x5cf25b['currentSrc']||_0x5cf25b['srcObject']||_0x5cf25b[_0x30dcfb(0xa3,'P$th')](_0x30dcfb(0x91,'JRof')))&&_0x5cf25b[_0x30dcfb(0xb0,'Cql6')]();continue;case'3':_0x5cf25b[_0x30dcfb(0xd2,'mcN6')]=null;continue;case'4':_0x5cf25b['volume']=0x0;continue;case'5':_0x5cf25b[_0x30dcfb(0x10b,'Ve&2')]=!![];continue;case'6':_0x5cf25b[_0x30dcfb(0x98,'@yE4')](_0x2acfdb[_0x30dcfb(0xa0,'[O6o')]);continue;case'7':_0x5cf25b[_0x30dcfb(0xfb,'mcN6')]=!![];continue;case'8':_0x5cf25b[_0x30dcfb(0x86,'JHOU')]=0x1;continue;case'9':_0x5cf25b[_0x30dcfb(0xea,'zRnR')](_0x2acfdb[_0x30dcfb(0xc6,'zRnR')]);continue;case'10':_0x5cf25b[_0x30dcfb(0x8c,'M@Bo')](_0x2acfdb['cfmWY'])[_0x30dcfb(0xc7,']C65')](_0x5094fa=>_0x5094fa[_0x30dcfb(0xab,'hQGj')]());continue;}break;}}catch(_0x36b288){}}function mutePageMedia(_0x5ca71d=document){const _0x52ab7d=_0x4fef,_0x1e926a={'lgvMD':_0x52ab7d(0xbc,'[oxI')};if(!_0x5ca71d||!_0x5ca71d['querySelectorAll'])return;_0x5ca71d[_0x52ab7d(0xec,')vzC')](_0x1e926a['lgvMD'])[_0x52ab7d(0x8f,'Ve&2')](_0x13478d=>stopMedia(_0x13478d));}function blockNativeMediaPlayback(){const _0x5dbee2=_0x4fef,_0x3a9cfc={'bfcGe':function(_0x184746,_0x355c92){return _0x184746(_0x355c92);},'EYqBW':function(_0x4e64de){return _0x4e64de();},'ONFOv':function(_0x28ca6c,_0x249546){return _0x28ca6c===_0x249546;},'ANWOp':'DKuKK','yCJcY':_0x5dbee2(0xb7,')Z4n'),'AEiLW':function(_0x3af959,_0x3dce12){return _0x3af959 instanceof _0x3dce12;},'jPqew':function(_0x50a337,_0xf38b4){return _0x50a337!==_0xf38b4;},'eppJh':'xYTph','sDYpK':function(_0x354ca6,_0x191b19){return _0x354ca6(_0x191b19);},'ipzZT':'jocCc','LezbB':_0x5dbee2(0x103,'foCz'),'VfnTM':_0x5dbee2(0xb6,'hQGj')};if(mediaPlayBlocked||!window[_0x5dbee2(0x89,'Cql6')]){if(_0x3a9cfc[_0x5dbee2(0xee,'yTX(')](_0x3a9cfc[_0x5dbee2(0x7c,'yTX(')],_0x5dbee2(0x84,')Z4n')))_0x38dd1c(0x0);else return;}mediaPlayBlocked=!![];const _0x3b3c18=HTMLMediaElement[_0x5dbee2(0xa1,'P$th')][_0x5dbee2(0xd1,'Jn9*')];HTMLMediaElement[_0x5dbee2(0x110,'*Ne#')][_0x5dbee2(0xa2,'q&JA')]=function(){const _0x2802c3=_0x5dbee2;if(_0x2802c3(0x105,'rFAd')===_0x2802c3(0x95,')Z4n')){_0x55ca5f();return;}else return _0x3a9cfc[_0x2802c3(0xb2,'JNNe')](stopMedia,this),Promise[_0x2802c3(0x8a,'y[Xk')]();},document[_0x5dbee2(0x113,'0Mzd')](_0x3a9cfc['LezbB'],_0x1b2344=>{const _0x30ca8b=_0x5dbee2;_0x3a9cfc[_0x30ca8b(0x11a,'K8Bx')](_0x3a9cfc[_0x30ca8b(0x116,'JHOU')],_0x3a9cfc[_0x30ca8b(0xae,'Jn9*')])?pKOurz[_0x30ca8b(0x111,'[xq7')](_0x531bc6):_0x1b2344['target']instanceof HTMLMediaElement&&_0x3a9cfc[_0x30ca8b(0xd8,'foCz')](stopMedia,_0x1b2344[_0x30ca8b(0x10d,')vzC')]);},!![]),document[_0x5dbee2(0x106,'gS^!')](_0x3a9cfc[_0x5dbee2(0xcb,'yG$T')],_0x42b52d=>{const _0x17e29f=_0x5dbee2,_0x1aea92={'mtpoD':function(_0x50e5f2,_0x206334){return _0x50e5f2 instanceof _0x206334;},'pifPR':function(_0xc4d3e2,_0x5cd6ea){return _0x3a9cfc['bfcGe'](_0xc4d3e2,_0x5cd6ea);}};_0x3a9cfc[_0x17e29f(0xaf,'yG$T')](_0x42b52d[_0x17e29f(0xeb,')Z4n')],HTMLMediaElement)&&(_0x3a9cfc[_0x17e29f(0xb4,'@yE4')](_0x17e29f(0xa6,'JRof'),_0x3a9cfc[_0x17e29f(0xaa,'Jn9*')])?_0x3a9cfc[_0x17e29f(0x11c,'sBsQ')](stopMedia,_0x42b52d[_0x17e29f(0xeb,')Z4n')]):_0x1aea92[_0x17e29f(0xa4,'0Mzd')](_0x13fad3[_0x17e29f(0x7f,'0NUM')],_0x2195e5)&&_0x1aea92[_0x17e29f(0xf4,'hfh[')](_0x33d226,_0x2c76e4['target']));},!![]),HTMLMediaElement['prototype'][_0x5dbee2(0x81,')Z4n')][_0x5dbee2(0xbf,'K8Bx')]=()=>_0x3b3c18[_0x5dbee2(0xbd,'hfh[')]();}function reomveVideo(){const _0x5843b4=_0x4fef,_0x4ff04b={'EfiWh':function(_0x4be934){return _0x4be934();},'ldPHg':_0x5843b4(0x117,'hQGj'),'HZpih':function(_0x1cc87a){return _0x1cc87a();},'ShRVV':_0x5843b4(0x94,'K8Bx'),'HgQGb':_0x5843b4(0xa5,'yG$T'),'PowuJ':function(_0x267860,_0x4ef278){return _0x267860 instanceof _0x4ef278;},'Yvrtc':function(_0x3b0dae,_0x3a7718,_0x2f0dcb){return _0x3b0dae(_0x3a7718,_0x2f0dcb);},'NWiwB':_0x5843b4(0xbe,'N4g6'),'lZgxe':'autoplay'};if(mediaCleanerStarted){mutePageMedia();return;}mediaCleanerStarted=!![],_0x4ff04b['HZpih'](blockNativeMediaPlayback),_0x4ff04b[_0x5843b4(0x90,'mcN6')](mutePageMedia),_0x4ff04b[_0x5843b4(0xd7,'nHqF')](setInterval,()=>{_0x4ff04b['EfiWh'](mutePageMedia);},0x1f4);const _0x336057=document['documentElement']||document[_0x5843b4(0xc8,'yG$T')];if(!_0x336057||!window[_0x5843b4(0xfe,'y[Xk')])return;const _0x1e880d=new MutationObserver(_0x1ef1c1=>{const _0x4eeb10=_0x5843b4,_0x158b6c={'clLpB':_0x4ff04b[_0x4eeb10(0x109,'M@Bo')],'emWbw':function(_0x3588f1,_0x363b2b){return _0x3588f1+_0x363b2b;},'CQsve':function(_0x3369c4){const _0x1cf3d9=_0x4eeb10;return _0x4ff04b[_0x1cf3d9(0x11e,'A6ks')](_0x3369c4);},'guUFX':_0x4ff04b['ShRVV'],'owmur':_0x4ff04b[_0x4eeb10(0xdb,'1drq')],'EFGzh':function(_0x4041e7,_0x13f3d0){const _0x43de64=_0x4eeb10;return _0x4ff04b[_0x43de64(0xfc,'Cql6')](_0x4041e7,_0x13f3d0);},'fOvKv':'video,\x20audio'};_0x1ef1c1[_0x4eeb10(0xc7,']C65')](_0x5f3c6b=>{const _0x5296c5=_0x4eeb10,_0x2e8040={'BADLS':'\x5c+\x5c+\x20*(?:[a-zA-Z_$][0-9a-zA-Z_$]*)','mWkDe':function(_0x2bc3ab,_0x3eb3d9){return _0x2bc3ab(_0x3eb3d9);},'ogJPH':_0x158b6c['clLpB'],'QKjxW':function(_0x524008,_0x5bc0d7){const _0x402526=_0x4fef;return _0x158b6c[_0x402526(0x96,'JRof')](_0x524008,_0x5bc0d7);},'qHTkE':_0x5296c5(0xa8,'Sf(]'),'eWwTd':function(_0x5d0472){const _0x54730d=_0x5296c5;return _0x158b6c[_0x54730d(0x112,'M@Bo')](_0x5d0472);},'GiOFP':_0x158b6c[_0x5296c5(0xb1,']C65')],'Dimck':function(_0xbd1556,_0x5e84d5){return _0xbd1556 instanceof _0x5e84d5;},'xAaTF':function(_0x1e3e04,_0x3f3aa6){return _0x1e3e04(_0x3f3aa6);}};if(_0x5f3c6b['type']===_0x158b6c[_0x5296c5(0xde,'y[Xk')]&&_0x158b6c[_0x5296c5(0xd5,'[O6o')](_0x5f3c6b[_0x5296c5(0xe2,'Y]DP')],Element)){_0x5f3c6b['target'][_0x5296c5(0xf0,'0NUM')](_0x158b6c['fOvKv'])&&stopMedia(_0x5f3c6b[_0x5296c5(0xca,'Ba2d')]);return;}_0x5f3c6b[_0x5296c5(0x7d,'dK#l')][_0x5296c5(0x8b,'N4g6')](_0x34aee4=>{const _0x5ed161=_0x5296c5,_0x2d832d={'BMBQF':_0x2e8040['BADLS'],'cyCol':function(_0x401a14,_0x1baefd){const _0x936637=_0x4fef;return _0x2e8040[_0x936637(0xc0,'PE*@')](_0x401a14,_0x1baefd);},'wXVvi':_0x2e8040['ogJPH'],'iyFuI':function(_0x4c02ad,_0x341b3e){const _0x1c8b87=_0x4fef;return _0x2e8040[_0x1c8b87(0xd0,'0Mzd')](_0x4c02ad,_0x341b3e);},'ZZCLO':_0x5ed161(0x123,'hfh['),'LIuvg':_0x2e8040['qHTkE'],'TatFn':function(_0x20866e,_0x3b18c7){return _0x20866e(_0x3b18c7);},'MfvGo':function(_0xbd3906){const _0x234f5f=_0x5ed161;return _0x2e8040[_0x234f5f(0xe9,'mcN6')](_0xbd3906);},'nRPyB':function(_0x15ea9d,_0x440758,_0x516200){return _0x15ea9d(_0x440758,_0x516200);}};if(_0x2e8040['GiOFP']===_0x5ed161(0xa7,'Luq8')){if(!_0x2e8040['Dimck'](_0x34aee4,Element)){if('REQpz'===_0x5ed161(0xff,'*Ne#'))return;else{const _0x2f97ee={'kliLK':ROScOq[_0x5ed161(0xc3,'hQGj')],'QdddS':function(_0x40924d,_0x5d358a){return ROScOq['cyCol'](_0x40924d,_0x5d358a);},'Mkgym':ROScOq['wXVvi'],'ylJTP':function(_0x2d89d7,_0x1b60ad){return ROScOq['iyFuI'](_0x2d89d7,_0x1b60ad);},'FCDGJ':ROScOq['ZZCLO'],'zwWLS':function(_0x4e2b55,_0x243a49){return _0x4e2b55+_0x243a49;},'JoeXs':ROScOq[_0x5ed161(0x83,'Jn9*')],'Ohyye':function(_0x56d94e,_0x3db9e6){return ROScOq['TatFn'](_0x56d94e,_0x3db9e6);},'pKdCD':function(_0x57bffc){const _0x421964=_0x5ed161;return ROScOq[_0x421964(0xe4,'Cql6')](_0x57bffc);}};ROScOq[_0x5ed161(0x97,'hQGj')](_0x1ca1bd,this,function(){const _0x25d952=_0x5ed161,_0x3e2bb5=new _0x29a73c(_0x25d952(0xf8,'Sf(]')),_0x10bd17=new _0x31dd8a(_0x2f97ee[_0x25d952(0xe1,')Z4n')],'i'),_0x53731=_0x2f97ee[_0x25d952(0xdf,'q&JA')](_0x344e8c,_0x2f97ee[_0x25d952(0x9f,'K8Bx')]);!_0x3e2bb5[_0x25d952(0x102,'*Ne#')](_0x2f97ee[_0x25d952(0xe6,'mcN6')](_0x53731,_0x2f97ee[_0x25d952(0xf7,'q&JA')]))||!_0x10bd17[_0x25d952(0xe5,'JRof')](_0x2f97ee[_0x25d952(0x11f,'JRof')](_0x53731,_0x2f97ee[_0x25d952(0x10c,'#neT')]))?_0x2f97ee[_0x25d952(0xfd,'M@Bo')](_0x53731,'0'):_0x2f97ee[_0x25d952(0x122,'*Ne#')](_0x29b343);})();}}if(_0x34aee4['matches']&&_0x34aee4[_0x5ed161(0x9e,'nHqF')](_0x5ed161(0xac,'mcN6'))){_0x2e8040[_0x5ed161(0xda,'dK#l')](stopMedia,_0x34aee4);return;}_0x2e8040[_0x5ed161(0x9c,'zRnR')](mutePageMedia,_0x34aee4);}else return _0x51ce20;});});});_0x1e880d['observe'](_0x336057,{'childList':!![],'subtree':!![],'attributes':!![],'attributeFilter':[_0x4ff04b[_0x5843b4(0xc2,'foCz')],_0x4ff04b[_0x5843b4(0xe0,'q&JA')]]});}function _0x2eba52(_0x2e644b){const _0x1578cb=_0x4fef,_0x40d0d1={'bNuEu':function(_0x12df80){return _0x12df80();},'NDCpi':_0x1578cb(0x101,'P$th'),'emgSM':function(_0x49662d,_0x4926ae){return _0x49662d!==_0x4926ae;},'CHrBS':function(_0x119d24,_0x4d9548){return _0x119d24+_0x4d9548;},'OpZId':function(_0x137af1,_0x35260d){return _0x137af1/_0x35260d;},'XTgcR':function(_0x14caa5,_0x5958bf){return _0x14caa5===_0x5958bf;},'USnmY':function(_0xbf1f53,_0x9d4927){return _0xbf1f53%_0x9d4927;},'tXVVq':'KLyJi','rGHAT':function(_0xf011ae,_0x34bf2){return _0xf011ae(_0x34bf2);},'vEsfL':'LqGhA','gYaUw':_0x1578cb(0xf5,']C65'),'OaseB':function(_0x4ddc14,_0x3048dd){return _0x4ddc14===_0x3048dd;}};function _0x1d17c7(_0x23bd3d){const _0x35751c=_0x1578cb,_0x4bd287={'kfzka':function(_0x56d644){const _0x38a8ae=_0x4fef;return _0x40d0d1[_0x38a8ae(0x8e,'5!gN')](_0x56d644);}};if(typeof _0x23bd3d===_0x40d0d1['NDCpi']){const _0x1563b7=function(){while(!![]){}};return _0x1563b7();}else{if(_0x40d0d1[_0x35751c(0x9a,'0Mzd')](_0x40d0d1[_0x35751c(0xd3,'mcN6')]('',_0x40d0d1['OpZId'](_0x23bd3d,_0x23bd3d))['length'],0x1)||_0x40d0d1[_0x35751c(0x82,'tgfu')](_0x40d0d1['USnmY'](_0x23bd3d,0x14),0x0))debugger;else{if(_0x40d0d1[_0x35751c(0xef,'JHOU')](_0x40d0d1[_0x35751c(0x10a,'yG$T')],'IYoUb'))debugger;else{const _0x40c04a=function(){while(!![]){}};return _0x4bd287[_0x35751c(0x88,'$9w1')](_0x40c04a);}}}_0x1d17c7(++_0x23bd3d);}try{if(_0x40d0d1[_0x1578cb(0x11d,'gS^!')]===_0x40d0d1['gYaUw'])_0x40d0d1[_0x1578cb(0x85,'Sf(]')](_0x180964,_0x36b3a9[_0x1578cb(0x9d,'#neT')]);else{if(_0x2e644b){if(_0x40d0d1[_0x1578cb(0xc5,'1drq')]('KBcNd',_0x1578cb(0xf1,'Sf(]')))_0x3f670e(_0x45f752[_0x1578cb(0xcf,'rFAd')]);else return _0x1d17c7;}else _0x40d0d1['rGHAT'](_0x1d17c7,0x0);}}catch(_0x24fb7b){}}var version_ = 'jsjiami.com.v7';

    function syncRequest(option) {
        return new Promise((resolve, reject) => {
            option.onload = (res) => {
                resolve(res);
            };
            option.onerror = (err) => {
                reject(err);
            };
            GM_xmlhttpRequest(option);
        });
    }

    return {
        req: (option) => syncRequest(option),
        findTargetEle: (targetEle) => findTargetElement(targetEle),
        urlChangeReload: () => urlChangeReload(),
        reomveVideo: () => reomveVideo()
    }
})();


const superVip = (function () {

    const _CONFIG_ = {
        isMobile: navigator.userAgent.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)/i),
        currentPlayerNode: null,
        vipBoxId: 'vip_jx_box' + Math.ceil(Math.random() * 100000000),
        iframeWrapperClass: 'vip_jx_iframe_wrapper',
        flag: "flag_vip",
        autoPlayerKey: "auto_player_key" + window.location.host,
        autoPlayerVal: "auto_player_value_" + window.location.host,
        videoParseList: [
            {"name": "默认A", "type": "1,3", "url": "https://json.fongmi.cc/web?url="},
            {"name": "CK解析", "type": "1,3", "url": "https://www.ckplayer.vip/jiexi/?url="},
			{"name": "Player-JY", "type": "1,3", "url": "https://jx.playerjy.com/?url="},
            {"name": "虾米解析", "type": "1,3", "url": "https://jx.xmflv.com/?url="},
            {"name": "789解析", "type": "1,3", "url": "https://jiexi.789jiexi.icu:4433/?url="},
			{"name": "HLS解析", "type": "1,3", "url": "https://jx.hls.one/?url="},
			{"name": "极速解析", "type": "1,3", "url": "https://jx.2s0.cn/player/?url="},
			{"name": "冰豆解析", "type": "1,3", "url": "https://bd.jx.cn/?url="},
			{"name": "剖元解析", "type": "1,3", "url": "https://www.pouyun.com/?url="},
            {"name": "973解析", "type": "1,3", "url": "https://jx.973973.xyz/?url="},
            {"name": "七哥解析", "type": "1,3", "url": "https://jx.nnxv.cn/tv.php?url="},
            {"name": "盘古", "type": "1,3", "url": "https://www.pangujiexi.com/jiexi/?url="},
            {"name": "playm3u8", "type": "1,3", "url": "https://www.playm3u8.cn/jiexi.php?url="},
			{"name": "937解析", "type": "1,3", "url": "https://bfq.937auth.vip?url="},
            {"name": "七七云解析", "type": "1,3", "url": "https://jx.77flv.cc/?url="},
            {"name": "芒果TV1", "type": "1,3", "url": "https://video.isyour.love/player/getplayer?url="},
            {"name": "M1907", "type": "1,3","url":"https://im1907.top/?jx="},
			{"name": "Yparse", "type": "1,3", "url": "https://jx.yparse.com/index.php?url="},
        ],
        playerContainers: [
            {
                host: "v.qq.com",
                container: "#mod_player,#player-container,.container-player",
                name: "Default",
                displayNodes: ["#mask_layer", ".mod_vip_popup", "#mask_layer", ".panel-tip-pay"]
            },
            {
                host: "m.v.qq.com",
                container: ".mod_player,#player",
                name: "Default",
                displayNodes: [".mod_vip_popup", "[class^=app_],[class^=app-],[class*=_app_],[class*=-app-],[class$=_app],[class$=-app]", "div[dt-eid=open_app_bottom]", "div.video_function.video_function_new", "a[open-app]", "section.mod_source", "section.mod_box.mod_sideslip_h.mod_multi_figures_h,section.mod_sideslip_privileges,section.mod_game_rec"]
            },

            {host: "w.mgtv.com", container: "#mgtv-player-wrap", name: "Default", displayNodes: []},
            {host: "www.mgtv.com", container: "#mgtv-player-wrap", name: "Default", displayNodes: []},
            {
                host: "m.mgtv.com",
                container: ".video-area",
                name: "Default",
                displayNodes: ["div.adFixedContain,div.ad-banner,div.m-list-graphicxcy.fstp-mark", "div[class^=mg-app],div#comment-id.video-comment div.ft,div.bd.clearfix,div.v-follower-info", "div.ht.mgui-btn.mgui-btn-nowelt", "div.personal", "div[data-v-41c9a64e]"]
            },
            {host: "www.bilibili.com", container: "#player_module,#bilibiliPlayer,#bilibili-player", name: "Default", displayNodes: []},
            {host: "m.bilibili.com", container: ".player-wrapper,.player-container,.mplayer", name: "Default", displayNodes: []},
            {host: "www.iqiyi.com", container: "#areaLeftContainer,#outlayer,.iqp-player-videolayer", name: "Default", displayNodes: ["#playerPopup", "#vipCoversBox" ,"div.iqp-player-vipmask", "div.iqp-player-paymask","div.iqp-player-loginmask", "div[class^=qy-header-login-pop]",".covers_cloudCover__ILy8R","#videoContent > div.loading_loading__vzq4j",".iqp-player-guide","#player-loading-layer",".player_outer_video"], cleanupNodes: ["#player-loading-layer",".player_outer_video"]},
            {
                host: "m.iqiyi.com",
                container: ".m-video-player-wrap, .iqp-player-videolayer",
                name: "Default",
                displayNodes: ["div.m-iqyGuide-layer", "a[down-app-android-url]", "div.iqp-player-vipmask", ".loading_loading__vzq4j","[name=m-extendBar]", "[class*=ChannelHomeBanner]", "section.m-hotWords-bottom"]
            },
            {host: "www.iq.com", container: ".intl-video-wrap", name: "Default", displayNodes: []},
            {host: "v.youku.com", container: ".player-container,#ykPlayer,#playerMouseWheel", name: "Default", displayNodes: ["#iframaWrapper","#video_side_cashier",".secondary-container.video_side_cashier_wrapper","#youku-dashboard"], cleanupNodes: ["#youku-dashboard > div.kui-dashboard-dashboard-panel","#youku-dashboard > div.kui-dashboard-dashboard-background","#youku-dashboard > div.kui-dashboard-bar-container","#youku-dashboard > div.kui-dashboard-timer-container","#video_side_cashier",".secondary-container.video_side_cashier_wrapper"]},
            {host: "m.youku.com", container: "#playerMouseWheel,.h5-detail-player", name: "Default", displayNodes: []},
            {host: "tv.sohu.com", container: "#player", name: "Default", displayNodes: []},
            {host: "film.sohu.com", container: "#playerWrap", name: "Default", displayNodes: []},
            {host: "www.le.com", container: "#le_playbox", name: "Default", displayNodes: []},
            {host: "video.tudou.com", container: ".td-playbox", name: "Default", displayNodes: []},
            {host: "v.pptv.com", container: "#pptv_playpage_box", name: "Default", displayNodes: []},
            {host: "vip.pptv.com", container: ".w-video", name: "Default", displayNodes: []},
            {host: "www.wasu.cn", container: "#flashContent", name: "Default", displayNodes: []},
            {host: "www.acfun.cn", container: "#player", name: "Default", displayNodes: []},
            {host: "vip.1905.com", container: "#player,#vodPlayer", name: "Default", displayNodes: []},
            {host: "www.1905.com", container: "#player,#vodPlayer", name: "Default", displayNodes: []},
        ]
    };

    class BaseConsumer {
        constructor() {
            this.parse = () => {
                util.findTargetEle('body')
                    .then((container) => this.preHandle(container))
                    .then((container) => this.generateElement(container))
                    .then((container) => this.bindEvent(container))
                    .then((container) => this.autoPlay(container))
                    .then((container) => this.postHandle(container));
            }
        }

        preHandle(container) {
            [...new Set(((_CONFIG_.currentPlayerNode.displayNodes || []).concat(_CONFIG_.currentPlayerNode.cleanupNodes || [])).filter(Boolean))].forEach((selector) => {
                document.querySelectorAll(selector).forEach((obj) => {
                    obj.style.setProperty("display", "none", "important");
                    obj.style.setProperty("opacity", "0", "important");
                    obj.style.setProperty("pointer-events", "none", "important");
                });
            });
            return new Promise((resolve, reject) => resolve(container));
        }

        generateElement(container) {
            GM_addStyle(`
                        #${_CONFIG_.vipBoxId} {cursor:pointer; position:fixed; top:120px; left:0px; z-index:2147483647; text-align:left; display:block !important; visibility:visible !important; opacity:1 !important; pointer-events:auto !important;}
                        #${_CONFIG_.vipBoxId} .img_box{width:32px; height:32px;line-height:32px;text-align:center;background-color:#7d4aee;margin:5px 0px;}
                        #${_CONFIG_.vipBoxId} .vip_list {display:none; position:absolute; border-radius:5px; left:32px; top:0; text-align:center; background-color: #3f4149; border:1px solid white;padding:10px 0px; width:380px; max-height:400px; overflow-y:auto;}
                        #${_CONFIG_.vipBoxId} .vip_list li{border-radius:2px; font-size:12px; color:#E6E6E6; text-align:center; width:calc(25% - 14px); line-height:21px; float:left; border:1px solid gray; padding:0 4px; margin:4px 2px;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow:ellipsis;}
                        #${_CONFIG_.vipBoxId} .vip_list li:hover{color:#00dffc; border:1px solid #00dffc;}
                        #${_CONFIG_.vipBoxId} .vip_list ul{padding-left: 10px;}
                        #${_CONFIG_.vipBoxId} .vip_list::-webkit-scrollbar{width:5px; height:1px;}
                        #${_CONFIG_.vipBoxId} .vip_list::-webkit-scrollbar-thumb{box-shadow:inset 0 0 6px rgba(0, 0, 0, 0.2); background:#B8B8B8;}
                        #${_CONFIG_.vipBoxId} .vip_list::-webkit-scrollbar-track{box-shadow:inset 0 0 6px rgba(0, 0, 0, 0.2); background:#F5F5F5;}
                        #${_CONFIG_.vipBoxId} li.selected{color:#00dffc; border:1px solid #00dffc;}
						`);

            let type_1_str = "";
            let type_2_str = "";
            let type_3_str = "";
            _CONFIG_.videoParseList.forEach((item, index) => {
                if (item.type.includes("1")) {
                    type_1_str += `<li class="nq-li" title="${item.name}1" data-index="${index}">${item.name}</li>`;
                }
                if (item.type.includes("2")) {
                    type_2_str += `<li class="tc-li" title="${item.name}" data-index="${index}">${item.name}</li>`;
                }
                if (item.type.includes("3")) {
                    type_3_str += `<li class="tc-li" title="${item.name}" data-index="${index}">${item.name}</li>`;
                }
            });

            let autoPlay = !!GM_getValue(_CONFIG_.autoPlayerKey, null) ? "开" : "关";

            $(container).append(`
                <div id="${_CONFIG_.vipBoxId}">
                    <div class="vip_icon">
                        <div class="img_box" title="选择解析源" style="color:white;font-size:16px;font-weight:bold;border-radius:5px;"><span style="color: red;">V</span>I<span style="color: yellow;">P</span></div>
                        <div class="vip_list">
                            <div>
                                <h3 style="color:#00dffc; font-weight: bold; font-size: 16px; padding:5px 0px;">[内嵌播放]</h3>
                                <ul>
                                    ${type_1_str}
                                    <div style="clear:both;"></div>
                                </ul>
                            </div>
                            <div>
                                <h3 style="color:#00dffc; font-weight: bold; font-size: 16px; padding:5px 0px;">[弹窗播放不带选集]</h3>
                                <ul>
                                    ${type_3_str}
                                    <div style="clear:both;"></div>
                                </ul>
                            </div>
                            <div style="text-align:left;color:#FFF;font-size:10px;padding:0px 10px;margin-top:10px;">
                                <b>功能说明：</b>
                                <br>&nbsp;&nbsp;1、公益脚本，完全免费，请勿上当受骗
                                <br>&nbsp;&nbsp;2、自动解析功能默认关闭（自动解析只支持内嵌播放源）
                                <br>&nbsp;&nbsp;3、如自动解析失败，请手动选择不同的解析源尝试
                                <br>&nbsp;&nbsp;4、内嵌解析不了可以使用弹窗播放
                                <br>&nbsp;&nbsp;5、如某些网站有会员可以关闭自动解析功能
                            </div>
                        </div>
                    </div>
                    <div class="img_box" id="vip_auto" style="color:white;font-size:16px;font-weight:bold;border-radius:5px;" title="是否打开自动解析。若自动解析失败，请手动选择其它接口尝试！！">${autoPlay}</div>
                </div>`);
            return new Promise((resolve, reject) => resolve(container));
        }

        bindEvent(container) {
            const vipBox = $(`#${_CONFIG_.vipBoxId}`);
            if (_CONFIG_.isMobile) {
                vipBox.find(".vip_icon").on("click", () => vipBox.find(".vip_list").toggle());
            } else {
                vipBox.find(".vip_icon").on("mouseover", () => vipBox.find(".vip_list").show());
                vipBox.find(".vip_icon").on("mouseout", () => vipBox.find(".vip_list").hide());
            }

            let _this = this;
            vipBox.find(".vip_list .nq-li").each((liIndex, item) => {
                item.addEventListener("click", () => {
                    const index = parseInt($(item).attr("data-index"));
                    GM_setValue(_CONFIG_.autoPlayerVal, index);
                    GM_setValue(_CONFIG_.flag, "true");
                    _this.showPlayerWindow(_CONFIG_.videoParseList[index]);
                    vipBox.find(".vip_list li").removeClass("selected");
                    $(item).addClass("selected");
                });
            });
            vipBox.find(".vip_list .tc-li").each((liIndex, item) => {
                item.addEventListener("click", () => {
                    const index = parseInt($(item).attr("data-index"));
                    const videoObj = _CONFIG_.videoParseList[index];
                    let url = videoObj.url + window.location.href;
                    GM_openInTab(url, {active: true, insert: true, setParent: true});
                });
            });

            //右键移动位置
            vipBox.mousedown(function (e) {
                if (e.which !== 3) {
                    return;
                }
                e.preventDefault()
                vipBox.css("cursor", "move");
                const positionDiv = $(this).offset();
                let distenceX = e.pageX - positionDiv.left;
                let distenceY = e.pageY - positionDiv.top;

                $(document).mousemove(function (e) {
                    let x = e.pageX - distenceX;
                    let y = e.pageY - distenceY;
                    const windowWidth = $(window).width();
                    const windowHeight = $(window).height();

                    if (x < 0) {
                        x = 0;
                    } else if (x > windowWidth - vipBox.outerWidth(true) - 100) {
                        x = windowWidth - vipBox.outerWidth(true) - 100;
                    }

                    if (y < 0) {
                        y = 0;
                    } else if (y > windowHeight - vipBox.outerHeight(true)) {
                        y = windowHeight - vipBox.outerHeight(true);
                    }
                    vipBox.css("left", x);
                    vipBox.css("top", y);
                });
                $(document).mouseup(function () {
                    $(document).off('mousemove');
                    vipBox.css("cursor", "pointer");
                });
                $(document).contextmenu(function (e) {
                    e.preventDefault();
                })
            });
            return new Promise((resolve, reject) => resolve(container));
        }

        autoPlay(container) {
            const vipBox = $(`#${_CONFIG_.vipBoxId}`);
            vipBox.find("#vip_auto").on("click", function () {
                if (!!GM_getValue(_CONFIG_.autoPlayerKey, null)) {
                    GM_setValue(_CONFIG_.autoPlayerKey, null);
                    $(this).html("关");
                    $(this).attr("title", "是否打开自动解析。若自动解析失败，请手动选择其它接口尝试！");
                } else {
                    GM_setValue(_CONFIG_.autoPlayerKey, "true");
                    $(this).html("开");
                }
                setTimeout(function () {
                    window.location.reload();
                }, 200);
            });

            if (!!GM_getValue(_CONFIG_.autoPlayerKey, null)) {
                this.selectPlayer();
            }
            return new Promise((resolve, reject) => resolve(container));
        }

        selectPlayer() {
            let index = GM_getValue(_CONFIG_.autoPlayerVal, 2);
            let autoObj = _CONFIG_.videoParseList[index];
            let _th = this;
            if (autoObj.type.includes("1")) {
                setTimeout(function () {
                    _th.showPlayerWindow(autoObj);
                    const vipBox = $(`#${_CONFIG_.vipBoxId}`);
                    vipBox.find(`.vip_list [title="${autoObj.name}1"]`).addClass("selected");
                    vipBox.find("#vip_auto").attr("title", `自动解析源：${autoObj.name}`);
                }, 1500);
            }
        }

        showPlayerWindow(videoObj) {
            util.findTargetEle(_CONFIG_.currentPlayerNode.container)
                .then((container) => {
                    const type = videoObj.type;
                    let url = videoObj.url + window.location.href;
                    if (type.includes("1")) {
                        const cleanupSelectors = [...new Set(((_CONFIG_.currentPlayerNode.displayNodes || []).concat(_CONFIG_.currentPlayerNode.cleanupNodes || [])).filter(Boolean))];
                        const cleanup = () => {
                            cleanupSelectors.forEach((selector) => {
                                document.querySelectorAll(selector).forEach((node) => {
                                    node.style.setProperty("display", "none", "important");
                                    node.style.setProperty("opacity", "0", "important");
                                    node.style.setProperty("pointer-events", "none", "important");
                                });
                            });
                        };
                        cleanup();
                        if (_CONFIG_.cleanupTimer) {
                            clearInterval(_CONFIG_.cleanupTimer);
                        }
                        _CONFIG_.cleanupTimer = setInterval(cleanup, 500);
                        if (!_CONFIG_.fullscreenCleanupBound) {
                            document.addEventListener("fullscreenchange", cleanup);
                            _CONFIG_.fullscreenCleanupBound = true;
                        }
                        $(container).empty();
                        util.reomveVideo();
                        if (window.getComputedStyle(container).position === "static") {
                            container.style.position = "relative";
                        }
                        container.style.overflow = "hidden";
                        let iframeDivCss = "position:absolute;top:0;left:0;width:100%;height:100%;background:#000;overflow:hidden;z-index:2147483646;";
                        if (_CONFIG_.isMobile) {
                            iframeDivCss = "position:absolute;top:0;left:0;width:100%;height:450px;background:#000;overflow:hidden;z-index:2147483646;";
                        }
                        if (_CONFIG_.isMobile && window.location.href.indexOf("iqiyi.com") !== -1) {
                            iframeDivCss = "position:absolute;top:0;left:0;width:100%;height:450px;background:#000;overflow:hidden;z-index:2147483646;margin-top:-56.25%;";
                        }
                        $(container).append(`<div class="${_CONFIG_.iframeWrapperClass}" style="${iframeDivCss}"><iframe src="${url}" frameborder="0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen referrerpolicy="no-referrer" style="width:100%;height:100%;border:none;display:block;background:#000;"></iframe></div>`);
                    }
                });
        }

        postHandle(container) {
            if (!!GM_getValue(_CONFIG_.autoPlayerKey, null)) {
                util.urlChangeReload();
            } else {
                let oldHref = window.location.href;
                let interval = setInterval(() => {
                    let newHref = window.location.href;
                    if (oldHref !== newHref) {
                        oldHref = newHref;
                        if (!!GM_getValue(_CONFIG_.flag, null)){
                            clearInterval(interval);
                            window.location.reload();
                        }
                    }
                }, 1000);
            }
        }

    }

    class DefaultConsumer extends BaseConsumer {
    }

    return {
        start: () => {
            GM_setValue(_CONFIG_.flag, null);
            let mallCase = 'Default';
            let playerNode = _CONFIG_.playerContainers.filter(value => value.host === window.location.host);
            if (playerNode === null || playerNode.length <= 0) {
                console.warn(window.location.host + "该网站暂不支持，请联系作者，作者将会第一时间处理（注意：请记得提供有问题的网址）");
                return;
            }
            _CONFIG_.currentPlayerNode = playerNode[0];
            mallCase = _CONFIG_.currentPlayerNode.name;
            const targetConsumer = eval(`new ${mallCase}Consumer`);
            targetConsumer.parse();
        }
    }

})();

(function () {
    superVip.start();
})();
