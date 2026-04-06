'use client';

import { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { MapControls, OrthographicCamera } from '@react-three/drei';
import type { pos, parse_entity, tile } from './maps';
import { testMap, parseMap } from './maps';
import { useGame } from './store';
import { Button, Meter, Stack, Text } from '@components';
import { useTranslations } from 'next-intl';

const s = 0.975;

// no hace falta reiniciar active,
// active se destruye cuando ret null
function AbButtons() {
  const ent = useGame((state) => state.getSel());
  const selectAbility = useGame((state) => state.selectAbility);

  return (
    <div className="z-10 bottom-[10%] left-[20%] flex gap-4">
      {ent?.abilities.map((ability) => (
        <Button key={ability} onPress={() => selectAbility(ability)}>
          {ability}
        </Button>
      ))}
    </div>
  );
}

function DiceButtons() {
  const ent = useGame((state) => state.getSel());
  const canSelect = useGame((state) => state.canSelect);
  const movDice = useGame((state) => state.movDice);
  const ability = useGame((state) => state.selectedAb);
  const selectDice = useGame((state) => state.selectDice);
  return (
    <div className="z-10 bottom-[10%] left-[20%] flex gap-4">
      {ent?.usedDice.map((diceNum, i) => (
        <Button key={i} className={`px-4 py-2 bg-gray-500 text-white transition-all`}>
          {`d${diceNum}`}
        </Button>
      ))}
      {ent?.dice.map((diceNum, i) => (
        <Button
          key={i}
          onPress={() => (ability ? selectDice(diceNum) : movDice(diceNum))}
          className={`px-4 py-2 bg-blue-500 text-white transition-all
    ${!canSelect ? 'ring-4 ring-yellow-400 animate-pulse bg-yellow-500' : ''}`}
        >
          {`d${diceNum}`}
        </Button>
      ))}
    </div>
  );
}

function Reset() {
  const t = useTranslations('features.game');
  const selectedEnt = useGame((state) => state.selectedEnt);
  const history = useGame((state) => state.history);
  const resetHistory = useGame((state) => state.resetHistory);
  if (!history.find((h) => h.who === selectedEnt) || !selectedEnt) return null;
  return (
    <Button
      className="absolute z-10 top-8 left-8"
      variant="primary"
      w="default"
      onPress={() => resetHistory(selectedEnt)}
    >
      {t('resetPlan')}
    </Button>
  );
}

function EndTurn() {
  const t = useTranslations('features.game');
  const nextTurnStage = useGame((state) => state.changeTurnStage);
  const historyLength = useGame((state) => state.history.length);
  return historyLength === 4 ? (
    <Button
      className="absolute z-10 bottom-8 right-16"
      variant="primary"
      w="default"
      onPress={() => nextTurnStage()}
    >
      {t('endTurn')}
    </Button>
  ) : null;
}

function HUD() {
  const t = useTranslations('features.game');
  const typeEnt = useGame((state) => state.typeEnt);
  const canSelect = useGame((state) => state.selectedEnt);
  const ent = useGame((state) => state.getSel());
  return !ent || !canSelect ? null : (
    <>
      <Stack className="absolute left-8 bottom-4">
        <AbButtons />
        <div>
          <Meter
            label={t('healthLabel')}
            value={ent.hp}
            maxValue={ent.maxHp}
            max={ent.maxHp}
            formatOptions={{ style: 'decimal' }}
          />
        </div>
        <DiceButtons />
      </Stack>
      <Reset />
    </>
  );
}

function Obstacle({ id, pos }: { id: string; pos: pos }) {
  const moveClone = useGame((state) => state.moveClone);
  const isHighlighted = useGame((state) => state.highlights[id]);
  const selectedAb = useGame((state) => state.selectedAb);
  const isSelectable = useGame((state) => state.selectables[id]);
  const [isHovered, setHover] = useState(false);
  let color = 'orange';
  if (id.split(',')[1] === '0') color = 'green';
  else if (id.split(',')[1] === '3') color = 'slategray';
  if (isHighlighted && !selectedAb) color = 'hotpink';
  else if (isSelectable) color = 'red';
  else if (isHovered) color = 'lightgray';
  if (color === 'hotpink' && isHovered) color = 'lightpink';
  if (color === 'red' && isHovered) color = 'lightpink';
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
        moveClone(id);
      }}
    >
      <boxGeometry args={[s, s, s]} />
      <meshStandardMaterial color={color} wireframe={false} />
    </mesh>
  );
}

