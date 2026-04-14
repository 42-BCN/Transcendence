'use client';

import { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { MapControls, OrthographicCamera } from '@react-three/drei';
import type { pos, parse_entity, tile } from './maps';
import { testMap, parseMap } from './maps';
import { useGame } from './store';
//import { useGameSocketManager } from './provider';
import { useTranslations } from 'next-intl';
import { Button } from '@components/controls/button';
import { Meter } from '@components/composites/meter';
import { Stack } from '@components/primitives/stack';
import { Text } from '@components/primitives/text';

const s = 0.975;

// no hace falta reiniciar active,
// active se destruye cuando ret null
function AbButtons() {
  const ent = useGame((state) => state.getSel());
  const selectAbility = useGame((state) => state.selectAbility);
  const assignedCharacter = useGame((state) => state.assignedCharacter);
  const clearSelectables = useGame((state) => state.clearSelectables);
  const showAbRange = useGame((state) => state.showAbRange);
  const [isPressed, setPressed] = useState(false);
  return (
    <div className="z-10 bottom-[10%] left-[20%] flex gap-4">
      {ent?.abilities.map((ability) => (
        <Button key={ability} className="bg-red-600 text-white"
          onPointerOver={(event) => {
            event.stopPropagation();
            showAbRange(ability);
            setPressed(false);
          }}
          onPointerOut={(event) => {
            if (!isPressed) {
              event.stopPropagation();
              clearSelectables();
            }
          }}
          onPress={() => {
            if (assignedCharacter === ent.id) {
              selectAbility(ability);
              setPressed(true);
            }
          }}>
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
  const rollQuantity = useGame((state) => state.rollQuantity);
  const rollDice = useGame((state) => state.rollDice);
  const assignedCharacter = useGame((state) => state.assignedCharacter);
  const clearHighlights = useGame((state) => state.clearHighlights);

  const handleDiceClick = (quantity: number) => {
    rollDice(quantity);
    console.log('Emitted roll dice event with quantity:', quantity);
  };
  const [isPressed, setPressed] = useState(false);

  return (
    <div className="z-10 bottom-[10%] left-[20%] flex flex-col gap-3">
      <div className="flex gap-4">
        {ent?.usedDice.map((diceNum, i) => (
          <Button key={i} className={`px-4 py-2 bg-gray-500 text-white transition-all opacity-60`}>
            {`d${diceNum}`}
          </Button>
        ))}
        {ent?.dice.map((diceNum, i) => (
          <Button
            key={i}
            onPointerOver={(event) => {
              event.stopPropagation();
              movDice(diceNum);
              setPressed(false);
            }}
            onPointerOut={(event) => {
              if (!isPressed) {
                event.stopPropagation();
                clearHighlights();
              }
            }}
            onPress={() => {
              if (assignedCharacter === ent.id) {
                ability ? selectDice(diceNum) : movDice(diceNum);
                const rolled = Math.ceil(Math.random() * diceNum);
                handleDiceClick(rolled);
                setPressed(true);
              }
            }}
            className={`px-4 py-2 bg-blue-500 text-white transition-all rounded
              ${!canSelect ? 'ring-4 ring-yellow-400 animate-pulse bg-yellow-500' : 'hover:bg-blue-600'}`}
          >
            {`d${diceNum}`}
          </Button>
        ))}
      </div>
      {/* Roll Total Display */}
      {/* <div className="px-4 py-2 bg-purple-600 text-white rounded font-bold text-center"> */}
      {/*   Total Rolls: {rollQuantity} */}
      {/* </div> */}
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

function EndPlan() {
  const t = useTranslations('features.game');
  const nextPhase = useGame((state) => state.nextPhase);
  const phase = useGame((state) => state.phase);
  const historyLength = useGame((state) => state.history.length);
  return phase === 'PLAN' && historyLength === 4 ? (
    <Button
      className="absolute z-10 bottom-8 right-64"
      variant="primary"
      w="default"
      onPress={() => nextPhase()}
    >
      {t('endTurn')}
    </Button >
  )
    : null
}

function HUD() {
  const t = useTranslations('features.game');
  const typeEnt = useGame((state) => state.typeEnt);
  const canSelect = useGame((state) => state.selectedEnt);
  const ent = useGame((state) => state.getSel());
  return !ent ? null : (
    <>
      <Stack className="z-10 absolute left-8 bottom-4">
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

function Tile({ id, pos }: { id: string; pos: pos }) {
  const phase = useGame((state) => state.phase);
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
        if (phase !== 'PLAN') return;
        moveClone(id);
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
  const phase = useGame((state) => state.phase);
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
      {/*   if (phase !== "PLAN") */}
      {/*     return; */}
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
  const phase = useGame((state) => state.phase);
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
        if (phase !== 'PLAN') return;
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
  const phase = useGame((state) => state.phase);
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
        if (phase !== 'PLAN') return;
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
  const players = useGame((state) => state.players);
  const tiles = useGame((state) => state.tiles);
  const clones = useGame((state) => state.clones);
  const enemies = useGame((state) => state.enemies);

  return (
    <>
      <ambientLight intensity={Math.PI / 4} />
      <pointLight position={[7, 6, 7]} decay={0} intensity={2.5} />
      <OrthographicCamera makeDefault position={[5, 5, 5]} zoom={50} near={-50} far={100} />
      <MapControls makeDefault target={[0, 0, 0]} maxPolarAngle={Math.PI / 2} minPolarAngle={0} />
      {Object.keys(tiles).map((t) => {
        const [x, y, z] = t.split(',').map(Number);
        return (
          <Tile
            key={t}
            id={t}
            pos={{
              x: x - 5,
              y: y - 1,
              z: z - 5,
            }}
          />
        );
      })}      {Object.values(players).map((p) => (
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

function name(phase: string) {
  switch (phase) {
    case 'PLAN':
      return 'PLANNING PHASE';
    case 'EXEC':
      return 'EXECUTION PHASE';
    case 'ENEMY':
      return 'ENEMY PHASE';
    default:
      return 'END PHASE';
  }
}

export function Game() {
  const phase = useGame((state) => state.phase);
  const assignedCharacter = useGame((state) => state.assignedCharacter);
  const selectedDice = useGame((state) => state.selectedDice);
  const initSocketListeners = useGame((state) => state.initSocketListeners);
  const cleanupSocketListeners = useGame((state) => state.cleanupSocketListeners);
  const mapBounds = useGame((state) => state.mapBounds);
  // console.log('selectedDice: ', selectedDice);
  useEffect(() => {
    initSocketListeners();
    return cleanupSocketListeners
  }, [initSocketListeners, cleanupSocketListeners]);
  return (!mapBounds || mapBounds.width === 0 ?
    <div className="absolute inset-0 bg-black flex items-center justify-center text-white z-50">
      <h2>Connecting to Server...</h2>
    </div>
    :
    <>
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-black text-white px-4 py-2 rounded">
        {name(phase)}
        {assignedCharacter}
      </div>
      {selectedDice && phase === 'PLAN' && (
        <Text className="absolute z-10 top-[10%] left-[10%] flex gap-4">{`d${selectedDice}`}</Text>
      )}
      <HUD />
      <EndPlan />
      <Canvas>
        <Scene />
      </Canvas>
    </>
  );
}
