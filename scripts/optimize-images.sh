#!/usr/bin/env bash
# Downscale/recompress oversized bundled images for smooth mobile performance.
# - Regular images: cap longest side at 2048px
# - Equirectangular panoramas (aspect ~2:1): cap width at 3840px
# - Keeps original format + filename (so require()/asset-map paths stay valid)
# - Backs up every original to scripts/.img-backup/<relpath> before overwriting
# - Only touches files > 1.2MB whose dimensions actually exceed the cap
set -u
cd "$(dirname "$0")/.." || exit 1

BACKUP="scripts/.img-backup"
THRESH=1258291   # 1.2MB
processed=0; skipped=0; saved=0

while IFS= read -r -d '' f; do
  sz=$(stat -c%s "$f")
  [ "$sz" -lt "$THRESH" ] && continue

  dims=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$f" </dev/null 2>/dev/null)
  w=${dims%%,*}; h=${dims##*,}
  [ -z "${w:-}" ] && { echo "skip(no dims): $f"; skipped=$((skipped+1)); continue; }

  # aspect ratio *100
  ar=$(awk -v a="$w" -v b="$h" 'BEGIN{ if(b>0) printf "%d", (a/b)*100; else print 0 }')
  max=$(( w > h ? w : h ))

  vf=""
  if [ "$ar" -ge 180 ] && [ "$ar" -le 220 ]; then
    # equirectangular panorama
    [ "$w" -gt 3840 ] && vf="scale=3840:-2:flags=lanczos"
  else
    [ "$max" -gt 2048 ] && vf="scale='if(gt(iw,ih),2048,-2)':'if(gt(iw,ih),-2,2048)':flags=lanczos"
  fi

  [ -z "$vf" ] && { skipped=$((skipped+1)); continue; }

  # backup
  bdir="$BACKUP/$(dirname "$f")"
  mkdir -p "$bdir"
  [ -f "$BACKUP/$f" ] || cp "$f" "$BACKUP/$f"

  ext="${f##*.}"
  tmp="${f%.*}.__opt.${ext}"
  case "$ext" in
    jpg|jpeg|JPG|JPEG) enc=(-q:v 3) ;;   # ~ quality 85
    *)                 enc=(-compression_level 100) ;;  # png
  esac

  if ffmpeg -nostdin -y -hide_banner -loglevel error -i "$f" -vf "$vf" "${enc[@]}" "$tmp" </dev/null 2>/dev/null && [ -s "$tmp" ]; then
    nsz=$(stat -c%s "$tmp")
    if [ "$nsz" -lt "$sz" ]; then
      mv "$tmp" "$f"
      saved=$(( saved + sz - nsz ))
      processed=$((processed+1))
      printf "  ok  %5.1f->%4.1fMB  %s\n" "$(awk -v x=$sz 'BEGIN{print x/1048576}')" "$(awk -v x=$nsz 'BEGIN{print x/1048576}')" "$f"
    else
      rm -f "$tmp"; skipped=$((skipped+1))   # would grow; keep original
    fi
  else
    rm -f "$tmp"; echo "  FAIL $f"; skipped=$((skipped+1))
  fi
done < <(find src/assets assets/remote -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -print0)

printf "\nDONE  processed=%d skipped=%d  saved=%.0fMB\n" "$processed" "$skipped" "$(awk -v x=$saved 'BEGIN{print x/1048576}')"
