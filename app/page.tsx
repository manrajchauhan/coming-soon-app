"use client"
import Image from "next/image";
import { useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const COUNTDOWN_FROM = "2024-09-01";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const ShiftingCountdown = () => {
  return (
    <main className="flex flex-col items-center justify-between p-24 ">
    <div className="z-10 w-full max-w-6xl items-center justify-between font-mono text-sm lg:flex">
      <Image
        src="/brand.svg"
        alt="brand Logo"
        width={200}
        height={24}
        priority
      />
        <h1>Equiflex Private Limited </h1>
    </div>
    <div className="mt-20">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-20 text-center ">
        <CountdownItem unit="Day" text="days" />
        <CountdownItem unit="Hour" text="hours" />
        <CountdownItem unit="Minute" text="minutes" />
        <CountdownItem unit="Second" text="seconds" />
      </div>
    </div>
    <div className="mt-20">
        <h1 className="text-2xl font-semibold text-[#22b1ad] text-center">
        Something Awesome Is on Its Way!
          <br />
          <span className="text-4xl md:text-[6rem] font-bold mt-1 text-center leading-none text-black">
          COMING SOON
          </span>
        </h1>
      </div>

    </main>
  );
};

interface CountdownItemProps {
  unit: "Day" | "Hour" | "Minute" | "Second";
  text: string;
}

const CountdownItem: React.FC<CountdownItemProps> = ({ unit, text }) => {
  const { ref, time } = useTimer(unit);

  return (

      <div className="flex h-24 w-1/4 flex-col items-center justify-center gap-1 border-r-[1px] border-slate-200 font-mono md:h-36 md:gap-2 p-4">
        <div className="relative w-full overflow-hidden text-center">
          <span
            ref={ref}
            className="block text-2xl font-medium text-[#22b1ad] md:text-4xl lg:text-6xl xl:text-7xl"
          >
            {time}
          </span>
        </div>
        <span className="text-xs font-light text-neutral-500 md:text-sm lg:text-base">
          {text}
        </span>
      </div>
  );
};

export default ShiftingCountdown;

const useTimer = (unit: "Day" | "Hour" | "Minute" | "Second") => {
  const [ref, animate] = useAnimate();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeRef = useRef<number>(0);

  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    intervalRef.current = setInterval(handleCountdown, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleCountdown = async () => {
    const end = new Date(COUNTDOWN_FROM);
    const now = new Date();
    const distance = +end - +now;

    let newTime = 0;

    if (unit === "Day") {
      newTime = Math.floor(distance / DAY);
    } else if (unit === "Hour") {
      newTime = Math.floor((distance % DAY) / HOUR);
    } else if (unit === "Minute") {
      newTime = Math.floor((distance % HOUR) / MINUTE);
    } else {
      newTime = Math.floor((distance % MINUTE) / SECOND);
    }

    if (newTime !== timeRef.current) {
      // Exit animation
      await animate(
        ref.current,
        { y: ["0%", "-50%"], opacity: [1, 0] },
        { duration: 0.35 }
      );

      timeRef.current = newTime;
      setTime(newTime);

      // Enter animation
      await animate(
        ref.current,
        { y: ["50%", "0%"], opacity: [0, 1] },
        { duration: 0.35 }
      );
    }
  };

  return { ref, time };
};
