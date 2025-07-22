import { useRef } from "react";

const useSounds = function () {
  const sources = {
    ok: "/sounds/ok.mp3",
    alert: "/sounds/alert.mp3",
    login: "/sounds/login.mp3",
    logout: "/sounds/logout.mp3",
  };

  type TypeSource = keyof typeof sources;

  const audioRefs = new Object() as Record<
    TypeSource,
    React.RefObject<HTMLAudioElement>
  >;

  for (const type of Object.keys(sources)) {
    const source = sources[type as TypeSource];
    const audioRef = useRef(new Audio(source));
    audioRefs[type as TypeSource] = audioRef;
  }

  const play = async function (type: keyof typeof sources) {
    const audio = audioRefs[type]?.current;
    if (!audio) return;
    audio.volume = 0.3;
    audio.currentTime = 0;
    audio.play().catch(() => {});
    return;
  };

  return play;
};

export default useSounds;
