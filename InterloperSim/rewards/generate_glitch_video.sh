#!/bin/bash
for f in *.mp4
do
  tempfile="${f##*/}"

  ## display filename
  fileName="${f%.*}"
  echo "Processing $f file...I think it should be ${fileName}"

  # take action on each file. $f store current file name (different rules have different effects, i chose 113 for meme reasons)
ffmpeg  \
-f lavfi -i cellauto=s=1280x720:rule=113:r=60 \
-bsf noise=3000 \
-f mpegts -t 30 \
-c:v libx264 \
glitch.mp4 \

done