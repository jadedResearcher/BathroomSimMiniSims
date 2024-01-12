#!/bin/bash
for f in *.avi
do
  tempfile="${f##*/}"

  ## display filename
  fileName="${f%.*}"
  echo "Processing $f file...I think it should be ${fileName}"

  # take action on each file. $f store current file name 
ffmpeg \
    -i bloodybath.mp4 -i glitch.mp4 \
    -filter_complex " \
        [0:v]setpts=PTS-STARTPTS, scale=480x360[top]; \
        [1:v]setpts=PTS-STARTPTS, scale=480x360, \
             format=yuva420p,colorchannelmixer=aa=0.5[bottom]; \
        [top][bottom]overlay=shortest=1" \
     -vcodec libx264 transparency_test.mp4




done