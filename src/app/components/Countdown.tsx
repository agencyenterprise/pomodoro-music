import debounce from 'lodash.debounce';
import { RefObject, useRef, useState } from 'react';
import ReactCountdown from 'react-countdown';

const DEFAULT_TIME = 1_500_000;

export default function Countdown({ setPlayMusic }: { setPlayMusic: (value: boolean) => void }) {
  const countdownRef = useRef<ReactCountdown>(null);
  const focusTimeRef = useRef<HTMLInputElement>(null);
  const pauseTimeRef = useRef<HTMLInputElement>(null);
  const [date, setDate] = useState(Date.now() + DEFAULT_TIME);
  const [focusInterval, setFocusInterval] = useState(25);
  const [pauseInterval, setPauseInterval] = useState(5);
  const [playing, setPlaying] = useState(false);
  const [state, setState] = useState<'focus' | 'pause'>('focus');

  const renderer = ({ minutes, seconds }) => {
    const formated = `${minutes.toString().padStart(2, '0')}:${seconds < 10 ? '0' : ''}${seconds}`;
    return <span className="text-center text-9xl font-bold text-white">{formated}</span>;
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
    setPlayMusic(!playing);
  };

  const handleTick = (e) => {
    if (!playing) {
      setDate(Date.now() + e.total + 1000);
    }
  };

  const setIntervalTimer = (
    inputRef: RefObject<HTMLInputElement>,
    fromState: 'focus' | 'pause',
  ) => {
    if (!inputRef.current) return;

    let value = parseInt(inputRef.current?.value ?? '0', 10);
    if (value < 1) {
      value = 1;
    }
    if (value > 60) {
      value = 60;
    }
    fromState === 'focus' ? setFocusInterval(value) : setPauseInterval(value);
    if (state === fromState) {
      setDate(Date.now() + value * 60_000);
    }
  };

  return (
    <div className="pt-20 text-center">
      <h1 className="text-4xl font-bold">Pomodoro Music</h1>
      <ReactCountdown
        ref={countdownRef}
        date={date}
        renderer={renderer}
        onTick={handleTick}
        onComplete={() => {
          const api = countdownRef.current?.getApi();
          let time = focusInterval;
          if (state === 'focus') {
            setState('pause');
            setPlayMusic(false);
            time = pauseInterval;
          } else {
            setState('focus');
            setPlayMusic(true);
          }
          setDate(Date.now() + time * 60_000);
          api?.start();
        }}
      />
      <div>
        <h4>
          Plays your favorite playlist for{' '}
          <input
            ref={focusTimeRef}
            type="number"
            className="w-14 rounded-md border border-gray-300 bg-white p-2 text-base text-gray-600"
            defaultValue={focusInterval}
            onChange={debounce(() => {
              setIntervalTimer(focusTimeRef, 'focus');
            }, 300)}
          />{' '}
          minutes and stops{' '}
          <input
            ref={pauseTimeRef}
            type="number"
            className="w-14 rounded-md border border-gray-300 bg-white p-2 text-base text-gray-600"
            defaultValue={pauseInterval}
            onChange={debounce(() => {
              setIntervalTimer(pauseTimeRef, 'pause');
            }, 300)}
          />{' '}
          minutes so you can take a break.
        </h4>
      </div>

      <div className="container mx-auto">
        <img
          src={playing ? '/pause.png' : 'play.png'}
          alt="Play / Pause"
          onClick={handlePlayPause}
          height="80"
          className="mx-auto cursor-pointer"
        />
      </div>
    </div>
  );
}
