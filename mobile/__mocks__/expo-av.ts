export const Audio = {
  Sound: {
    createAsync: jest.fn(() =>
      Promise.resolve({
        sound: {
          playAsync: jest.fn(() => Promise.resolve()),
          unloadAsync: jest.fn(() => Promise.resolve()),
          setOnPlaybackStatusUpdate: jest.fn(),
        },
        status: { isLoaded: true },
      })
    ),
  },
  setAudioModeAsync: jest.fn(() => Promise.resolve()),
};

export const Video = {};
export const AVPlaybackStatus = {};
