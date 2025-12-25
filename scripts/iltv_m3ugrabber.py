import requests
import os
import sys

HEADERS={"User-Agent": "okhttp/4.12.0"}

windows = False
if 'win' in sys.platform:
    windows = True

def grab(url):
    start = 0
    end = 1000
    response = requests.get(url, headers=HEADERS, timeout=15).text
    if '&token=' in response:
        start = response.find('&token=') + 7
        end = start + 64
    else:
        os.system(f'curl --header "User-Agent: okhttp" "{url}" > temp.txt')
        response = ''.join(open('temp.txt').readlines())
        if '&token=' in response:
            start = response.find('&token=') + 7
            end = start + 64
    return f"{response[start : end]}"

token=grab('https://tv.iill.top/m3u/Gather')
print(token)
with open('iltv_template.m3u','r',encoding='utf-8') as f:
    txt = f.read().replace('&token=key','&token='+str(token))
    with open('../m3u/iltv.m3u','w',encoding='utf-8') as g:
        g.write(txt)

with open('iltv_template.txt','r',encoding='utf-8') as f:
    txt = f.read().replace('&token=key','&token='+str(token))
    with open('../m3u/iltv.txt','w',encoding='utf-8') as g:
        g.write(txt)

if 'temp.txt' in os.listdir():
    os.system('rm temp.txt')
