import {Canvas, type ThreeElements, useFrame} from '@react-three/fiber';
import {Physics} from '@react-three/cannon';
import {OrbitControls, useGLTF} from '@react-three/drei';
import {useEffect, useRef} from "react";
import {EffectComposer, Bloom, DepthOfField, SSAO} from '@react-three/postprocessing';
import {DoubleSide, Mesh, PointLight} from "three";
import {BlendFunction} from 'postprocessing';
import * as THREE from 'three';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { OrbitControls as OrbitControlsImpl } from 'three/examples/jsm/controls/OrbitControls'

function AnimatedLight() {
  const light = useRef<PointLight>(null!);
  useFrame(({clock}) => {
    light.current.position.x = Math.sin(clock.getElapsedTime()) * 5;
  });
  return <pointLight ref={light} position={[0, 5, 0]} intensity={100}/>;
}

function Model(props: ThreeElements['mesh']) {
  const {scene} = useGLTF('/objects/forest_house/scene.gltf');
  useEffect(() => {
    scene.traverse((obj) => {
      if (obj instanceof Mesh) {
        const mat = obj.material;
        if (mat.transparent) {
          mat.alphaTest = 0.5;          // скрываем пиксели с низким альфа
          mat.depthWrite = true;        // чтобы правильно рисовалось по глубине
          mat.transparent = false;      // отключаем прозрачность как флаг
          mat.side = DoubleSide; // если нужно видеть и сзади
        }
      }
    });
  }, [scene]);


  return (
    <primitive
      object={scene}
      rotation={[0, 1.6, 0]}
      position={[0, -1.5, 0]}
      scale={16}
      {...props}
    />
  )
}

const TextBlock = () => {
  return (
    <div className={'absolute right-10 top-10 px-8 py-4 rounded-sm bg-black/50 backdrop-blur-2xl text-white'}>
      v.0.0.1
    </div>
  )
}

function Scene() {
  return (
    <>
      <ambientLight/>
      <pointLight position={[10, 10, 10]}/>
      <AnimatedLight/>

      <Physics>
        <Model/>
      </Physics>

      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.5}
          luminanceSmoothing={0.3}
          blendFunction={BlendFunction.ADD}
        />

        <DepthOfField
          focusDistance={0.02}  // 0 = ближайшая точка, 1 = бесконечность
          focalLength={0.5}     // "сила" фокусировки
          bokehScale={1}        // интенсивность размытия
          height={1200}         // качество (больше = чётче, но тяжелее)
        />

        <SSAO
          samples={31}          // качество
          radius={0.15}
          intensity={20}
          luminanceInfluence={0.5}
        />
      </EffectComposer>
    </>
  );
}

function CameraController() {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const target = controls.target;

    // Ограничения позиции цели (в world units)
    target.x = THREE.MathUtils.clamp(target.x, -2, 2);
    target.y = THREE.MathUtils.clamp(target.y, -1, 1);
    target.z = THREE.MathUtils.clamp(target.z, -10, 10);

    // Можно также ограничить позицию самой камеры, если нужно:
    // camera.position.x = THREE.MathUtils.clamp(camera.position.x, -5, 5);

    controls.update(); // обязательно после изменения target
  });

  return (
    <OrbitControls
      minPolarAngle={Math.PI / 4}   // 45° вниз
      maxPolarAngle={Math.PI / 2}   // 90° (горизонтально)
      // minAzimuthAngle={-Math.PI / 4} // -45° влево
      // maxAzimuthAngle={Math.PI / 4}  // +45° вправо
      minDistance={3}   // минимальное приближение
      maxDistance={8}  // максимальное отдаление
    />
  )
    ;
}

const App = () => {
  return (
    <>
      <Canvas camera={{fov: 50}}>
        <Scene/>
        <CameraController/>
      </Canvas>

      <TextBlock/>
    </>
  )
}

export default App;