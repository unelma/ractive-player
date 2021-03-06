import * as React from "react";
const {useEffect} = React;

import {usePlayer} from "../hooks";
import {formatTime} from "../utils/time";

interface Props {
  cols: number;
  rows: number;
  height: number;
  width: number;
  frequency: number;
  path: string;

  progress: number;
  show: boolean;
  title: string;
}

interface VideoHighlight {
  time: number;
  title: string;
}

export interface ThumbData {
  cols: number;
  rows: number;
  width: number;
  height: number;
  frequency: number;
  path: string;
  highlights?: VideoHighlight[];
}

export default function ThumbnailBox(props: Props) {
  const player = usePlayer(),
        {playback} = player;

  const {cols, rows, frequency, path, progress, show, title, height, width} = props;
  const count = cols * rows;

  useEffect(() => {
    // preload thumbs (once more important loading has taken place)
    const maxSlide = Math.floor(playback.duration / frequency / 1000),
          maxSheet = Math.floor(maxSlide / count);

    player.hub.on("canplay", () => {
      for (let sheetNum = 0; sheetNum <= maxSheet; ++sheetNum) {
        const img = new Image();
        img.src = path.replace("%s", sheetNum.toString());
      }
    });
  }, []);

  const time = progress * playback.duration / 1000,
        markerNum = Math.floor(time / frequency),
        sheetNum = Math.floor(markerNum / count),
        markerNumOnSheet = markerNum % count,
        row = Math.floor(markerNumOnSheet / rows),
        col = markerNumOnSheet % rows;

  const sheetName = path.replace("%s", sheetNum.toString());

  return (
    <div
      className="rp-controls-thumbnail"
      style={{
        display: show ? "block" : "none",
        left: `calc(${progress * 100}%)`
      }}>
      {title && <span className="rp-thumbnail-title">{title}</span>}
      <div className="rp-thumbnail-box">
        <img
          src={sheetName}
          style={{
            left: `-${col * width}px`,
            top: `-${row * height}px`
          }}
        />
        <span className="rp-thumbnail-time">{formatTime(time * 1000)}</span>
      </div>
    </div>
  );
}
