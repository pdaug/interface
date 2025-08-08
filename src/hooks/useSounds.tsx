const sources = {
  ok: "/sounds/ok.mp3",
  alert: "/sounds/alert.mp3",
  login: "/sounds/login.mp3",
  logout: "/sounds/logout.mp3",
};

const useSounds = function () {
  const play = async function (type: keyof typeof sources) {
    const audio = new Audio(sources[type]);
    if (!audio) return;
    audio.volume = 0.3;
    audio.currentTime = 0;
    audio.play().catch(() => {});
    return;
  };

  return play;
};

export default useSounds;
