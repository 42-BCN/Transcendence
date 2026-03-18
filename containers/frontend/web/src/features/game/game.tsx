'use client'

import { useRef, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { MapControls, OrthographicCamera } from "@react-three/drei";
import type { pos, parse_entity, tile } from "./maps";
import { testMap, parseMap } from "./maps";
import { useGame } from "./store";
import { Button } from "@components/controls/button"

const s = 0.975;

// no hace falta reiniciar active,
// active se destruye cuando ret null
function AbButtons() {
  const getSel = useGame((state) => state.getSel);
  const ent = getSel();
  const selectAbility = useGame((state) => state.selectAbility);

  return (
    <div className="absolute bottom-[70px] left-[20%] z-10 flex gap-4">
      {ent?.abilities.map(ability => (
        <Button
          key={ability}
          onPress={() => selectAbility(ability)}
        >
          {ability}
        </Button>
      ))}
    </div>
  )
}

function DiceButtons() {
  const getSel = useGame((state) => state.getSel);
  const ent = getSel();
  const movDice = useGame((state) => state.movDice);
  return (
    <div className="absolute bottom-[45px] left-[20%] z-10 flex gap-4">
      {ent?.dice.map((diceNum, i) => (
        <Button
          key={i}
          onPress={() => movDice(diceNum)}
        >
          {`d${diceNum}`}
        </Button>
      ))}
    </div>
  )
}

function HUD() {
  const typeEnt = useGame((state) => state.typeEnt);
  const canSelect = useGame((state) => state.selectedEnt);
  return (typeEnt !== 'player' || !canSelect ? null :
    <>
      <AbButtons />
      <DiceButtons />
    </>
  )
}

function Obstacle({ id, pos }: { id: string, pos: pos }) {
  const moveTo = useGame(state => state.moveTo);
  const isHighlighted = useGame(state => state.highlights[id]);
  const selectedAb = useGame((state) => state.selectedAb);
  const isSelectable = useGame((state) => state.selectables[id])
  let color = 'orange';
  if (isHighlighted && !selectedAb)
    color = 'hotpink';
  else if (isSelectable)
    color = 'red';

  return (
    <mesh
      position={[pos.x, pos.y, pos.z]}
      onClick={(event) => {
        event.stopPropagation();
        moveTo(id).catch(console.error);
      }}>
      <boxGeometry args={[s, s, s]} />
      <meshStandardMaterial
        color={color}
        wireframe={false}
      />
    </mesh>
  );
}

function Enemy({ id, pos }: { id: string, pos: pos }) {
  const eRef = useRef(null);
  const selectEntity = useGame(state => state.selectEntity)
  const selected = useGame(state => state.selectedEnt);
  const canSelect = useGame(state => state.canSelect);
  return (
    <mesh
      position={[pos.x, pos.y, pos.z]}
      ref={eRef}
      onClick={(event) => {
        event.stopPropagation();
        if (canSelect)
          selectEntity(id);
      }}
    >
      <boxGeometry args={[s, s, s]} />
      <meshStandardMaterial color={selected === id ? "gray" : "violet"} />
    </mesh>
  );
}

function Player({ id, pos }: { id: string, pos: pos }) {
  const pRef = useRef(null);
  const selectEntity = useGame(state => state.selectEntity);
  const selected = useGame(state => state.selectedEnt);
  const canSelect = useGame(state => state.canSelect);
  return (
    <mesh
      position={[pos.x, pos.y, pos.z]}
      ref={pRef}
      onClick={(event) => {
        event.stopPropagation();
        if (canSelect)
          selectEntity(id);
      }}
    >
      <boxGeometry args={[s, s, s]} />
      <meshStandardMaterial color={
        selected === id ? "white" : "blue"} />
    </mesh>
  );
}

function Floor({ id, pos }: { id: string, pos: pos }) {
  const moveTo = useGame(state => state.moveTo)
  const isHighlighted = useGame((state) => state.highlights[id]);
  const selectedAb = useGame((state) => state.selectedAb);
  const isSelectable = useGame((state) => state.selectables[id])
  let color = 'green';
  if (isHighlighted && !selectedAb)
    color = 'hotpink';
  else if (isSelectable)
    color = 'red';

  return (
    <mesh
      position={[pos.x, pos.y, pos.z]}
      receiveShadow
      onClick={(event) => {
        event.stopPropagation()
        moveTo(id).catch(console.error)
      }
      }>
      <boxGeometry args={[s, 0.5 * s, s]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function GridFloor() {
  const tiles = [];

  for (let z = 0; z < 10; ++z) {
    for (let x = 0; x < 10; ++x) {
      const key = `${x},${-1},${z}`
      tiles.push(
        <Floor
          key={key}
          id={key}
          pos={{ x: x - 5, y: -0.25, z: z - 5 }}
        />
      );
    }
  }
  return (
    <group>
      {tiles}
    </group>
  )
}


function Scene() {
  const map = testMap;
  const { info } = useMemo(() => parseMap(map), [map]);
  const { tiles, entities, width, height, depth }: {
    tiles: tile[],
    entities: parse_entity[], width: number, height: number, depth: number
  } = info;

  const init = useGame((state) => state.init);
  const players = useGame((state) => state.players);
  const enemies = useGame((state) => state.enemies);

  useEffect(() => { init(entities, tiles, { width, height, depth }) },
    [entities, tiles, width, height, depth]);
  return (
    <>
      <ambientLight intensity={Math.PI / 4} />
      <pointLight position={[7, 6, 7]} decay={0} intensity={2.5} />
      <OrthographicCamera
        makeDefault
        position={[5, 5, 5]}
        zoom={25}
        near={-50}
        far={100}
      />
      <MapControls
        makeDefault
        target={[0, 0, 0]}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={0}
      />
      {tiles.map((t) => (
        <Obstacle
          key={t.id}
          id={t.id}
          pos={{
            x: t.position.x - 5,
            y: t.position.y + 0.5,
            z: t.position.z - 5
          }}
        />
      ))}
      {Object.values(players).map((p) => (
        <Player
          key={p.id}
          id={p.id}
          pos={{
            x: p.position.x - 5,
            y: p.position.y + 0.5,
            z: p.position.z - 5
          }}
        />
      ))}
      {Object.values(enemies).map((e) => (
        <Enemy
          key={e.id}
          id={e.id}
          pos={{
            x: e.position.x - 5,
            y: e.position.y + 0.5,
            z: e.position.z - 5
          }}
        />
      ))}
      <GridFloor />
    </>
  );
}

export function Game() {
  // <div
  //   style={{
  //     height: "98vh",
  //     width: "95vm",
  //     background: "black",
  //     position: "relative",
  //     overflow: "hidden"
  //   }}
  return (
    <div className="h-[98vh] w-[95vw] bg-black relative overflow-hidden">
      <Canvas>
        <Scene />
      </Canvas>
      <HUD />
    </div>
  )
}
