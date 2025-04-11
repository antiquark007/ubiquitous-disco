import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { XYZLoader } from 'three-stdlib';

function XYZBackground() {
  const { scene, camera, gl } = useThree();
  const pointsRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    const loader = new XYZLoader();
    loader.load('/models/xyz/helix_201.xyz', (geometry) => {
      geometry.center();

      const vertexColors = geometry.hasAttribute('color');
      const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: vertexColors,
      });

      const points = new THREE.Points(geometry, material);
      pointsRef.current = points;
      scene.add(points);
    });

    camera.position.set(10, 7, 10);
    camera.lookAt(scene.position);

    const animate = () => {
      if (pointsRef.current) {
        pointsRef.current.rotation.x += 0.002;
        pointsRef.current.rotation.y += 0.005;
      }
      gl.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (pointsRef.current) {
        scene.remove(pointsRef.current);
      }
    };
  }, [scene, camera, gl]);

  return null;
}

export function ThreeScene() {
  return (
    <Canvas className="absolute top-0 left-0 -z-10">
      <ambientLight intensity={0.5} />
      <XYZBackground />
    </Canvas>
  );
}