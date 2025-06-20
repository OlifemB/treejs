import {Canvas, type ThreeElements} from '@react-three/fiber';
import {Physics} from '@react-three/cannon';
import {OrbitControls, useGLTF} from '@react-three/drei';
import {useEffect} from "react";
import {EffectComposer, Bloom, DepthOfField, SSAO, Vignette, SMAA} from '@react-three/postprocessing';
import {DoubleSide, Mesh} from "three";
import {BlendFunction} from 'postprocessing';

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
      position={[0, -1, 0]}
      scale={25}
      {...props}
    />
  )
}

const TextBlock = () => {
  return (
    <div className={'absolute right-10 top-10 px-8 py-4 rounded-sm bg-black/50 backdrop-blur-2xl text-white'}>
      v.0.0.2
    </div>
  )
}

function Scene() {
  return (
    <>
      <ambientLight/>
      <pointLight position={[10, 10, 10]}/>

      <Physics>
        <Model/>
      </Physics>

      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.5}
          luminanceSmoothing={0.3}
          blendFunction={BlendFunction.ADD}
        />

        <DepthOfField
          focusDistance={0.02}  // 0 = ближайшая точка, 1 = бесконечность
          focalLength={1}     // "сила" фокусировки
          bokehScale={1}        // интенсивность размытия
          height={1200}         // качество (больше = чётче, но тяжелее)
        />

        <SSAO
          samples={31}          // качество
          radius={0.35}
          intensity={20}
          luminanceInfluence={0.5}
        />

        <Vignette
          offset={0.5} // Смещение виньетки
          darkness={0.6} // Затемнение краев
          eskil={false} // Классическая виньетка
          blendFunction={BlendFunction.NORMAL}
        />

        <SMAA />
      </EffectComposer>
    </>
  );
}

const App = () => {
  return (
    <>
      <Canvas
        shadows
        camera={{fov: 120}}
        gl={{ antialias: false }}
      >
        <Scene/>

        <OrbitControls
          minPolarAngle={Math.PI / 4}   // 45° вниз
          maxPolarAngle={Math.PI / 2}   // 90° (горизонтально)
          // minAzimuthAngle={-Math.PI / 4} // -45° влево
          // maxAzimuthAngle={Math.PI / 4}  // +45° вправо
          minDistance={3}   // минимальное приближение
          maxDistance={8}  // максимальное отдаление
        />
      </Canvas>

      <TextBlock/>
    </>
  )
}

export default App;