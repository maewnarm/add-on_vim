// @ts-nocheck
import React, { useRef } from "react";
import { useGLTF, useAnimations, CycleRaycast } from "@react-three/drei";
import { useState } from "react";

export default function Machine(props: any) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/basic animation.glb");
  const { actions } = useAnimations(animations, group);
  const { unitNo } = props;

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group raycast={() => null} position={[0, 1.68, 0.98]} scale={0.33}>
          <group />
          <mesh
            raycast={() => null}
            castShadow
            receiveShadow
            geometry={nodes.Cube001.geometry}
            material={nodes.Cube001.material}
            position={[0, 0, -0.04]}
            scale={[0.51, 0.15, 0.68]}
          />
        </group>
        <mesh
          name={unitNo}
          castShadow
          receiveShadow
          geometry={nodes.Cube.geometry}
          material={materials.Material}
          position={[0, 1.51, 0]}
          scale={[0.8, 1.5, 1.2]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/basic animation.glb");
