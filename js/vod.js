
    let pagename = window.location.pathname.split('/').slice(-1);
    var db_url = 'https://pkj99.github.io/iptv/db/iptv.db';
    var pagecount;
    var urlParams;
    

    // create tv list 
    function tvlists(sqlstring){
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
                htmlString += '<li class="nav-item">';
                htmlString += '<a class="channel nav-link" data-value="'+url+'"';
                htmlString += 'href="javascript:void(0);">'+title+'</a>';
                htmlString += '</li>';
            }

            document.getElementById('list').innerHTML = htmlString;

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
    
    var bypass = false;

    if (urlParams["t"] == null){ var t = "0"; } else { var t = urlParams["t"];}
    if (t == "0"){
        var sqlstring = "select * from iptv where catalog = '台湾頻道'";
        tvlists(sqlstring);
    }
    if (t == "1"){
        var sqlstring = "select * from iptv where catalog = '四季頻道'";
        tvlists(sqlstring);
    }


    // if (t==1001){ document.getElementById('menu-1001').classList.add("active"); } 
    // if (t==1002){ document.getElementById('menu-1002').classList.add("active"); } 
    // if (t==1003){ document.getElementById('menu-1003').classList.add("active"); } 
    // if (t==2001){ document.getElementById('menu-2001').classList.add("active"); } 
    // if (t==2002){ document.getElementById('menu-2002').classList.add("active"); } 
    // if (t==2003){ document.getElementById('menu-2003').classList.add("active"); } 
    // if (t==6001){ document.getElementById('menu-6001').classList.add("active"); } 
    // if (t==6002){ document.getElementById('menu-6002').classList.add("active"); } 
    // if (t==6003){ document.getElementById('menu-6003').classList.add("active"); } 


 
