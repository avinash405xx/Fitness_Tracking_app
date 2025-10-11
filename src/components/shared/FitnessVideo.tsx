import { useEffect, useRef } from 'react';

interface FitnessVideoProps {
  videoUrl: string;
  className?: string;
}

export default function FitnessVideo({ videoUrl, className = '' }: FitnessVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.log('Video autoplay failed:', error);
      }
    };

    playVideo();

    const handleEnded = () => {
      if (video) {
        video.currentTime = 0;
        playVideo();
      }
    };

    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoUrl]);

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      className={className}
      muted
      playsInline
      preload="auto"
    />
  );
}
