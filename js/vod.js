
    let pagename = window.location.pathname.split('/').slice(-1);
    var db_url = 'https://pkj99.github.io/iptv/db/iptv.db';
    var pagecount;
    var urlParams;
    var m3u_url = 'https://pkj99.github.io/demo/media/iptv.m3u';
    
    // 收藏設定 Cookie 
  
    function parseCookie() {
        var cookieObj = {};
        var cookieAry = document.cookie.split(';');
        var cookie;
        
        for (var i=0, l=cookieAry.length; i<l; ++i) {
            cookie = jQuery.trim(cookieAry[i]);
            cookie = cookie.split('=');
            cookieObj[cookie[0]] = cookie[1];
        }
        return cookieObj;
    } 

    function getCookieByName(name) {
        var value = parseCookie()[name];
        if (value) {
            value = decodeURIComponent(value);
        }

        return value;
    }

    function setCookieBySourceId(source,id) {
        var ids = getCookieByName(source);
        var idNew = ',' + id ;
        const d = new Date();
        d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
        let expires = "expires="+d.toUTCString();

        if (ids == null) { ids = '';}
        if (ids.includes(idNew)){
            document.getElementById('favorites').textContent = '收藏';
            document.getElementById('favorites').className = 'btn btn-secondary';
            ids = ids.replace(idNew,'');
            document.cookie = source + '=' + ids + ";" + expires + ";path=/";
        } else {
            document.getElementById('favorites').textContent = '已收藏';
            document.getElementById('favorites').className = 'btn btn-danger';
            ids += idNew ;
            document.cookie = source + '=' + ids + ";" + expires + ";path=/";
        }
    }

    function checkCookieBySourceId(source,id) {
        var ids = getCookieByName(source);
        var idsAry = ids.split(',');
        if (ids == null) { ids = '';}
        for (var i=0, l=idsAry.length; i<l; ++i) {
            if (id == idsAry[i]){
                document.getElementById('favorites').textContent = '已收藏';
                document.getElementById('favorites').className = 'btn btn-danger';
            }
        }      
    }



    // create tv list 
    function tvchannels(sqlstring){
        // console.log(sqlstring);
        const xhr = new XMLHttpRequest();
        xhr.open('GET', db_url, true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = e => {
            const uInt8Array = new Uint8Array(xhr.response);
            const db = new SQL.Database(uInt8Array);
            
            const contents = db.exec(sqlstring);
            var data = JSON.parse(JSON.stringify(contents));
            
            let htmlString = '';

            if (typeof data[0] == "undefined" ) { data = [];} else { data = data[0].values; }

            for (var i = 0; i < data.length; i++) {
                var title = data[i][1];
                var url = data[i][2];
                var image = data[i][4];
                image = 'images/iptv/' + title + '.png';
                htmlString += `<li class="col-lg-8 col-md-8 col-sm-5 col-xs-3">`;
                htmlString += `<div class="myui-vodlist__box">`;
                // htmlString += `<a class="myui-vodlist__thumb lazyload" href="${url}" `;
                htmlString += `<a class="myui-vodlist__thumb lazyload" href="${url}" `;
                htmlString += `title="${title}" `;
                htmlString += `data-original="${url}" `;
                htmlString += `style="background-image: url('${image}')"`;
                htmlString += `</a>`;
                htmlString += `</div>`;
                // htmlString += `<div class="myui-vodlist__detail">`;
                // htmlString += `<h4 class="title text-overflow"><a href="${url}">${title}</a></h4>`;
                // htmlString += `</div>`;
                htmlString += `</li>`;
            }

            document.getElementById('tvlist').innerHTML = htmlString;

        };
        xhr.send();
    }


    function tvchannels2(groupName){
        const xhr = new XMLHttpRequest();
        xhr.open('GET', m3u_url);
        xhr.onload = e => {

            var contents = xhr.response;
            var channel = "0";
            var url_tvg, tvg_logo, tvg_name, group_title, title, url, info;
            let htmlString = '';

            var lines = contents.split(/[\r\n]/);
            for (var i in lines){
                var line = lines[i];
                if (/#EXTM3U/.test(line)) {
                    channel = "0";
                    if (/url-tvg/.test(line)){
                        var keyVal = line.split(/ /)[1], url_tvg = keyVal.split(/[=]/)[1].replaceAll('\"','').trim();
                    }
                } else {
                    if (/#EXTINF/.test(line)) {
                        channel = "0";
                        title = line.split(/,/)[1].replaceAll('\"','').trim();
                        info = line.split(/,/)[0];

                        if (/tvg-logo/.test(info)){
                            var keyVal = info.split(/tvg-logo/)[1], val2 = keyVal.split(/ /)[0], tvg_logo = val2.split(/[=]/)[1].replaceAll('\"','').trim();                        
                        }
                        if (/tvg-name/.test(info)){
                            var keyVal = info.split(/tvg-name/)[1], val2 = keyVal.split(/ /)[0], tvg_name = val2.split(/[=]/)[1].replaceAll('\"','').trim();
                        }
                        if (/group-title/.test(info)){
                            var keyVal = info.split(/group-title/)[1], val2 = keyVal.split(/ /)[0], group_title = val2.split(/[=]/)[1].replaceAll('\"','').trim();
                        }
                    } else {
                        if (line.trim() != ''){
                            channel = "1";
                            url = line.trim();
                        }
                    }
                }
                // alert("channel="+channel);
                if (channel == "1") {
                    // console.log(tvg_logo, tvg_name, group_title, title, url, groupName);
                    if (group_title == groupName || groupName == 'ALL'){
                        htmlString += `<li class="col-lg-8 col-md-8 col-sm-5 col-xs-3">`;
                        htmlString += `<div class="myui-vodlist__box">`;
                        // htmlString += `<a class="myui-vodlist__thumb lazyload" href="${url}" `;
                        htmlString += `<a class="myui-vodlist__thumb lazyload" href="${url}" `;
                        htmlString += `title="${title}" `;
                        htmlString += `data-original="${url}" `;
                        htmlString += `style="background-image: url('${tvg_logo}')"`;
                        htmlString += `</a>`;
						htmlString += `<span class="pic-text text-right">${group_title}</span>`;
                        htmlString += `</div>`;
                        htmlString += `<div class="myui-vodlist__detail">`;
                        htmlString += `<h4 class="title text-overflow"><a href="${url}">${title}</a></h4>`;
                        htmlString += `</div>`;
                        htmlString += `</li>`;
                    }
                    channel = "0";
                }
            }
            document.getElementById('tvlist').innerHTML = htmlString;
        };
        xhr.send();
    }



    // get params
    (window.onpopstate = function () {
        var match,
            pl     = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query  = window.location.search.substring(1);

        urlParams = {};
        while (match = search.exec(query))
            urlParams[decode(match[1])] = decode(match[2]);
    })();

    if (urlParams["m3u"] != null){ 
        m3u_url = urlParams["m3u"]; 
        tvchannels2('ALL');
        document.getElementById('menu7').classList.add("active");
    } else {


    if (urlParams["t"] == null){ var t = "0"; } else { var t = urlParams["t"];}
    if (t == "0"){
        // var sqlstring = "select * from iptv where catalog in ('民視頻道','台湾頻道') order by catalog desc, hostname desc";
        tvchannels("select * from iptv_tw");
        // tvchannels2('台湾頻道');
        document.getElementById('menu0').classList.add("active");
    }
    if (t == "1"){
        // tvchannels("select pid,title,url,catalog,image from iptv where catalog in ('央视','卫视') order by catalog desc");
        tvchannels("select * from iptv_cn");
        // m3u_url = 'https://pkj99.github.io/demo/media/chinatv.m3u';
        // tvchannels2('ALL');
        document.getElementById('menu1').classList.add("active");
    }
    if (t == "2"){
        tvchannels("select * from iptv where catalog = 'Youtube頻道'");
        // tvchannels2('Youtube頻道');
        document.getElementById('menu2').classList.add("active");
    }
    if (t == "3"){
        var sqlstring = "select * from iptv_news where catalog='台湾頻道'";
        tvchannels(sqlstring);
        // tvchannels2('新聞頻道');
        document.getElementById('menu3').classList.add("active");
    }
    if (t == "4"){
        tvchannels("select * from iptv_sports where catalog in ('台湾頻道','央视')");
        // tvchannels2('體育頻道');
        document.getElementById('menu4').classList.add("active");
    }
    if (t == "5"){
        // tvchannels("select * from iptv_movies");
        // tvchannels2('電影頻道');
        // tvchannels("select * from iptv where catalog = '星視界頻道'");
        // tvchannels("select * from iptv where catalog = '百視通頻道'");
        // m3u_url = 'https://pkj99.github.io/histar/tv.m3u'; 
        m3u_url = 'https://raw.githubusercontent.com/pkj99/YTChannel/main/youtube.m3u';
        tvchannels2('ALL');
        document.getElementById('menu5').classList.add("active");
    }
    if (t == "6"){
        // var sqlstring = "select * from iptv where catalog = '台湾頻道' and title not like '%体育%' and title not like '%新闻%' and title not like '%电影%' and title not like '%洋片%' and title not like '%HBO%'";
        // tvchannels(sqlstring);
        // tvchannels2('民視頻道');
        // tvchannels("select * from iptv where catalog = '歐飛頻道'");
        m3u_url = 'https://pkj99.github.io/ofiii/tv.m3u'; 
        tvchannels2('ALL');         
        document.getElementById('menu6').classList.add("active");
    }
    if (t == "7"){
        m3u_url = 'https://iptv-org.github.io/iptv/languages/zho.m3u'; 
        tvchannels2('ALL'); 
        document.getElementById('menu7').classList.add("active");
    }
    if (t == "9"){
        tvchannels("select * from iptv where catalog = '四季頻道'");
        document.getElementById('menu9').classList.add("active");
    }
	}
