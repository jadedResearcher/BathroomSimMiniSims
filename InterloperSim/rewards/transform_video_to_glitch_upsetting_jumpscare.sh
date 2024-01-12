#!/bin/bash
for f in *.mp4
do
  tempfile="${f##*/}"

  ## display filename
  fileName="${f%.*}"
  echo "Processing $f file...I think it should be ${fileName}"

  # take action on each file. $f store current file name (different rules have different effects, i chose 113 for meme reasons)
ffmpeg -f lavfi -i cellauto=s=640x360:rule=15:r=50 \
-vf scale=1280x720 -bsf noise=1000 -r 30 -f mpegts \
-c:v h264 -crf 31 -preset ultrafast -tune zerolatency - | \
ffplay -i - -loglevel quiet -fs -vf tblend=all_mode=darken

done