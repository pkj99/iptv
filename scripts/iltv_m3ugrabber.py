import requests
import os
import sys

HEADERS={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36"}

windows = False
if 'win' in sys.platform:
    windows = True

def grab(url):
    start = 0
    end = 64
    response = requests.get(url, headers=HEADERS, timeout=15).text
    if '&token=' in response:
        print('requests get token ...')
        start = response.find('&token=') + 7
        end = start + 64
    else:
        os.system(f'curl -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36" "{url}" > temp.txt')
        response = ''.join(open('temp.txt').readlines())
        if '&token=' in response:
            print('curl get token ...')
            start = response.find('&token=') + 7
            end = start + 64
        else:
            os.system(f'wget --user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36" "{url}" -O temp.txt')
            response = ''.join(open('temp.txt').readlines())
            if '&token=' in response:
                print('wget get token ...')
                start = response.find('&token=') + 7
                end = start + 64            
    return f"{response[start : end]}"

token=grab('https://tv.iill.top/m3u/Gather')
print(token)
with open('scripts/iltv_template.m3u','r',encoding='utf-8') as f:
    txt = f.read().replace('&token=key','&token='+str(token))
    with open('m3u/iltv.m3u','w',encoding='utf-8') as g:
        g.write(txt)

with open('scripts/iltv_template.txt','r',encoding='utf-8') as f:
    txt = f.read().replace('&token=key','&token='+str(token))
    with open('m3u/iltv.txt','w',encoding='utf-8') as g:
        g.write(txt)

# if 'temp.txt' in os.listdir():
    # os.system('rm temp.txt')
