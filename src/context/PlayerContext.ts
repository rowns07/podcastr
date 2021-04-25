import { createContext } from 'react';

type Episode = {
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  url: string;
}

type PlayerConxtextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  play: (episode: Episode) => void;
  isPlaying: boolean;
  setPlayingState: (state: boolean) => void;
  togglePlay: () => void;
}

export const PlayerContext = createContext({} as PlayerConxtextData);