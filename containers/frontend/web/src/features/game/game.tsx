'use client'

import { useRef, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { MapControls, OrthographicCamera } from "@react-three/drei";
import type { pos, parse_entity, tile } from "./maps";
import { testMap, parseMap } from "./maps";
import { useGame } from "./store";
import { Button } from "@components/controls/button"
import { Meter } from "@components/composites/meter"
import { Stack } from "@components/primitives/stack";

const s = 0.975;

// no hace falta reiniciar active,
// active se destruye cuando ret null
function AbButtons() {
  const getSel = useGame((state) => state.getSel);
  const ent = getSel();
  const selectAbility = useGame((state) => state.selectAbility);

  return (
    <div className="z-10 bottom-[10%] left-[20%] flex gap-4">
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
  const ability = useGame((state) => state.selectedAb);
  const selectDice = useGame((state) => state.selectAbDice);
  return (
    <div className="z-10 bottom-[10%] left-[20%] flex gap-4">
      {ent?.dice.map((diceNum, i) => (
        <Button
          key={i}
          onPress={() => ability ? selectDice(diceNum) : movDice(diceNum)}
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
  const getSel = useGame((state) => state.getSel);
  const ent = getSel();
  if (!ent)
    return;
  return (typeEnt !== 'player' || !canSelect ? null :
    <Stack className="absolute bottom-4 left-4">
      <AbButtons />
      <div>
        <Meter label="HP" value={ent.hp - 8}
          maxValue={ent.maxHp}
          max={ent.maxHp}
          formatOptions={{ style: "decimal" }} />
      </div>
      <DiceButtons />
    </Stack>
  )
}

function Obstacle({ id, pos }: { id: string, pos: pos }) {
  const moveTo = useGame(state => state.moveTo);
  const isHighlighted = useGame(state => state.highlights[id]);
  const selectedAb = useGame((state) => state.selectedAb);
  const isSelectable = useGame((state) => state.selectables[id])
  const [isHovered, setHover] = useState(false);
  let color = 'orange';
  if (id.split(',')[1] === "0")
    color = 'green';
  else if (id.split(',')[1] === "3")
    color = 'slategray'
  if (isHighlighted && !selectedAb)
    color = 'hotpink';
  else if (isSelectable)
    color = 'red';
  else if (isHovered)
    color = "lightgray";
  if (color === 'hotpink' && isHovered)
    color = 'lightpink';
  return (
    <mesh
      position={[pos.x, pos.y, pos.z]}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHover(true);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        setHover(false);
      }}
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
  const [isHovered, setHover] = useState(false);
  let color = "violet";
  if (selected)
    color = "lightpink";
  else if (isHovered)
    color = "lightgray";

  return (
    <mesh
      position={[pos.x, pos.y, pos.z]}
      ref={eRef}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHover(true);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        setHover(false);
      }}
      onClick={(event) => {
        event.stopPropagation();
        if (canSelect)
          selectEntity(id);
      }}
    >
      <boxGeometry args={[s, s, s]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Player({ id, pos }: { id: string, pos: pos }) {
  const pRef = useRef(null);
  const selectEntity = useGame(state => state.selectEntity);
  const selected = useGame(state => state.selectedEnt);
  const canSelect = useGame(state => state.canSelect);
  const isTarget = useGame(state => state.selectables[id]);
  const [isHovered, setHover] = useState(false);

  let color = (selected === id ? "white" : "blue");
  if (isTarget)
    color = "red";
  else if (isHovered)
    color = "lightblue";

  return (
    <mesh
      position={[pos.x, pos.y, pos.z]}
      ref={pRef}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHover(true);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        setHover(false);
      }}
      onClick={(event) => {
        event.stopPropagation();
        if (canSelect)
          selectEntity(id);
      }}
    >
      <boxGeometry args={[s, s, s]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
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
        zoom={50}
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
            y: t.position.y - 1,
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
            y: p.position.y - 1,
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
            y: e.position.y - 1,
            z: e.position.z - 5
          }}
        />
      ))}
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
    <div className="h-[100vh] w-[100vw] bg-white relative overflow-hidden">
      <HUD />
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  )
}
