import { Stage, Layer, Rect } from "react-konva";
import "./App.css";
import { useState, useEffect, useCallback, useRef } from "react";
import Konva from "konva";
import Animation from "./Animation";
import { Html } from "react-konva-utils";
import animationData from "./assets/helicopter.json";
import Lottie from "react-lottie";

function App() {
  const [mapItems, setMapItems] = useState([]);

  useEffect(() => {
    const ROW = 15;

    function fn(a, b) {
      return Math.floor(a / b);
    }

    const fn2 = (number) => {
      return number % ROW;
    };

    const arr = [];
    for (let i = 1; i < 100; i++) {
      const y = 100 * fn(i, ROW);
      const x = 100 * fn2(i);

      arr.push({ x: x, y: y });
    }

    setMapItems(arr);
  }, []);

  const stageRef = useRef<Konva.Stage>(null);
  const [zoom, setZoom] = useState({
    scale: 1,
    inverseScale: 1,
    y: window.innerWidth / 6,
    x: window.innerHeight / 3,
    x2: 0,
    y2: 0,
  });

  const moveBackground = useCallback(
    (e: Konva.KonvaEventObject<DragEvent | WheelEvent>) => {
      e.evt.preventDefault();

      const stage = e.currentTarget as Konva.Stage;
      const position = stage.position();
      const container = stage.getContent().parentElement?.parentElement;

      if (!container) return;
      setZoom((prev) => ({
        ...prev,
        x2: e.currentTarget.attrs.x,
        y2: e.currentTarget.attrs.y,
      }));
      container.style.backgroundPosition = `${position.x}px ${position.y}px`;
    },
    []
  );

  useEffect(() => {
    const stage = stageRef.current as Konva.Stage;
    const container = stage?.getContent().parentElement?.parentElement;

    if (!container) return;

    container.style.backgroundPosition = `${0}px ${0}px`;
  }, []);

  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    const scaleBackground = (scale: number, x: number, y: number) => {
      const stage = stageRef.current as Konva.Stage;

      const container = stage.getContent().parentElement?.parentElement;

      if (!container) return;

      const backgroundSize = 30;
      container.style.backgroundSize = `${backgroundSize * scale}px ${
        backgroundSize * scale
      }px`;
      container.style.backgroundPosition = `${x}px ${y}px`;
    };

    e.evt.preventDefault();
    const stage: any = e.currentTarget as Konva.Stage;
    const scaleBy = 1.1;
    const oldScale = stage.scaleX();

    if (!stage) {
      return;
    }

    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    const newX =
      -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale;
    const newY =
      -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale;
    if (newScale < 0.2 || newScale > 2) {
      return;
    }
    const inverseScale = 1 / newScale;
    scaleBackground(newScale, newX, newY);
    setZoom((prev) => ({
      ...prev,
      scale: newScale,
      inverseScale: inverseScale,
      x: newX,
      y: newY,
      x2: e.currentTarget.attrs.x,
      y2: e.currentTarget.attrs.y,
    }));
  }, []);

  const onWheel = (e) => {
    requestAnimationFrame(handleWheel(e), moveBackground(e));
  };

  const onDragMove = (e) => {
    requestAnimationFrame(moveBackground(e));
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="stage">
      <Stage
        ref={stageRef}
        draggable={true}
        width={window.innerWidth}
        height={window.innerHeight}
        scaleX={zoom.scale}
        scaleY={zoom.scale}
        x={zoom.x}
        y={zoom.y}
        onWheel={onWheel}
        onDragMove={onDragMove}
      >
        <Layer>
          <Rect fill="red" x={10} y={10} width={50} height={50} />
        </Layer>

        {mapItems.map((item: any) => (
          <Animation x={item.x} y={item.y} />
        ))}
      </Stage>
    </div>
  );
}

export default App;
