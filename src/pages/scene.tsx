import {Canvas, type ThreeElements, useFrame} from '@react-three/fiber';
import {Physics} from '@react-three/cannon';
import {OrbitControls, useGLTF} from '@react-three/drei';
import {useEffect, useRef} from "react";
import {EffectComposer, Bloom, DepthOfField, SSAO} from '@react-three/postprocessing';
import {DoubleSide, PointLight} from "three";
import {BlendFunction} from 'postprocessing';

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
      if (obj?.isMesh) {
        const mat = obj?.material;
        if (mat.transparent) {
          console.log(1)
          // Исправляем поведение прозрачности
          mat.depthWrite = false; // отключаем запись в Z-буфер
          mat.alphaTest = 0.5;    // скрываем пиксели ниже порога прозрачности
          mat.side = DoubleSide; // если нужно видеть и сзади
          mat.alphaTes =0.5;
        }
      }
    });
  }, [scene]);

  return (
    <primitive
      {...props}
      object={scene}
      rotation={[0, 1.6, 0]}
      position={[0, -1.5, 0]}
      scale={16}
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
  const sunRef = useRef(null!);
  return (
    <>
      <ambientLight/>
      <pointLight position={[10, 10, 10]}/>
      <AnimatedLight/>

      <Physics>
        <Model ref={sunRef}/>
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
          samples={31} // качество
          radius={0.15}
          intensity={20}
          luminanceInfluence={0.5}
        />
      </EffectComposer>
    </>
  );
}

const App = () => {
  return (
    <>
      <Canvas camera={{fov: 50}}>
        <Scene/>
        <OrbitControls
          minPolarAngle={Math.PI / 4}   // 45° вниз
          maxPolarAngle={Math.PI / 2}   // 90° (горизонтально)
          // minAzimuthAngle={-Math.PI / 4} // -45° влево
          // maxAzimuthAngle={Math.PI / 4}  // +45° вправо
        />
      </Canvas>

      <TextBlock/>
    </>
  )
}

export default App;