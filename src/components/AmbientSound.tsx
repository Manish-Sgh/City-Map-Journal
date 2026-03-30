import React, { useEffect, useRef } from 'react';
import { Season } from '../types';

interface AmbientSoundProps {
  season: Season;
  isNight: boolean;
  isSoundOn: boolean;
}

const soundMap: Record<Season, { day: string; night: string }> = {
  Spring: {
    day: '/sounds/loswin23-light-rain-thunder-and-birds-chirping-504286.mp3',
    night: '/sounds/loswin23-light-rain-thunder-and-birds-chirping-504286.mp3',
  },
  Summer: {
    day: '/sounds/zehendrew-birds-chirping-calm-173695.mp3',
    night: '/sounds/loswin23-light-rain-thunder-and-birds-chirping-504286.mp3',
  },
  Autumn: {
    day: '/sounds/loswin23-light-rain-thunder-and-birds-chirping-504286.mp3',
    night: '/sounds/zehendrew-birds-chirping-calm-173695.mp3',
  },
  Winter: {
    day: '/sounds/lozehendrew-birds-chirping-calm-173695.mp3',
    night: '/sounds/loswin23-light-rain-thunder-and-birds-chirping-504286.mp3',
  },
};

const AmbientSound: React.FC<AmbientSoundProps> = ({
  season,
  isNight,
  isSoundOn,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const selectedSound = isNight
      ? soundMap[season].night
      : soundMap[season].day;

    if (!audioRef.current) {
      audioRef.current = new Audio(selectedSound);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
    }

    const audio = audioRef.current;

    // Change sound when season/day-night changes
    if (audio.src !== window.location.origin + selectedSound) {
      audio.src = selectedSound;
      audio.load();
    }

    if (isSoundOn) {
      audio.play().catch((err) => {
        console.log('Audio play blocked:', err);
      });
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
    };
  }, [season, isNight, isSoundOn]);

  return null;
};

export default AmbientSound;