#!/bin/bash
for f in *.avi
do
  tempfile="${f##*/}"

  ## display filename
  fileName="${f%.*}"
  echo "Processing $f file...I think it should be ${fileName}"

  # take action on each file. $f store current file name (different rules have different effects, i chose 113 for meme reasons)
ffmpeg  \
-f lavfi -i cellauto=s=1280x720:rule=113:r=60 \
-i ${f} \
-filter_complex '[0:v]scale=1280x720,setsar=sar=1/1,format=rgba[cells];[1:v]scale=1280x720,setsar=sar=1/1,format=rgba[random];[cells][random]blend=all_mode='addition':all_opacity=0.3[out];[out]format=rgba' \
-g 9999 -bf 0 -bsf noise=5000 \
-f mpegts -c:v libx264 -strict experimental -crf 31 -preset ultrafast -tune zerolatency -shortest tmp.mp4

ffmpeg -i tmp.mp4 -t 30 -vf tblend=all_mode=darken -c:v libx264 ${fileName}_glitch.mp4


done