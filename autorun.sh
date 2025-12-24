#!/bin/bash

echo $(dirname $0)

python3 -m pip install requests
# python3 -m pip install yt_dlp

cd $(dirname $0)/scripts/

python3 iltv_m3ugrabber.py

echo m3u grabbed