function Enemy({ id, pos }: { id: string; pos: pos }) {
  const eRef = useRef(null);
  const selectEntity = useGame((state) => state.selectEntity);
  const selected = useGame((state) => state.selectedEnt);
  const canSelect = useGame((state) => state.canSelect);
  const isTarget = useGame((state) => state.selectables[id]);
  const [isHovered, setHover] = useState(false);
  let color = selected === id ? 'lightpink' : 'violet';
  if (isTarget) color = 'red';
  else if (isHovered) color = 'lightgray';
  if (color === 'red' && isHovered) color = 'lightpink';

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
    >
      {/* onClick={(event) => { */}
      {/*   event.stopPropagation(); */}
      {/*   if (canSelect) */}
      {/*     selectEntity(id); */}
      {/* }} */}
      <boxGeometry args={[s, s, s]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Clone({ id, pos }: { id: string; pos: pos }) {
  const pRef = useRef(null);
  const selectEntity = useGame((state) => state.selectEntity);
  const selected = useGame((state) => state.selectedEnt);
  const selectedDice = useGame((state) => state.selectedDice);
  const selectedAb = useGame((state) => state.selectedAb);
  const canSelect = useGame((state) => state.canSelect);
  const addHistoryAbility = useGame((state) => state.addHistoryAbility);
  const isTarget = useGame((state) => state.selectables[id]);
  const [isHovered, setHover] = useState(false);

  let color = selected === id ? 'white' : 'cyan';
  if (isTarget) color = 'pink';
  else if (isHovered) color = 'lightblue';
  if (color === 'pink' && isHovered) color = 'lightpink';

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
        if (canSelect) selectEntity(id);
        else if (isTarget && selected && selectedDice && selectedAb)
          // ts errors
          addHistoryAbility(id);
      }}
    >
      <boxGeometry args={[s, s, s]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Player({ id, pos }: { id: string; pos: pos }) {
  const pRef = useRef(null);
  const selectEntity = useGame((state) => state.selectEntity);
  const selected = useGame((state) => state.selectedEnt);
  const canSelect = useGame((state) => state.canSelect);
  const addHistoryAbility = useGame((state) => state.addHistoryAbility);
  const isTarget = useGame((state) => state.selectables[id]);
  const [isHovered, setHover] = useState(false);

  let color = selected === id ? 'white' : 'blue';
  if (isTarget) color = 'pink';
  else if (isHovered) color = 'lightblue';
  if (color === 'pink' && isHovered) color = 'lightpink';

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
        if (canSelect) selectEntity(id);
        else if (isTarget)
          // ts errors
          addHistoryAbility(id);
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
  const {
    tiles,
    entities,
    width,
    height,
    depth,
  }: {
    tiles: tile[];
    entities: parse_entity[];
    width: number;
    height: number;
    depth: number;
  } = info;

  const init = useGame((state) => state.init);
  const players = useGame((state) => state.players);
  const clones = useGame((state) => state.clones);
  const enemies = useGame((state) => state.enemies);

  useEffect(() => {
    init(entities, tiles, { width, height, depth });
  }, [entities, tiles, width, height, depth]);
  return (
    <>
      <ambientLight intensity={Math.PI / 4} />
      <pointLight position={[7, 6, 7]} decay={0} intensity={2.5} />
      <OrthographicCamera makeDefault position={[5, 5, 5]} zoom={50} near={-50} far={100} />
      <MapControls makeDefault target={[0, 0, 0]} maxPolarAngle={Math.PI / 2} minPolarAngle={0} />
      {tiles.map((t) => (
        <Obstacle
          key={t.id}
          id={t.id}
          pos={{
            x: t.position.x - 5,
            y: t.position.y - 1,
            z: t.position.z - 5,
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
            z: p.position.z - 5,
          }}
        />
      ))}
      {Object.values(clones).map((c) => (
        <Clone
          key={c.id}
          id={c.id}
          pos={{
            x: c.position.x - 5,
            y: c.position.y - 1,
            z: c.position.z - 5,
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
            z: e.position.z - 5,
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
  const selectedDice = useGame((state) => state.selectedDice);
  console.log('selectedDice: ', selectedDice);
  return (
    // <div className="h-[100vh] w-[100vw] bg-white relative overflow-hidden">
    <>
      {selectedDice && (
        <Text className="absolute z-10 top-[10%] left-[10%] flex gap-4">{`d${selectedDice}`}</Text>
      )}
      <HUD />
      <EndTurn />
      <Canvas>
        <Scene />
      </Canvas>
    </>
  );
}
