// @ts-nocheck
import React, { Suspense, useContext, useEffect, useState } from "react";
import { Bounds, CycleRaycast, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  EffectComposer,
  Outline,
  Selection,
  Select,
} from "@react-three/postprocessing";
import Machine from "@/components/objects/machine";
import { HighlightTarget } from "@/types/canvas";
import Menu from "./menu";
import { OperationContext } from "./operation";

const CanvasObject = () => {
  const { project_id } = useContext(OperationContext);
  const [{ objects, cycle }, setObject] = useState({ objects: [], cycle: 0 });
  const [highlightTarget, setHighlightTarget] = useState<HighlightTarget>({});
  const [menuTarget, setMenuTarget] = useState<number>();

  useEffect(() => {
    // console.log(objects, cycle);
    if (objects.length > 0) {
      setHighlightTarget({ [objects[cycle]?.object.name]: true });
      setMenuTarget(objects[cycle]?.object.name);
    }
  }, [objects, cycle]);

  return (
    <>
      <Menu targetId={menuTarget} />
      <Canvas orthographic camera={{ position: [-3, 3, 3], zoom: 30 }}>
        <Suspense fallback={<p> Loading ...</p>}>
          <OrbitControls
            makeDefault
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 4}
            enableZoom={true}
            zoomSpeed={0.3}
          />
          <ambientLight intensity={0.1} />
          <directionalLight color={"white"} position={[0, 10, 10]} />
          <Selection>
            <EffectComposer multisampling={0} autoClear={false}>
              <Outline
                visibleEdgeColor={"white"}
                hiddenEdgeColor={"white"}
                blur
                edgeStrength={1}
              />
            </EffectComposer>
            <Bounds fit clip observe margin={1}>
              <Select enabled={highlightTarget["1"]} onClick={() => null}>
                <Machine position={[-0.5, 0, 1]} unitNo={1} />
              </Select>
              <Select enabled={highlightTarget["2"]} onClick={() => null}>
                <Machine position={[1.2, 0, 1]} unitNo={2} />
              </Select>
            </Bounds>
          </Selection>
          <CycleRaycast
            preventDefault={false}
            onChanged={(objects, cycle) => setObject({ objects, cycle })}
          />
        </Suspense>
      </Canvas>
    </>
  );
};

export default CanvasObject;
