import {Canvas} from '@react-three/fiber';
import {Physics} from '@react-three/cannon';
import {OrbitControls, useGLTF} from '@react-three/drei';

function Model() {
  const {scene} = useGLTF('/objects/forest_house/scene.gltf');
  return <primitive object={scene} scale={20} rotation={[0, 1.6, 0]} position={[0, -1, 0]}/>;
}

function Scene() {
  return (
    <Canvas className={'w-screen h-screen'}>
      <ambientLight intensity={0.5}/>
      <pointLight position={[10, 10, 10]}/>
      <Physics>
        <Model/>
      </Physics>
      <OrbitControls
        minPolarAngle={Math.PI / 4}   // 45° вниз
        maxPolarAngle={Math.PI / 2}   // 90° (горизонтально)
        minAzimuthAngle={-Math.PI / 4} // -45° влево
        maxAzimuthAngle={Math.PI / 4}  // +45° вп
      />
    </Canvas>
  );
}

export default Scene;