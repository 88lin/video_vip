// ==UserScript==
// @name              全网VIP视频免费破解去广告【最新3.2】
// @namespace         video_vip
// @version           3.2.1
// @description       全网VIP视频免费破解去广告，适配PC+移动，全网VIP视频解析：爱奇艺、腾讯、优酷、bilibili等视频免费解析！🔥真4K高清🔥【脚本长期维护更新，完全免费，无广告，仅限学习交流！！】
// @license           GPL-3.0 License
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
// @connect           wsyzy.cc
// @connect           api.wsyzy.net
// @grant             unsafeWindow
// @grant             GM_addStyle
// @grant             GM_openInTab
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @charset		      UTF-8
// @license           GPL License
// @compatible        firefox
// @compatible        chrome
// @compatible        opera safari edge
// @compatible        safari
// @compatible        edge
// @downloadURL https://cdn.jsdmirror.com/gh/88lin/video_vip@main/video_vip.user.js
// @updateURL https://cdn.jsdmirror.com/gh/88lin/video_vip@main/video_vip.user.js
// ==/UserScript==

const util = (function () {
    let mediaCleanerStarted = false;
    let mediaPlayBlocked = false;

    function stopMedia(media) {
        if (!media) {
            return;
        }
        try {
            media.pause();
        } catch (e) {
        }
        try {
            media.autoplay = false;
            media.loop = false;
            media.muted = true;
            media.defaultMuted = true;
            media.volume = 0;
            media.playbackRate = 1;
            media.removeAttribute("autoplay");
            media.removeAttribute("src");
            media.srcObject = null;
            media.querySelectorAll("source").forEach((node) => node.remove());
            if (media.currentSrc || media.srcObject || media.querySelector("source")) {
                media.load();
            }
        } catch (e) {
        }
    }

    function mutePageMedia(root = document) {
        if (!root || !root.querySelectorAll) {
            return;
        }
        root.querySelectorAll("video, audio").forEach((media) => stopMedia(media));
    }

    function blockNativeMediaPlayback() {
        if (mediaPlayBlocked || !window.HTMLMediaElement) {
            return;
        }
        mediaPlayBlocked = true;
        const rawPlay = HTMLMediaElement.prototype.play;
        HTMLMediaElement.prototype.play = function () {
            stopMedia(this);
            return Promise.resolve();
        };
        document.addEventListener("play", (event) => {
            if (event.target instanceof HTMLMediaElement) {
                stopMedia(event.target);
            }
        }, true);
        document.addEventListener("playing", (event) => {
            if (event.target instanceof HTMLMediaElement) {
                stopMedia(event.target);
            }
        }, true);
        HTMLMediaElement.prototype.play.toString = () => rawPlay.toString();
    }

    function reomveVideo() {
        if (mediaCleanerStarted) {
            mutePageMedia();
            return;
        }
        mediaCleanerStarted = true;
        blockNativeMediaPlayback();
        mutePageMedia();
        setInterval(() => {
            mutePageMedia();
        }, 500);
        const target = document.documentElement || document.body;
        if (!target || !window.MutationObserver) {
            return;
        }
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "attributes" && mutation.target instanceof Element) {
                    if (mutation.target.matches("video, audio")) {
                        stopMedia(mutation.target);
                        return;
                    }
                }
                mutation.addedNodes.forEach((node) => {
                    if (!(node instanceof Element)) {
                        return;
                    }
                    if (node.matches && node.matches("video, audio")) {
                        stopMedia(node);
                        return;
                    }
                    mutePageMedia(node);
                });
            });
        });
        observer.observe(target, {childList: true, subtree: true, attributes: true, attributeFilter: ["src", "autoplay"]});
    }

    return {
        findTargetEle(selector) {
            return new Promise((resolve, reject) => {
                const el = document.querySelector(selector);
                if (el) {
                    resolve(el);
                    return;
                }
                let tryTime = 0;
                const maxTryTime = 120;
                const timer = setInterval(() => {
                    const el = document.querySelector(selector);
                    if (el) {
                        clearInterval(timer);
                        resolve(el);
                        return;
                    }
                    if ((++tryTime) === maxTryTime) {
                        clearInterval(timer);
                        reject(new Error('findTargetEle timeout: ' + selector));
                    }
                }, 500);
            });
        },
        reomveVideo: () => reomveVideo(),
        urlChangeReload() {
            let oldHref = window.location.href;
            let interval = setInterval(() => {
                let newHref = window.location.href;
                if (oldHref !== newHref) {
                    oldHref = newHref;
                    clearInterval(interval);
                    window.location.reload();
                }
            }, 1000);
        }
    };
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
        directMode: false,
        manualPicked: false,
        cleanupTimer: null,
        wsyzyFsbBound: false,
        fullscreenCleanupBound: false,
        videoParseList: [
            {"name": "默认解析", "type": "1", "wsyzy": true},
            {"name": "TXNQ解析", "type": "1,3", "url": "https://bfq.txnp.cn/player?url="},
            {"name": "虾米解析", "type": "1,3", "url": "https://jx.xmflv.com/?url="},
            {"name": "剖元解析", "type": "1,3", "url": "https://www.pouyun.com/?url="},
            {"name": "playm3u8", "type": "1,3", "url": "https://www.playm3u8.cn/jiexi.php?url="},
            {"name": "789解析", "type": "1,3", "url": "https://jiexi.789jiexi.icu:4433/?url="},
            {"name": "七哥解析", "type": "1,3", "url": "https://jx.202617.xyz/tv.php?url="},
            {"name": "fongmi解析", "type": "1,3", "url": "https://json.fongmi.cc/web?url="},
            {"name": "冰豆解析", "type": "1,3", "url": "https://bd.jx.cn/?url="},
            {"name": "七七云解析", "type": "1,3", "url": "https://jx.77flv.cc/?url="},
            {"name": "CK解析", "type": "1,3", "url": "https://www.ckplayer.vip/jiexi/?url="},
			{"name": "HLS解析", "type": "1,3", "url": "https://jx.hls.one/?url="},
			{"name": "极速解析", "type": "1,3", "url": "https://jx.2s0.cn/player/?url="},
            {"name": "花旗解析", "type": "1,3", "url": "https://www.huaqi.live/?url="},
            {"name": "Player-JY", "type": "1,3", "url": "https://jx.playerjy.com/?url="},
            {"name": "邦宁云解析", "type": "1,3", "url": "https://video.isyour.love/player/getplayer?url="},
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

    function buildPlayerFrameLayout({isMobile, containerRect = {}, containerStyle = {}, viewportHeight = 0}) {
        const parsePixelValue = (value) => {
            const parsedValue = Number.parseFloat(value);
            return Number.isFinite(parsedValue) ? parsedValue : 0;
        };

        if (!isMobile) {
            return {
                containerStyles: {
                    overflow: "hidden"
                },
                wrapperStyles: {
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    background: "#000",
                    overflow: "hidden",
                    zIndex: "2147483646"
                },
                iframeStyles: {
                    width: "100%",
                    height: "100%",
                    border: "none",
                    display: "block",
                    background: "#000"
                }
            };
        }

        const width = parsePixelValue(containerRect.width);
        const height = parsePixelValue(containerRect.height);
        const paddingTop = parsePixelValue(containerStyle.paddingTop);
        const ratioHeight = width > 0 ? Math.round((width * 9) / 16) : 0;
        const fallbackViewportHeight = viewportHeight > 0 ? Math.round(viewportHeight * 0.32) : 180;
        const rawHeight = height || paddingTop || ratioHeight || fallbackViewportHeight;
        const maxHeight = viewportHeight > 0 ? Math.max(220, Math.round(viewportHeight * 0.7)) : rawHeight;
        const resolvedHeight = Math.max(180, Math.min(rawHeight, maxHeight));
        const usesPaddingAspect = width > 0 && paddingTop > 0 && (paddingTop / width) > 0.25;

        return {
            containerStyles: {
                overflow: "hidden",
                height: "auto",
                minHeight: `${resolvedHeight}px`,
                ...(usesPaddingAspect ? {paddingTop: "0"} : {})
            },
            wrapperStyles: {
                position: "relative",
                display: "block",
                width: "100%",
                minHeight: `${resolvedHeight}px`,
                aspectRatio: "16 / 9",
                background: "#000",
                overflow: "hidden",
                zIndex: "2147483646"
            },
            iframeStyles: {
                position: "absolute",
                inset: "0",
                width: "100%",
                height: "100%",
                border: "none",
                display: "block",
                background: "#000"
            }
        };
    }

    function applyInlineStyles(element, styles) {
        Object.entries(styles || {}).forEach(([propertyName, propertyValue]) => {
            if (propertyValue === undefined || propertyValue === null || propertyValue === "") {
                return;
            }
            element.style[propertyName] = propertyValue;
        });
    }

    const _SITE_NAMES = '爱奇艺|腾讯视频|腾讯|优酷|芒果TV|芒果|哔哩哔哩|bilibili|B站|搜狐视频|搜狐|乐视视频|乐视|PPTV聚力|PPTV|1905电影网|1905|土豆网|土豆|风行网|风行|西瓜视频|咪咕视频|咪咕|AcFun';
    const _SITE_NAME_RE = new RegExp('(?:^|[\\s\\-_：:|｜，,。·]+)(?:' + _SITE_NAMES + ')(?=$|[\\s\\-_：:|｜，,。·]+)', 'gi');
    const _SITE_LEAD_RE = new RegExp('^(?:' + _SITE_NAMES + ')+', 'i');
    const _SITE_TAIL_RE = new RegExp('(?:[\\s\\-_：:|｜]+|^)(?:' + _SITE_NAMES + ')$', 'i');
    const _SITE_WORD_RE = new RegExp('^(?:' + _SITE_NAMES + ')$', 'i');

    function wsyzyCleanTitle(t) {
        t = (t || '').replace(/[《》【】「」]/g, '')
            .replace(_SITE_NAME_RE, ' ')
            .replace(_SITE_LEAD_RE, '')
            .replace(_SITE_TAIL_RE, '')
            .replace(/在线观看|高清正版|免费观看|完整版|正片|预告|全集/g, '');
        const parts = t.split(/[-_\s（(|｜]/)
            .map(s => s.replace(/第.+[集季部]/, '').trim())
            .filter(Boolean);
        return parts.find(p => p.length >= 2 && !_SITE_WORD_RE.test(p) && !/第\d{1,8}[集期话季]/.test(p)) || parts[0] || '';
    }

    function readVideoTitle() {
        const PRECISE = {
            'qq.com': '.intro-title[title], .video-title[title], .player-title',
            'iqiyi.com': '[data-ai-entity="视频名称、主标题"], [data-ai-entity*="主标题"], .album-head-title, [class*="meta_title"]',
            'iq.com': '[data-ai-entity="视频名称、主标题"], [data-ai-entity*="主标题"]',
            'youku.com': '.video-title, a[data-pb-txid="pg_playlist_title"][title]',
            'mgtv.com': 'h2[class*="mgtv-player-aside-info__title"][title]',
            'bilibili.com': '[class*="mediaTitle"][title]',
            'sohu.com': 'a[data-pb-txid="pg_playlist_title"][title]'
        };
        const hn = location.hostname;
        for (const key of Object.keys(PRECISE)) {
            if (!hn.includes(key)) continue;
            for (const sel of PRECISE[key].split(',')) {
                const el = document.querySelector(sel.trim());
                if (!el) continue;
                const t = (el.getAttribute('title') || el.getAttribute('content') || el.textContent || '').trim();
                // 精确选择器只在影片信息面板渲染完成后存在，命中即视为可信
                if (t && wsyzyCleanTitle(t)) return {title: wsyzyCleanTitle(t), trusted: true};
            }
        }
        const og = document.querySelector('meta[property="og:title"]');
        if (og) {
            const t = (og.getAttribute('content') || og.textContent || '').trim();
            // og:title 是服务端静态输出，不随 SPA 异步加载变化，同样可信
            if (t && wsyzyCleanTitle(t)) return {title: wsyzyCleanTitle(t), trusted: true};
        }
        const h1 = document.querySelector('h1');
        if (h1) {
            const t = (h1.textContent || '').trim();
            if (t && wsyzyCleanTitle(t)) return {title: wsyzyCleanTitle(t), trusted: false};
        }
        return {title: wsyzyCleanTitle(document.title), trusted: false};
    }

    /* ==========================================================
     * 无损云直连模块：suggest搜索 -> API取m3u8 -> 内嵌无损云官方播放器
     * ========================================================== */
    const wsyzyDirect = (function () {
        const SITE = 'https://wsyzy.cc';
        const API = 'https://api.wsyzy.net/api.php/provide/vod/';
        const PLAYER = 'https://wsyzy.vip/m3u8/?url=';

        function req(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url,
                    timeout: 8000,
                    onload: res => {
                        if (res.status === 200 && res.responseText) resolve(res.responseText);
                        else reject(new Error('resp_err'));
                    },
                    onerror: () => reject(new Error('net_err')),
                    ontimeout: () => reject(new Error('timeout'))
                });
            });
        }

        async function searchList(title) {
            const t = await req(`${SITE}/index.php/ajax/suggest?mid=1&wd=${encodeURIComponent(title)}`);
            const j = JSON.parse(t);
            return (j.list || []).filter(x => x.id && x.name);
        }

        // 获取候选列表（官网联想偶发抖动，空结果自动重试一次）
        async function searchCandidates(title) {
            let list = [];
            try { list = await searchList(title); } catch (e) {}
            if (!list.length) {
                await new Promise(r => setTimeout(r, 600));
                if (_aborted) return [];
                try { list = await searchList(title); } catch (e) {}
            }
            return list;
        }

        // 候选排序：精确 > 前缀 > 包含 > 反向包含 > 其他（单字片名不做反向包含，避免播错片）
        function rankCandidates(list, title) {
            const score = (x) => {
                if (x.name === title) return 4;
                if (x.name.startsWith(title)) return 3;
                if (x.name.includes(title)) return 2;
                if (title.length >= 2 && title.includes(x.name)) return 1;
                return 0;
            };
            const sorted = list.slice().sort((a, b) => score(b) - score(a));
            sorted.forEach(x => { x._score = score(x); });
            return sorted;
        }

        // 首搜失败后：用剥离平台名等杂质的关键词自动重搜；返回排序后的候选列表
        async function searchWithRetry(title) {
            let list = await searchCandidates(title);
            let usedTitle = title;
            if (!list.length && !_aborted) {
                const alt = wsyzyCleanTitle(title);
                if (alt && alt !== title && alt.length >= 2) {
                    toast(`改用「${alt}」重新搜索...`, false);
                    usedTitle = alt;
                    list = await searchCandidates(alt);
                }
            }
            return rankCandidates(list, usedTitle);
        }

        // 等待页面标题就绪：SPA官网需等网络加载完成后
        // 才会把真实剧名写入 document.title，过早提取会拿到"爱奇艺xxx"这类占位标题。
        // 分级判定：
        // 1、精确选择器/og:title 命中（readVideoTitle 标记 trusted）说明页面数据已就绪
        //    → 立即返回，不等待（大部分站点走此路径）；
        // 2、h1/document.title 兜底：连续1.5秒未变化且清洗通过 → 返回；
        // 3、连续5秒未变化但仍清洗不掉 → 不再等待（标题不会因等待变干净，
        //    多为官网名与片名粘连等特殊格式），交由下游清洗+重搜兜底；
        // 4、maxWait 内仍未定论则直接采用当前标题。
        function isCleanTitle(t) {
            if (!t || t.length < 2) return false;
            const reSite = new RegExp('(?:^|[\\s\\-_：:|｜，,。·])(?:' + _SITE_NAMES + ')(?:$|[\\s\\-_：:|｜，,。·])', 'i');
            const reLead = new RegExp('^(?:' + _SITE_NAMES + ')', 'i');
            if (reSite.test(t) || reLead.test(t)) return false;
            if (/在线观看|高清正版|免费观看|完整版|正片|预告/.test(t)) return false;
            return true;
        }

        async function waitStableTitle(onTick, maxWait = 10000, interval = 500) {
            const start = Date.now();
            let cur = readVideoTitle();
            if (cur.trusted && cur.title) return cur.title; // 快路径：标题已就绪，无需等待
            let last = cur.title;
            let stableSince = Date.now();
            while (Date.now() - start < maxWait) {
                await new Promise(r => setTimeout(r, interval));
                if (_aborted) return last; // 用户已切换解析源，立即交回控制权，避免长时间占用 _running
                cur = readVideoTitle();
                const elapsed = Math.round((Date.now() - start) / 1000);
                if (cur.trusted && cur.title) {
                    onTick && onTick(elapsed, cur.title);
                    return cur.title;
                }
                if (cur.title !== last) {
                    last = cur.title;
                    stableSince = Date.now();
                } else {
                    const stableFor = Date.now() - stableSince;
                    if ((stableFor >= 1500 && isCleanTitle(last)) || (stableFor >= 5000 && last)) {
                        onTick && onTick(elapsed, last);
                        return last;
                    }
                }
                onTick && onTick(elapsed, last);
            }
            return last;
        }

        function parseEps(pu) {
            if (!pu) return [];
            return pu.split('$$$')[0].split('#')
                .map(s => {
                    const i = s.indexOf('$');
                    return i > 0 ? { name: s.slice(0, i), url: s.slice(i + 1) } : { name: '', url: s };
                })
                .filter(e => /^https?:\/\//.test(e.url));
        }

        async function getEpisodes(id) {
            const t = await req(`${API}?ac=detail&ids=${id}`);
            const j = JSON.parse(t);
            const v = j.list && j.list[0];
            return parseEps(v && v.vod_play_url);
        }

        function curEpNum() {
            const text = document.title + ' ' + location.href;
            let m;
            // "第X集/期/话" 或无"第"前缀的"X集"（标题中常见）
            m = text.match(/第?\s*(\d{1,8})\s*[集期话]/);
            if (m) return parseInt(m[1], 10);
            // URL 查询参数：?ep=X / ?episode=X / ?p=X / ?e=X / ?cur=X（爱奇艺）
            m = location.href.match(/[?&](?:ep|episode|p|e|cur)=(\d{1,5})(?!\d)/i);
            if (m) return parseInt(m[1], 10);
            // 腾讯：/pN.html（如 /p9.html → 第9集）
            m = location.href.match(/\/p(\d{1,5})\.html/i);
            if (m) return parseInt(m[1], 10);
            // B站/Mango：/epN（如 /bangumi/play/ep33 → 第33集）
            m = location.href.match(/\/ep(\d{1,5})(?!\d)/i);
            if (m) return parseInt(m[1], 10);
            return 0;
        }

        // 广告声抑制器（直连模式期间启用，作为 reomveVideo 的第二道防线）：
        // 静音页面残留媒体元素（不 pause、不删 src，避免触发官网播放器的异常处理）。
        // 覆盖主文档 + 同源 iframe；离开直连模式(切换其他解析源)时自动停止并还原行为。
        let _stopSuppressor = null;
        function startAdSoundSuppressor() {
            if (_stopSuppressor) return;
            const inOurs = (el) => el.closest && el.closest('.' + _CONFIG_.iframeWrapperClass);
            const silence = (m) => { try { if (!m.muted) m.muted = true; if (m.volume !== 0) m.volume = 0; } catch (e) {} };
            const handler = (ev) => {
                const m = ev.target;
                if (!m || !m.tagName || !/^(video|audio)$/i.test(m.tagName)) return;
                if (inOurs(m)) return;
                silence(m);
            };
            document.addEventListener('play', handler, true);
            document.addEventListener('playing', handler, true);
            document.addEventListener('volumechange', handler, true);
            const timer = setInterval(() => {
                // 直连播放器已不在页面中（用户切走了）→ 自行退出
                const wrap = document.querySelector('.' + _CONFIG_.iframeWrapperClass);
                if (!wrap || !document.contains(wrap)) { stopAdSoundSuppressor(); return; }
                const scan = (doc) => doc.querySelectorAll('video,audio').forEach((m) => { if (!inOurs(m)) silence(m); });
                scan(document);
                document.querySelectorAll('iframe').forEach((f) => {
                    if (inOurs(f)) return;
                    let doc = null;
                    try { doc = f.contentDocument; } catch (e) { return; }
                    if (doc) { try { scan(doc); } catch (e) {} }
                });
            }, 400);
            _stopSuppressor = () => {
                clearInterval(timer);
                document.removeEventListener('play', handler, true);
                document.removeEventListener('playing', handler, true);
                document.removeEventListener('volumechange', handler, true);
                _stopSuppressor = null;
            };
        }
        function stopAdSoundSuppressor() { if (_stopSuppressor) _stopSuppressor(); }

        function takeover() {
            return new Promise((resolve, reject) => {
                util.findTargetEle(_CONFIG_.currentPlayerNode.container).then((container) => {
                    if (_aborted) { reject(new Error('已取消')); return; }
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
                    if (_CONFIG_.cleanupTimer) clearInterval(_CONFIG_.cleanupTimer);
                    _CONFIG_.cleanupTimer = setInterval(cleanup, 500);
                    if (!_CONFIG_.wsyzyFsbBound) {
                        document.addEventListener("fullscreenchange", cleanup);
                        _CONFIG_.wsyzyFsbBound = true;
                    }

                    const frameLayout = buildPlayerFrameLayout({
                        isMobile: !!_CONFIG_.isMobile,
                        containerRect: container.getBoundingClientRect(),
                        containerStyle: { paddingTop: window.getComputedStyle(container).paddingTop },
                        viewportHeight: window.innerHeight || document.documentElement.clientHeight || 0
                    });
                    $(container).empty();
                    util.reomveVideo();
                    if (window.getComputedStyle(container).position === "static") container.style.position = "relative";
                    applyInlineStyles(container, frameLayout.containerStyles);

                    const wrapper = document.createElement("div");
                    wrapper.className = _CONFIG_.iframeWrapperClass;
                    applyInlineStyles(wrapper, frameLayout.wrapperStyles);

                    const epBar = document.createElement("div");
                    applyInlineStyles(epBar, {
                        position: "absolute", top: "0", right: "0", bottom: "0", width: "170px",
                        overflowX: "hidden", overflowY: "auto",
                        zIndex: "2147483647", display: "none",
                        background: "rgba(7,24,39,.94)", padding: "8px 6px", boxSizing: "border-box",
                        borderRadius: "10px 0 0 10px", border: "1px solid rgba(14,165,233,.25)",
                        borderRight: "none", boxShadow: "-6px 0 16px rgba(0,0,0,.45)"
                    });

                    const iframe = document.createElement("iframe");
                    iframe.frameBorder = "0";
                    iframe.allow = "autoplay; encrypted-media; fullscreen";
                    iframe.allowFullscreen = true;
                    iframe.referrerPolicy = "no-referrer";
                    applyInlineStyles(iframe, frameLayout.iframeStyles);

                    // 占位层：接管瞬间盖住容器（掐断官方播放器广告声），搜索完成后再隐藏
                    const placeholder = document.createElement("div");
                    applyInlineStyles(placeholder, {
                        position: "absolute", inset: "0", zIndex: "2147483646",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "#000", color: "#7dd3fc", fontSize: "15px",
                        textAlign: "center", padding: "0 16px", lineHeight: "1.8",
                        flexDirection: "column", gap: "6px"
                    });
                    placeholder.textContent = "无损云加载中...";

                    const askChoice = (candidates, detailMap) => new Promise((resolveChoice, rejectChoice) => {
                        let settled = false;
                        let watch = null;
                        const finish = (fn, val) => {
                            if (settled) return;
                            settled = true;
                            if (watch) clearInterval(watch);
                            // 恢复 placeholder 原始定位并移回 wrapper
                            placeholder.style.position = 'absolute';
                            placeholder.style.inset = '0';
                            placeholder.style.left = '';
                            placeholder.style.top = '';
                            placeholder.style.width = '';
                            placeholder.style.height = '';
                            if (placeholder.parentNode && placeholder.parentNode !== wrapper) {
                                wrapper.appendChild(placeholder);
                            }
                            fn(val);
                        };
                        placeholder.innerHTML = '';
                        const head = document.createElement('div');
                        head.textContent = '搜到多个相关结果，请选择要播放的：';
                        applyInlineStyles(head, {
                            fontSize: _CONFIG_.isMobile ? '13px' : '14px',
                            fontWeight: '600', color: '#7dd3fc',
                            padding: '0 10px', lineHeight: '1.6', flexShrink: '0'
                        });
                        const box = document.createElement('div');
                        box.classList.add('wsyzy-no-scrollbar');
                        applyInlineStyles(box, {
                            width: 'min(440px, 94%)', maxHeight: '74%',
                            overflowY: 'auto', scrollbarWidth: 'none',
                            display: 'flex', flexDirection: 'column',
                            gap: '8px', padding: '2px 4px', boxSizing: 'border-box'
                        });
                        if (!document.getElementById('wsyzy-no-scroll-style')) {
                            const s = document.createElement('style');
                            s.id = 'wsyzy-no-scroll-style';
                            s.textContent = '.wsyzy-no-scrollbar::-webkit-scrollbar{display:none}';
                            document.head.appendChild(s);
                        }
                        // 面板排序：年份优先（最新在前），同年份内名称匹配度优先
                        const sorted = candidates.slice().sort((a, b) => {
                            const ya = detailMap && detailMap[a.id] ? parseInt(detailMap[a.id].vod_year) || 0 : 0;
                            const yb = detailMap && detailMap[b.id] ? parseInt(detailMap[b.id].vod_year) || 0 : 0;
                            if (ya !== yb) return yb - ya;
                            const sa = a._score || 0, sb = b._score || 0;
                            return sb - sa;
                        });
                        sorted.forEach((c, i) => {
                            const d = detailMap && detailMap[c.id];
                            // 详情信息行：类别 · 年份 · 集数状态 · 更新时间（缺失的字段自动跳过）
                            const meta = [];
                            if (d) {
                                if (d.type_name) meta.push(d.type_name);
                                if (d.vod_year) meta.push(d.vod_year);
                                if (d.vod_remarks) meta.push(d.vod_remarks);
                                if (d.vod_time) meta.push('更新 ' + String(d.vod_time).split(' ')[0]);
                            }

                            const btn = document.createElement('button');
                            btn.type = 'button';
                            applyInlineStyles(btn, {
                                display: 'block', width: '100%', margin: '0',
                                padding: _CONFIG_.isMobile ? '9px 24px' : '8px 24px',
                                borderRadius: '999px', cursor: 'pointer', textAlign: 'center',
                                border: '1px solid ' + (i === 0 ? 'rgba(196,181,253,.8)' : 'rgba(255,255,255,.16)'),
                                background: i === 0 ? 'rgba(139,92,246,.20)' : 'rgba(255,255,255,.07)',
                                boxShadow: i === 0 ? '0 2px 12px rgba(139,92,246,.32)' : 'none',
                                transition: 'all .15s ease', flexShrink: '0'
                            });
                            const nameEl = document.createElement('div');
                            nameEl.textContent = c.name; // 外部数据只走 textContent，防注入
                            applyInlineStyles(nameEl, {
                                fontSize: _CONFIG_.isMobile ? '14px' : '13px', fontWeight: '700',
                                lineHeight: '1.5', color: '#f8fafc',
                                overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'
                            });
                            const metaEl = document.createElement('div');
                            metaEl.textContent = (i === 0 ? '⭐推荐 · ' : '') + (meta.join(' · ') || '暂无详情');
                            applyInlineStyles(metaEl, {
                                fontSize: _CONFIG_.isMobile ? '11px' : '10px', lineHeight: '1.5', marginTop: '2px',
                                color: i === 0 ? 'rgba(221,214,254,.92)' : 'rgba(203,213,225,.7)'
                            });
                            btn.appendChild(nameEl);
                            btn.appendChild(metaEl);
                            btn.addEventListener('mouseenter', () => {
                                if (i === 0) {
                                    btn.style.background = 'rgba(139,92,246,.32)';
                                } else {
                                    btn.style.background = 'rgba(56,189,248,.15)';
                                    btn.style.borderColor = 'rgba(56,189,248,.6)';
                                }
                            });
                            btn.addEventListener('mouseleave', () => {
                                if (i === 0) {
                                    btn.style.background = 'rgba(139,92,246,.20)';
                                } else {
                                    btn.style.background = 'rgba(255,255,255,.07)';
                                    btn.style.borderColor = 'rgba(255,255,255,.16)';
                                }
                            });
                            btn.addEventListener('click', (ev) => {
                                ev.stopPropagation();
                                finish(resolveChoice, c);
                            });
                            box.appendChild(btn);
                        });
                        placeholder.appendChild(head);
                        placeholder.appendChild(box);
                        // 移到 body 上，防止页面 JS 重渲染容器时把 placeholder 一起清掉
                        if (placeholder.parentNode !== document.body) document.body.appendChild(placeholder);
                        // 按 iframe 实际位置定位；iframe 已被页面清掉时回退到视口尺寸
                        const ir = iframe.getBoundingClientRect();
                        const pw = ir.width > 0 ? ir.width : window.innerWidth;
                        const ph = ir.height > 0 ? ir.height : window.innerHeight;
                        const pl = ir.width > 0 ? ir.left : 0;
                        const pt = ir.height > 0 ? ir.top : 0;
                        placeholder.style.position = 'fixed';
                        placeholder.style.inset = 'auto';
                        placeholder.style.left = pl + 'px';
                        placeholder.style.top = pt + 'px';
                        placeholder.style.width = pw + 'px';
                        placeholder.style.height = ph + 'px';
                        placeholder.style.display = 'flex';
                        // 等待选择期间用户切走了（_aborted）→ 结束等待，由主流程静默退出
                        watch = setInterval(() => {
                            if (_aborted) finish(rejectChoice, new Error('已取消'));
                        }, 300);
                    });

                    wrapper.appendChild(iframe);
                    wrapper.appendChild(epBar);
                    wrapper.appendChild(placeholder);
                    container.appendChild(wrapper);

                    resolve({
                        iframe, epBar, wrapper, container,
                        setStatus: (t) => { placeholder.textContent = t; placeholder.style.display = "flex"; },
                        hidePlaceholder: () => { placeholder.style.display = "none"; },
                        askChoice
                    });
                }).catch(reject);
            });
        }

        function mountEpBar(epBar, wrapper, load, eps, curIdx) {
            epBar.innerHTML = '';
            let current = curIdx;
            eps.forEach((ep, idx) => {
                const btn = document.createElement('span');
                btn.textContent = ep.name || ('第' + (idx + 1) + '集');
                applyInlineStyles(btn, {
                    display: 'block', margin: '4px 0', padding: '5px 10px',
                    fontSize: '12px', lineHeight: '20px', borderRadius: '6px', cursor: 'pointer',
                    userSelect: 'none', transition: 'all .15s ease', textAlign: 'center',
                    overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                    color: idx === current ? '#ffffff' : '#bae6fd',
                    background: idx === current ? '#0369a1' : '#0b2942',
                    border: '1px solid ' + (idx === current ? '#38bdf8' : '#155e75'),
                    boxShadow: idx === current ? '0 2px 6px rgba(14,165,233,.35)' : 'none'
                });
                btn.addEventListener('mouseenter', () => {
                    if (idx !== current) { btn.style.background = '#0e7490'; btn.style.borderColor = '#38bdf8'; }
                });
                btn.addEventListener('mouseleave', () => {
                    if (idx !== current) { btn.style.background = '#0b2942'; btn.style.borderColor = '#155e75'; }
                });
                btn.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    load(ep);
                    [...epBar.children].forEach(c => {
                        c.style.background = '#0b2942'; c.style.color = '#bae6fd';
                        c.style.borderColor = '#155e75'; c.style.boxShadow = 'none';
                    });
                    btn.style.background = '#0369a1'; btn.style.color = '#ffffff';
                    btn.style.borderColor = '#38bdf8'; btn.style.boxShadow = '0 2px 6px rgba(14,165,233,.35)';
                    current = idx;
                });
                epBar.appendChild(btn);
            });
            const trigger = document.createElement('div');
            applyInlineStyles(trigger, {
                position: 'absolute', top: '0', right: '0', bottom: '0',
                width: '10px', zIndex: '2147483645', background: 'transparent'
            });
            wrapper.appendChild(trigger);
            trigger.addEventListener('mouseenter', () => { epBar.style.display = 'block'; });
            trigger.addEventListener('mouseleave', (ev) => {
                if (epBar.contains(ev.relatedTarget)) return;
                epBar.style.display = 'none';
            });
            epBar.addEventListener('mouseleave', (ev) => {
                if (trigger.contains(ev.relatedTarget)) return;
                epBar.style.display = 'none';
            });
            if (_CONFIG_.isMobile) {
                const tab = document.createElement('div');
                tab.textContent = '☰ 选集';
                applyInlineStyles(tab, {
                    position: 'absolute', top: '10px', right: '10px', zIndex: '2147483647',
                    padding: '6px 12px', fontSize: '13px', lineHeight: '18px',
                    background: 'rgba(7,24,39,.88)', color: '#7dd3fc',
                    border: '1px solid #0ea5e9', borderRadius: '8px', cursor: 'pointer',
                    userSelect: 'none', boxShadow: '0 3px 10px rgba(0,0,0,.35)',
                    transition: 'all .15s ease'
                });
                tab.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    epBar.style.display = epBar.style.display === 'block' ? 'none' : 'block';
                });
                wrapper.appendChild(tab);
            }
        }

        function toast(msg, autoHide) {
            let el = document.getElementById('wsyzy_toast');
            if (!el) {
                el = document.createElement('div');
                el.id = 'wsyzy_toast';
                applyInlineStyles(el, {
                    position: 'fixed', top: '8%', transform: 'translate(-50%, -50%)',
                    zIndex: '2147483647', background: 'rgba(7,24,39,.95)', color: '#bae6fd',
                    border: '1px solid #0ea5e9', borderRadius: '10px', padding: '12px 24px',
                    fontSize: '14px', textAlign: 'center', maxWidth: '80vw',
                    boxShadow: '0 8px 28px rgba(0,0,0,.5)', lineHeight: '1.6'
                });
                document.body.appendChild(el);
            }
            el.textContent = msg;
            el.style.display = 'block';
            const viewportW = window.innerWidth || document.documentElement.clientWidth;
            let centerX = viewportW / 2;
            const wrap = document.querySelector('.' + _CONFIG_.iframeWrapperClass);
            if (wrap) {
                const r = wrap.getBoundingClientRect();
                if (r.width > 0) centerX = r.left + r.width / 2;
            }
            const half = el.offsetWidth / 2;
            centerX = Math.max(half + 8, Math.min(centerX, viewportW - half - 8));
            el.style.left = centerX + 'px';
            clearTimeout(el._timer);
            if (autoHide !== false) el._timer = setTimeout(() => { el.style.display = 'none'; }, 2500);
        }

        let _running = false;
        let _aborted = false;
        let _takeoverTimeout = false;

        function abort() {
            _aborted = true;
            stopAdSoundSuppressor();
            if (_CONFIG_.cleanupTimer) { clearInterval(_CONFIG_.cleanupTimer); _CONFIG_.cleanupTimer = null; }
        }

        async function play() {
            if (_running) {
                toast('正在加载中，请稍候...');
                return;
            }
            _running = true;
            _aborted = false;
            _takeoverTimeout = false;
            let ui = null;
            try {
                // 第一步：启动广告声抑制（只静音，不 pause/不删 src，不干扰页面 JS）
                startAdSoundSuppressor();
                const takeoverP = takeover();
                takeoverP.catch(() => {}); // 竞速失败后延迟到达的 reject 不视为未处理异常
                let raceTimer = null;
                try {
                    ui = await Promise.race([
                        takeoverP,
                        new Promise((_, rej) => {
                            // 竞速结束后必须清除未触发的定时器，否则其延迟置位 _aborted 会误杀已正常播放的流程
                            raceTimer = setTimeout(() => { _takeoverTimeout = true; _aborted = true; rej(new Error('未找到官方播放器位置')); }, 10000);
                        })
                    ]);
                } finally {
                    clearTimeout(raceTimer);
                }
                if (_aborted) throw new Error('已取消');

                // 第二步：等待官方页面把真实剧名写入标题（SPA站点需数秒~数十秒）
                const title = await waitStableTitle((sec, cur) => {
                    ui.setStatus(cur ? `「${cur}」等待片名稳定 ${sec}s...` : `等待片名稳定 ${sec}s...`);
                });
                if (_aborted) throw new Error('已取消');
                if (!title || title.length < 2) throw new Error('无法识别片名');
                ui.setStatus(`「${title}」无损云搜索中...`);
                toast(`「${title}」无损云搜索中...`, false);

                const candidates = await searchWithRetry(title);
                if (_aborted) throw new Error('已取消');
                if (!candidates.length) throw new Error(`无损云未收录「${title}」，请切换其他解析源`);

                let hit;
                if (candidates.length === 1) {
                    hit = candidates[0];
                } else {
                    // 详情一次拉全：集数判定与选择面板共用；失败不阻塞，降级为仅名称选择
                    ui.setStatus(`搜到 ${candidates.length} 个结果，正在加载详情...`);
                    const detailMap = {};
                    try {
                        const dt = await req(`${API}?ac=detail&ids=${candidates.map(c => c.id).join(',')}`);
                        const dj = JSON.parse(dt);
                        (dj.list || []).forEach(d => { detailMap[d.vod_id] = d; });
                    } catch (e) {}
                    if (_aborted) throw new Error('已取消');

                    const epNum = curEpNum();
                    if (epNum > 0) {
                        // 硬判定：当前集数只有唯一一个候选的集数足够 → 必然是它
                        const viable = candidates.filter(c => {
                            const d = detailMap[c.id];
                            return d && parseEps(d.vod_play_url).length >= epNum;
                        });
                        if (viable.length === 1) hit = viable[0];
                    }
                    if (!hit && candidates[0]._score === 4 && (candidates.length < 2 || candidates[1]._score < 3)) {
                        // 名称信号：首候选与搜索标题精确一致，且无前缀竞争者
                        hit = candidates[0];
                    }
                    if (!hit) {
                        toast(`搜到 ${candidates.length} 个结果，请选择要播放的`, false);
                        hit = await ui.askChoice(candidates, detailMap); // 等待期间用户切源 → 抛出「已取消」
                        if (_aborted) throw new Error('已取消');
                    }
                }
                // 页面 JS 可能在 askChoice 期间清掉容器内容，导致 wrapper 脱离 DOM
                if (!document.contains(ui.wrapper) && ui.container) {
                    ui.container.appendChild(ui.wrapper);
                }
                ui.setStatus(`命中「${hit.name}」，获取选集...`);
                toast(`命中「${hit.name}」，获取选集...`, false);

                const eps = await getEpisodes(hit.id);
                if (_aborted) throw new Error('已取消');
                if (!eps.length) throw new Error('未取到播放地址，请切换其他解析源');

                let idx = 0;
                const num = curEpNum();
                if (num > 0) {
                    const f = eps.findIndex(e => {
                        const m = e.name.match(/\d{1,8}/);
                        return m && parseInt(m[0], 10) === num;
                    });
                    if (f >= 0) idx = f;
                }
                toast(`共${eps.length}集，正在加载播放器...`, false);

                const load = (ep) => { if (!_aborted) ui.iframe.src = PLAYER + encodeURIComponent(ep.url); };
                load(eps[idx]);
                ui.hidePlaceholder();
                mountEpBar(ui.epBar, ui.wrapper, load, eps, idx);
                toast(_CONFIG_.isMobile
                    ? '✓ 无损云播放中（点右上角「☰ 选集」可换集）'
                    : '✓ 无损云播放中（鼠标移到播放器右侧可换集）');
            } catch (e) {
                if (_aborted && !_takeoverTimeout) {
                    console.log('[无损云直连] 流程已取消');
                } else {
                    console.warn('[无损云直连]', e.message);
                    toast('✗ ' + e.message);
                    if (ui) ui.setStatus('✗ ' + e.message);
                    // 失败时清理 cleanupTimer，停止持续隐藏官方播放器元素
                    // （若已被外部 abort 清理/接管则跳过，避免误清其他流程的定时器）
                    if (!_aborted && _CONFIG_.cleanupTimer) { clearInterval(_CONFIG_.cleanupTimer); _CONFIG_.cleanupTimer = null; }
                }
                stopAdSoundSuppressor();
            } finally {
                _running = false;
            }
        }

        return { play, stop: abort };
    })();

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
                        #${_CONFIG_.vipBoxId} {cursor:pointer; position:fixed; top:120px; left:0px; z-index:2147483647; text-align:left; display:block !important; visibility:visible !important; opacity:1 !important; pointer-events:auto !important; font-family:-apple-system,BlinkMacSystemFont,"Microsoft YaHei","Segoe UI",sans-serif;}
                        #${_CONFIG_.vipBoxId} .img_box{width:32px; height:32px;line-height:32px;text-align:center;color:#fff7ed !important;background:#334155;border:1px solid rgba(255,255,255,.18);box-shadow:0 5px 16px rgba(2,8,23,.3),inset 0 1px 0 rgba(255,255,255,.16);margin:3px 0px;border-radius:9px !important;}
                        #${_CONFIG_.vipBoxId} .vip_icon > .img_box{background:#6d28d9;border-color:#a78bfa;box-shadow:0 5px 16px rgba(109,40,217,.34),inset 0 1px 0 rgba(255,255,255,.18);}
                        #${_CONFIG_.vipBoxId} #vip_auto{color:#f5f3ff !important;background:#4338ca;border-color:#a5b4fc;box-shadow:0 5px 16px rgba(67,56,202,.3),inset 0 1px 0 rgba(255,255,255,.18);}
                        #${_CONFIG_.vipBoxId} #vip_reload{color:#fff1f2 !important;background:#be123c;border-color:#fda4af;box-shadow:0 5px 16px rgba(190,18,60,.28),inset 0 1px 0 rgba(255,255,255,.18);}
                        #${_CONFIG_.vipBoxId} .vip_icon{position:relative;}
                        #${_CONFIG_.vipBoxId} .vip_list {display:none; position:absolute; border-radius:10px; left:34px; top:-30px; text-align:center; background:#071827; border:1px solid #0ea5e9;box-shadow:0 12px 30px rgba(2,12,27,.5);padding:10px 0px; width:380px; max-height:420px; overflow-y:auto;}
                        #${_CONFIG_.vipBoxId} .vip_repo_btn{position:absolute; top:8px; right:10px; display:inline-flex; align-items:center; justify-content:center; height:24px; padding:0 10px; border-radius:999px; border:1px solid rgba(125,211,252,.72); background:#e0f2fe; color:#082f49; font-size:11px; font-weight:700; line-height:24px; cursor:pointer; user-select:none; box-shadow:0 3px 8px rgba(14,165,233,.24); transition:background .18s ease,color .18s ease,border-color .18s ease,transform .18s ease;}
                        #${_CONFIG_.vipBoxId} .vip_repo_btn:hover{background:#38bdf8; color:#ffffff; border-color:#bae6fd; transform:translateY(-1px);}
                        #${_CONFIG_.vipBoxId} .vip_repo_btn:focus-visible{outline:2px solid #fef08a; outline-offset:2px;}
                        #${_CONFIG_.vipBoxId} .vip_sponsor_btn{position:absolute; top:8px; left:10px; display:inline-flex; align-items:center; justify-content:center; height:24px; padding:0 10px; border-radius:999px; border:1px solid rgba(244,114,182,.72); background:#fdf2f8; color:#9d174d; font-size:11px; font-weight:700; line-height:24px; cursor:pointer; user-select:none; box-shadow:0 3px 8px rgba(236,72,153,.24); transition:background .18s ease,color .18s ease,border-color .18s ease,transform .18s ease;}
                        #${_CONFIG_.vipBoxId} .vip_sponsor_btn:hover{background:#ec4899; color:#ffffff; border-color:#fbcfe8; transform:translateY(-1px);}
                        #${_CONFIG_.vipBoxId} .vip_sponsor_btn:focus-visible{outline:2px solid #f9a8d4; outline-offset:2px;}
                        #${_CONFIG_.vipBoxId} .vip_sec_head{position:relative; padding:5px 0px 0px;}
                        #${_CONFIG_.vipBoxId} .vip_sec_head button{position:absolute; top:50%; transform:translateY(-50%); display:inline-flex; align-items:center; justify-content:center; height:22px; padding:0 9px; border-radius:999px; font-size:11px; font-weight:700; line-height:22px; cursor:pointer; user-select:none; border:1px solid transparent; transition:background .18s ease,color .18s ease,border-color .18s ease,transform .18s ease;}
                        #${_CONFIG_.vipBoxId} .vip_sec_head button:hover{transform:translateY(calc(-50% - 1px));}
                        #${_CONFIG_.vipBoxId} .vip_more_btn{left:10px; background:#f5f3ff; color:#5b21b6; border-color:rgba(167,139,250,.72); box-shadow:0 3px 8px rgba(139,92,246,.24);}
                        #${_CONFIG_.vipBoxId} .vip_more_btn:hover{background:#8b5cf6; color:#ffffff; border-color:#ddd6fe;}
                        #${_CONFIG_.vipBoxId} .vip_web_btn{right:10px; background:#ecfdf5; color:#065f46; border-color:rgba(52,211,153,.72); box-shadow:0 3px 8px rgba(16,185,129,.24);}
                        #${_CONFIG_.vipBoxId} .vip_web_btn:hover{background:#10b981; color:#ffffff; border-color:#a7f3d0;}
                        #${_CONFIG_.vipBoxId} .vip_list li{border-radius:5px; font-size:12px; color:#e0f7ff; text-align:center; width:calc(25% - 14px); line-height:22px; float:left; border:1px solid #155e75; background:#0b2942; padding:0 4px; margin:4px 2px;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow:ellipsis;}
                        #${_CONFIG_.vipBoxId} .vip_list li:hover{color:#ffffff; border:1px solid #38bdf8; background:#0e7490;}
                        #${_CONFIG_.vipBoxId} .vip_list ul{padding-left: 10px; margin:0 0 4px 0;}
                        #${_CONFIG_.vipBoxId} .vip_list b{color:#7dd3fc;}
                        #${_CONFIG_.vipBoxId} .vip_list::-webkit-scrollbar{width:5px; height:1px;}
                        #${_CONFIG_.vipBoxId} .vip_list::-webkit-scrollbar-thumb{box-shadow:inset 0 0 6px rgba(0, 0, 0, 0.2); background:#0ea5e9;}
                        #${_CONFIG_.vipBoxId} .vip_list::-webkit-scrollbar-track{box-shadow:inset 0 0 6px rgba(0, 0, 0, 0.2); background:#03111f;}
                        #${_CONFIG_.vipBoxId} li.selected{color:#ffffff; border:1px solid #7dd3fc; background:#075985;}
                        @media (max-width: 520px) {
                            #${_CONFIG_.vipBoxId} .vip_list {left:38px; top:-30px; width:calc(100vw - 48px); max-width:360px; max-height:70vh; box-sizing:border-box;}
                            #${_CONFIG_.vipBoxId} .vip_list li{width:calc(50% - 14px); line-height:28px; font-size:13px;}
                            #${_CONFIG_.vipBoxId} .vip_list ul{padding-left:8px;}
                            #${_CONFIG_.vipBoxId} .vip_list h3{font-size:14px !important; padding:4px 0px !important;}
                            #${_CONFIG_.vipBoxId} .vip_sec_head{padding:4px 0px 0px;}
                            #${_CONFIG_.vipBoxId} .vip_sec_head h3{font-size:13px !important;}
                            #${_CONFIG_.vipBoxId} .vip_sec_head button{height:20px; padding:0 7px; font-size:10px; line-height:20px;}
                        }
						`);

            let type_1_str = "";
            let type_2_str = "";
            let type_3_str = "";
            _CONFIG_.videoParseList.forEach((item, index) => {
                if (item.wsyzy) {
                    type_1_str += `<li class="nq-li" title="${item.name}（屏蔽欧美、欧洲线路）" data-index="${index}">${item.name}</li>`;
                    return;
                }
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
                        <div class="img_box" title="选择解析源" style="color:white;font-size:16px;font-weight:bold;border-radius:5px;"><span style="color:#ffe4e6;">V</span>I<span style="color:#fde68a;">P</span></div>
                        <div class="vip_list">
                            <button type="button" class="vip_sponsor_btn" title="赞助支持脚本持续维护">赞助我们💗</button>
                            <button type="button" class="vip_repo_btn" title="打开 GitHub 开源地址">开源仓库⭐</button>
                            <div>
                                <h3 style="color:#7dd3fc; font-weight: bold; font-size: 16px; padding:5px 0px;">[内嵌播放]</h3>
                                <ul>
                                    ${type_1_str}
                                    <div style="clear:both;"></div>
                                </ul>
                            </div>
                            <div>
                                <div class="vip_sec_head">
                                    <button type="button" class="vip_more_btn" title="查看脚本介绍与更多资源">更多资源🎁</button>
                                    <h3 style="color:#7dd3fc; font-weight: bold; font-size: 16px; padding:5px 0px;">[弹窗播放不带选集]</h3>
                                    <button type="button" class="vip_web_btn" title="打开在线网页版解析">网页版🌐</button>
                                </div>
                                <ul>
                                    ${type_3_str}
                                    <div style="clear:both;"></div>
                                </ul>
                            </div>
                            <div style="text-align:left;color:#b7d7e8;font-size:10px;padding:0px 10px;margin-top:10px;">
                                <b>👇必看说明👇：</b>
                                <br>&nbsp;&nbsp;1、本脚本为开源项目，完全免费，请勿上当受骗
                                <br>&nbsp;&nbsp;2、默认解析为资源采集模式，已屏蔽欧美、欧洲线路
                                <br>&nbsp;&nbsp;3、如遇卡顿/打不开，可切换至海外网络环境后重试
                                <br>&nbsp;&nbsp;4、后续更新在 GitHub 仓库：88lin/video_vip
                                <br>&nbsp;&nbsp;5、自动解析失败时，可手动切换其他解析源
                                <br>&nbsp;&nbsp;6、如某些网站有会员可以关闭自动解析功能
                            </div>
                        </div>
                    </div>
                    <div class="img_box" id="vip_auto" style="color:white;font-size:16px;font-weight:bold;border-radius:5px;" title="是否打开自动解析。若自动解析失败，请手动选择其它接口尝试！！">${autoPlay}</div>
                    <div class="img_box" id="vip_reload" style="color:white;font-size:14px;font-weight:bold;border-radius:5px;" title="刷新当前解析画面">刷</div>
                </div>`);
            return new Promise((resolve, reject) => resolve(container));
        }

        reloadCurrentPlayer() {
            const iframe = document.querySelector(`.${_CONFIG_.iframeWrapperClass} iframe`);
            if (iframe && iframe.src) {
                iframe.src = iframe.src;
                return;
            }
            const selectedItem = document.querySelector(`#${_CONFIG_.vipBoxId} .vip_list .nq-li.selected`);
            if (!selectedItem) {
                return;
            }
            const index = parseInt(selectedItem.getAttribute("data-index"), 10);
            const videoObj = _CONFIG_.videoParseList[index];
            if (videoObj && videoObj.type.includes("1")) {
                this.showPlayerWindow(videoObj);
            }
        }

        bindEvent(container) {
            const vipBox = $(`#${_CONFIG_.vipBoxId}`);
            if (_CONFIG_.isMobile) {
                vipBox.find(".vip_icon").on("click", () => vipBox.find(".vip_list").toggle());
            } else {
                const vipIcon = vipBox.find(".vip_icon");
                const vipList = vipBox.find(".vip_list");
                let vipListHideTimer = null;
                vipIcon.on("mouseenter", () => {
                    clearTimeout(vipListHideTimer);
                    vipList.show();
                });
                vipIcon.on("mouseleave", () => {
                    vipListHideTimer = setTimeout(() => vipList.hide(), 160);
                });
            }

            let _this = this;
            vipBox.find("#vip_reload").on("click", (event) => {
                event.stopPropagation();
                this.reloadCurrentPlayer();
            });
            vipBox.find(".vip_repo_btn").on("click", (event) => {
                event.stopPropagation();
                GM_openInTab("https://github.com/88lin/video_vip/", {active: true, insert: true, setParent: true});
            });
            vipBox.find(".vip_sponsor_btn").on("click", (event) => {
                event.stopPropagation();
                GM_openInTab("https://blog.88lin.eu.org/coffee", {active: true, insert: true, setParent: true});
            });
            vipBox.find(".vip_more_btn").on("click", (event) => {
                event.stopPropagation();
                GM_openInTab("https://blog.88lin.eu.org/article/46", {active: true, insert: true, setParent: true});
            });
            vipBox.find(".vip_web_btn").on("click", (event) => {
                event.stopPropagation();
                GM_openInTab("https://go.88lin.eu.org/vip", {active: true, insert: true, setParent: true});
            });
            vipBox.find(".vip_list .nq-li").each((liIndex, item) => {
                item.addEventListener("click", () => {
                    const index = parseInt($(item).attr("data-index"));
                    _CONFIG_.manualPicked = true;
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
                    _CONFIG_.manualPicked = true;
                    if (_CONFIG_.directMode) {
                        // 移除页面内直连播放器，避免与弹窗播放双份声音
                        document.querySelectorAll('.' + _CONFIG_.iframeWrapperClass).forEach((node) => node.remove());
                    }
                    _CONFIG_.directMode = false;
                    wsyzyDirect.stop();
                    if (_CONFIG_.cleanupTimer) { clearInterval(_CONFIG_.cleanupTimer); _CONFIG_.cleanupTimer = null; }
                    let url = videoObj.url + window.location.href;
                    GM_openInTab(url, {active: true, insert: true, setParent: true});
                });
            });

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
            let index = GM_getValue(_CONFIG_.autoPlayerVal, 0);
            let autoObj = _CONFIG_.videoParseList[index];
            if (!autoObj || !autoObj.type.includes("1")) return;
            let _th = this;
            setTimeout(function () {
                // directMode/manualPicked 检查必须在定时器触发时进行：
                // 等待期间用户可能已手动点了直连或其他解析源，此时不应再自动播放
                // （既避免覆盖用户选择，也避免对同一源重复执行导致播放器重建）
                if (_CONFIG_.directMode || _CONFIG_.manualPicked) return;
                // 重新读取：以用户最后的选择为准
                let idx = GM_getValue(_CONFIG_.autoPlayerVal, 0);
                let obj = _CONFIG_.videoParseList[idx];
                if (!obj || !obj.type.includes("1")) return;
                _th.showPlayerWindow(obj);
                const vipBox = $(`#${_CONFIG_.vipBoxId}`);
                vipBox.find(`.vip_list [data-index="${idx}"]`).addClass("selected");
                vipBox.find("#vip_auto").attr("title", `自动解析源：${obj.name}`);
            }, 1500);
        }

        showPlayerWindow(videoObj) {
            if (videoObj.wsyzy) {
                _CONFIG_.directMode = true;
                wsyzyDirect.play().catch(e => console.warn('[无损云直连]', e.message));
                return;
            }
            _CONFIG_.directMode = false;
            wsyzyDirect.stop();   // 切回解析接口时停止直连模式的广告声抑制
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
                        const initialRect = container.getBoundingClientRect();
                        const initialStyle = window.getComputedStyle(container);
                        const frameLayout = buildPlayerFrameLayout({
                            isMobile: !!_CONFIG_.isMobile,
                            containerRect: initialRect,
                            containerStyle: {
                                paddingTop: initialStyle.paddingTop
                            },
                            viewportHeight: window.innerHeight || document.documentElement.clientHeight || 0
                        });
                        $(container).empty();
                        util.reomveVideo();
                        if (initialStyle.position === "static") {
                            container.style.position = "relative";
                        }
                        applyInlineStyles(container, frameLayout.containerStyles);

                        const iframeWrapper = document.createElement("div");
                        iframeWrapper.className = _CONFIG_.iframeWrapperClass;
                        applyInlineStyles(iframeWrapper, frameLayout.wrapperStyles);

                        const iframe = document.createElement("iframe");
                        iframe.src = url;
                        iframe.frameBorder = "0";
                        iframe.allow = "autoplay; encrypted-media; fullscreen";
                        iframe.allowFullscreen = true;
                        iframe.referrerPolicy = "no-referrer";
                        applyInlineStyles(iframe, frameLayout.iframeStyles);

                        iframeWrapper.appendChild(iframe);
                        container.appendChild(iframeWrapper);
                    }
                }).catch(() => {});
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
            // 一次性索引迁移：videoParseList 在 index 0 插入了「默认解析」，老用户存储的索引需要 +1
            const migKey = 'wsyzy_idx_migrated_' + window.location.host;
            if (!GM_getValue(migKey, false)) {
                const oldVal = GM_getValue(_CONFIG_.autoPlayerVal, null);
                if (typeof oldVal === 'number' && oldVal >= 0) {
                    GM_setValue(_CONFIG_.autoPlayerVal, oldVal + 1);
                }
                GM_setValue(migKey, true);
            }
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
