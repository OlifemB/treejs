import {Canvas, type ThreeElements} from '@react-three/fiber';
import {Physics} from '@react-three/cannon';
import {CameraControls, Environment, Lightformer, Sky, Stars, useGLTF} from '@react-three/drei';
import {useEffect} from "react";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  SSAO,
  Vignette,
  SMAA,
  Scanline,
  ChromaticAberration, HueSaturation, BrightnessContrast, ToneMapping
} from '@react-three/postprocessing';
import {DoubleSide, Mesh} from "three";
import {BlendFunction} from 'postprocessing';

//Html from drei

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
      scale={30}
      {...props}
    />
  )
}

const TextBlock = () => {
  return (
    <div className={'absolute left-10 bottom-10 px-8 py-4 rounded-sm bg-black/50 backdrop-blur-2xl text-white text-xs'}>
      <b>v 0.0.3</b>
      <br/>
      <ul>
        <li>EffectComposer</li>
        <li>- SSAO</li>
        <li>- DepthOfField</li>
        <li>- Bloom</li>
        <li>- Vignette</li>
        <li>- SMAA</li>
        <li>- Scanline</li>
        <li>- ChromaticAberration</li>
        <li>- BrightnessContrast</li>
        <li>- HueSaturation</li>
      </ul>
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

      <Environment
        preset={'forest'}
        files={'/hdr/monks_forest_2k.hdr'}
        background
        blur={0.3}
      />

      {/*<Environment>*/}
      {/*  <Lightformer intensity={4}  position={[0,5,-5]}/>*/}
      {/*</Environment>*/}

      <Stars radius={100} depth={30} count={1000} factor={4}/>

      <EffectComposer>
        <SSAO
          samples={31}
          radius={0.15}
          intensity={20}
          luminanceInfluence={0.9}
        />

        <DepthOfField
          focusDistance={0.3}
          focalLength={0.5}
          bokehScale={1}
          height={1200}
        />

        <Bloom
          intensity={0.1}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.3}
          blendFunction={BlendFunction.SCREEN}
        />

        {/*<Sky sunPosition={[0, 0.01, 0]}/>*/}

        <BrightnessContrast brightness={0.1} contrast={0.4}/>

        <HueSaturation hue={0.1} saturation={0.1}/>

        <ChromaticAberration offset={[0.002, 0.002]}/>

        <Scanline density={0.2} opacity={0.03}/>

        <Vignette
          offset={0.1}
          darkness={1}
          eskil={false} // Классическая виньетка
          blendFunction={BlendFunction.NORMAL}
        />

        {/*<ToneMapping mode={ToneMappingMode.REINHARD} /> //import ToneMappingMode*/}

        <SMAA/>

      </EffectComposer>
    </>
  );
}

const App = () => {
  return (
    <>
      <Canvas
        // orthographic
        dpr={[1, 2]}
        shadows
        camera={{
          fov: 120,
          near: 0.1,
          far: 200,
          position: [0, 2, 5]
        }}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
          powerPreference: "high-performance"
        }}
      >
        <Scene/>

        <CameraControls
          minPolarAngle={Math.PI / 6}   // 45° вниз
          maxPolarAngle={Math.PI / 2 + 0.15}   // 90° (горизонтально)
          // minAzimuthAngle={-Math.PI / 4} // -45° влево
          // maxAzimuthAngle={Math.PI / 4}  // +45° вправо
          minDistance={2}   // минимальное приближение
          maxDistance={5}  // максимальное отдаление
        />
      </Canvas>

      <TextBlock/>
    </>
  )
}

export default App;