
    let pagename = window.location.pathname.split('/').slice(-1);
    var db_url = 'https://pkj99.github.io/iptv/db/iptv.db';
    var pagecount;
    var urlParams;
    
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
                htmlString += `<li class="col-lg-10 col-md-10 col-sm-5 col-xs-4">`;
                htmlString += `<div class="myui-vodlist__box">`;
                htmlString += `<a class="myui-vodlist__thumb lazyload" href="${url}" `;
                htmlString += `title="${title}" `;
                htmlString += `data-original="${url}" `;
                htmlString += `style="background-image: url('${image}')"`;
                htmlString += `</a>`;
                htmlString += `</div>`;
                htmlString += `<div class="myui-vodlist__detail">`;
                htmlString += `<h4 class="title text-overflow"><a href="${url}">${title}</a></h4>`;
                htmlString += `</div>`;
                htmlString += `</li>`;
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

    if (urlParams["t"] == null){ var t = "0"; } else { var t = urlParams["t"];}
    if (t == "0"){
        // var sqlstring = "select * from iptv where (catalog='台湾頻道' and title like '民视%') or (catalog = '四季頻道') ";
        var sqlstring = "select * from iptv where (catalog = '台湾頻道WEB') or (catalog = '四季頻道') ";
        tvchannels(sqlstring);
        document.getElementById('menu0').classList.add("active");
    }
    if (t == "1"){
        var sqlstring = "select pid,title,'https://pkj99.github.io/demo/m3u8/iptv/chinatv/'||title||'.m3u8' as url,catalog,image from iptv where catalog in ('央视','卫视')";
        tvchannels(sqlstring);
        document.getElementById('menu1').classList.add("active");
    }
    if (t == "2"){
        var sqlstring = "select * from iptv where catalog = 'Youtube頻道'";
        tvchannels(sqlstring);
        document.getElementById('menu2').classList.add("active");
    }
    if (t == "3"){
        var sqlstring = "select * from iptv_news";
        tvchannels(sqlstring);
        document.getElementById('menu3').classList.add("active");
    }
    if (t == "4"){
        var sqlstring = "select * from iptv_sports";
        tvchannels(sqlstring);
        document.getElementById('menu4').classList.add("active");
    }
    if (t == "5"){
        var sqlstring = "select * from iptv_movies";
        tvchannels(sqlstring);
        document.getElementById('menu5').classList.add("active");
    }
    if (t == "6"){
        var sqlstring = "select * from iptv where catalog = '台湾頻道' and title not like '%体育%' and title not like '%新闻%' and title not like '%电影%' and title not like '%洋片%' and title not like '%HBO%'";
        tvchannels(sqlstring);
        document.getElementById('menu6').classList.add("active");
    }



