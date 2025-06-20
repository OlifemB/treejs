import {Canvas, useLoader} from '@react-three/fiber';
import {Physics, useBox, usePlane} from '@react-three/cannon';
import {OrbitControls, useGLTF} from '@react-three/drei';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

function Box(props) {
  const [ref] = useBox(() => ({mass: 1, position: [0, 5, 0], ...props}));
  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]}/>
      <meshStandardMaterial color="orange"/>
    </mesh>
  );
}

function Plane(props) {
  const [ref] = usePlane(() => ({rotation: [-Math.PI / 2, 0, 0], ...props}));
  return (
    <mesh ref={ref}>
      <planeGeometry args={[100, 100]}/>
      <meshStandardMaterial color="gray"/>
    </mesh>
  );
}


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
        {/*  <Box />*/}
        {/*  <Box position={[1, 6, 0]} />*/}
        {/*  <Plane />*/}
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