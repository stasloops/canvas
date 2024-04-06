import React, { FC } from "react";
import animationData from "./assets/helicopter.json";
import { Html } from "react-konva-utils";
import Lottie from "react-lottie";
import { Layer } from "react-konva";

interface AnimationProps {
  x: number;
  y: number;
}

const Animation: FC<AnimationProps> = ({ x, y }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  console.log("render");

  return (
    <Layer x={x} y={y}>
      <Html>
        <Lottie options={defaultOptions} height={100} width={100} />
      </Html>
    </Layer>
  );
};

export default React.memo(Animation);
