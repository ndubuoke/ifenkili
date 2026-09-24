"use client";

import { useRef } from "react";

export function VideoTrailer({
  poster,
  src,
  title,
}: {
  poster: string;
  src: string;
  title: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const open = () => {
    dialogRef.current?.showModal();
    videoRef.current?.play();
  };

  const close = () => {
    videoRef.current?.pause();
    dialogRef.current?.close();
  };

  return (
    <>
      <button className="video-trigger" onClick={open} aria-label={`Play: ${title}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={poster} alt="" />
        <span className="play" aria-hidden="true">
          <span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </button>

      <dialog
        ref={dialogRef}
        className="video-modal"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onClose={() => videoRef.current?.pause()}
      >
        <button className="close" onClick={close} aria-label="Close">
          ✕
        </button>
        <video ref={videoRef} src={src} poster={poster} controls playsInline />
      </dialog>
    </>
  );
}
