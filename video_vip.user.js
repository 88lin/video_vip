// ==UserScript==
// @name              全网VIP视频免费破解去广告【最新3.1】
// @namespace         video_vip
// @version           3.1.8
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
// @tag               免费看剧
// @tag               高清视频
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
                    }
                    return;
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
            {"name": "默认B", "type": "1,3", "url": "https://super.playr.top/?url="},
            {"name": "CK解析", "type": "1,3", "url": "https://www.ckplayer.vip/jiexi/?url="},
            {"name": "Node解析", "type": "1,3", "url": "https://jx.nodenode.dpdns.org/?url="},
			{"name": "Player-JY", "type": "1,3", "url": "https://jx.playerjy.com/?url="},
            {"name": "虾米解析", "type": "1,3", "url": "https://jx.xmflv.com/?url="},
            {"name": "789解析", "type": "1,3", "url": "https://jiexi.789jiexi.icu:4433/?url="},
            {"name": "937解析", "type": "1,3", "url": "https://bfq.937auth.vip?url="},
			{"name": "HLS解析", "type": "1,3", "url": "https://jx.hls.one/?url="},
			{"name": "极速解析", "type": "1,3", "url": "https://jx.2s0.cn/player/?url="},
			{"name": "冰豆解析", "type": "1,3", "url": "https://bd.jx.cn/?url="},
			{"name": "剖元解析", "type": "1,3", "url": "https://www.pouyun.com/?url="},
            {"name": "973解析", "type": "1,3", "url": "https://jx.973973.xyz/?url="},
            {"name": "七哥解析", "type": "1,3", "url": "https://jx.nnxv.cn/tv.php?url="},
            {"name": "playm3u8", "type": "1,3", "url": "https://www.playm3u8.cn/jiexi.php?url="},
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
                        }
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
                        <div class="img_box" title="选择解析源" style="color:white;font-size:16px;font-weight:bold;border-radius:5px;"><span style="color:#ffe4e6;">V</span>I<span style="color:#fde68a;">P</span></div>
                        <div class="vip_list">
                            <div>
                                <h3 style="color:#7dd3fc; font-weight: bold; font-size: 16px; padding:5px 0px;">[内嵌播放]</h3>
                                <ul>
                                    ${type_1_str}
                                    <div style="clear:both;"></div>
                                </ul>
                            </div>
                            <div>
                                <h3 style="color:#7dd3fc; font-weight: bold; font-size: 16px; padding:5px 0px;">[弹窗播放不带选集]</h3>
                                <ul>
                                    ${type_3_str}
                                    <div style="clear:both;"></div>
                                </ul>
                            </div>
                            <div style="text-align:left;color:#b7d7e8;font-size:10px;padding:0px 10px;margin-top:10px;">
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
