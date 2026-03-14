import { useState, useRef, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { createRoot } from "react-dom/client";
import { MapControls, OrthographicCamera } from "@react-three/drei";
import { simpleMap, testMap, emptyMap, parseMap } from "./maps";
import { useGame } from "./gameState";

const s = 0.975;

// no hace falta reiniciar active,
// active se destruye cuando ret null
function AbButton({ name, ...props }) {
  const selectAbility =
    useGame((state) =>
      state.selectAbility);
  const unselectAbility =
    useGame((state) =>
      state.unselectAbility);
  const [active, setActive] =
    useState(false)
  return (
    <button
      onClick={() => {
        setActive(!active);
        {
          active ? selectAbility(name)
            : unselectAbility()
        };
      }}>
      {name}
    </button>
  )
}

function AbButtons({ ...props }) {
  const getSel =
    useGame((state) =>
      state.getSel);
  const ent = getSel();
  const btns = [];
  const len = ent.abilities.length;
  for (let i = 0; i < len; ++i) {
    const h = `${20 + i * 10}%`;
    btns.push(
      <div
        key={`${ent.abilities[i]}`}
        style={{
          position: "absolute",
          bottom: "80px",
          left: `${h}`,
          zIndex: 10
        }}>
        <AbButton
          name={`${ent.abilities[i]}`} />
      </div>
    );
  }
  return (
    <>
      {btns}
    </>
  )
}

function DiceButton({ name, value, ...props }) {
  const movDice =
    useGame((state) =>
      state.movDice);
  return (
    <button
      onClick={() => movDice(value)
      }>
      {name}
    </button>
  );
}

function DiceButtons({ ...props }) {
  const getSel =
    useGame((state) =>
      state.getSel);
  const ent = getSel();
  const btns = [];
  const len = ent.dice.length;
  for (let i = 0; i < len; ++i) {
    const h = `${20 + i * 10}%`;
    btns.push(
      <div
        key={`d${ent.dice[i]}`}
        style={{
          position: "absolute",
          bottom: "45px",
          left: `${h}`,
          zIndex: 10
        }}>
        <DiceButton
          name={`d${ent.dice[i]}`}
          value={ent.dice[i]} />
      </div>
    );
  }
  return (
    <>
      {btns}
    </>
  )
}

function HUD() {
  const typeEnt =
    useGame((state) =>
      state.typeEnt);
  const canSelect =
    useGame((state) =>
      state.selectedEnt);
  if (typeEnt != 'player'
    || !canSelect)
    return null;
  return (
    <>
      <AbButtons />
      <DiceButtons />
    </>
  )
}

function Obstacle({ id, position, ...props }) {
  const moveTo =
    useGame(state =>
      state.moveTo);
  const isHighlighted =
    useGame(state =>
      state.highlights[id]);
  const selectedAb =
    useGame((state) =>
      state.selectedAb);
  const isSelectable =
    useGame((state) =>
      state.selectables[id])
  let color = 'orange';
  if (isHighlighted
    && !selectedAb)
    color = 'hotpink';
  else if (isSelectable)
    color = 'red';

  return (
    <mesh
      {...props}
      position={position}
      onClick={(event) => {
        event.stopPropagation();
        moveTo(id);
      }}>
      <boxGeometry args={[s, s, s]} />
      <meshStandardMaterial
        color={color}
        wireframe={false}
      />
    </mesh>
  );
}

function Enemy({ id, position, ...props }) {
  const eRef = useRef();
  const selectEntity =
    useGame(state =>
      state.selectEntity)
  const selected =
    useGame(state =>
      state.selectedEnt);
  const canSelect =
    useGame(state =>
      state.canSelect);
  return (
    <mesh
      {...props}
      position={position}
      ref={eRef}
      onClick={(event) => {
        event.stopPropagation();
        {
          canSelect ?
            selectEntity(id) : null
        };
      }}
    >
      <boxGeometry args={[s, s, s]} />
      <meshStandardMaterial color={
        selected === id ? "gray" : "violet"} />
    </mesh>
  );
}

function Player({ id, position, ...props }) {
  const pRef = useRef();
  const selectEntity =
    useGame(state =>
      state.selectEntity);
  const selected =
    useGame(state =>
      state.selectedEnt);
  const canSelect =
    useGame(state =>
      state.canSelect);
  return (
    <mesh
      {...props}
      position={position}
      ref={pRef}
      onClick={(event) => {
        event.stopPropagation();
        {
          canSelect ?
            selectEntity(id) : null
        };
      }}
    >
      <boxGeometry args={[s, s, s]} />
      <meshStandardMaterial color={
        selected === id ? "white" : "blue"} />
    </mesh>
  );
}

function Floor({ id, position, ...props }) {
  const moveTo =
    useGame(state =>
      state.moveTo)
  const isHighlighted =
    useGame((state) =>
      state.highlights[id]);
  const selectedAb =
    useGame((state) =>
      state.selectedAb);
  const isSelectable =
    useGame((state) =>
      state.selectables[id])
  let color = 'green';
  if (isHighlighted
    && !selectedAb)
    color = 'hotpink';
  else if (isSelectable)
    color = 'red';

  return (
    <mesh
      {...props}
      position={position}
      receiveShadow
      onClick={(event) => {
        event.stopPropagation()
        moveTo(id)
      }
      }>
      <boxGeometry args={[s, 0.5 * s, s]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function GridFloor(props) {
  const tiles = [];

  for (let z = 0; z < 10; ++z) {
    for (let x = 0; x < 10; ++x) {
      const key = `${x},${-1},${z}`
      tiles.push(
        <Floor
          key={key}
          id={key}
          position={[x - 5, -0.25, z - 5]}
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


function Scene(props) {
  const map = testMap;
  const { staticTiles, entities, mapInfo } = useMemo(
    () => parseMap(map),
    [map],
  );

  const init =
    useGame((state) =>
      state.init);
  const players =
    useGame((state) =>
      state.players);
  const enemies =
    useGame((state) =>
      state.enemies);

  useEffect(() => {
    init(entities, staticTiles, mapInfo);
  }, [entities, mapInfo, staticTiles]);
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
      {staticTiles.map((tile) => (
        <Obstacle
          key={tile.id}
          id={tile.id}
          position={[
            tile.position.x - 5,
            tile.position.y + 0.5,
            tile.position.z - 5,
          ]}
        />
      ))}
      {Object.values(players).map((p) => (
        <Player
          key={p.id}
          id={p.id}
          position={[p.position.x - 5, p.position.y + 0.5, p.position.z - 5]}
        />
      ))}
      {Object.values(enemies).map((e) => (
        <Enemy
          key={e.id}
          id={e.id}
          position={[
            e.position.x - 5,
            e.position.y + 0.5,
            e.position.z - 5]}
        />
      ))}
      <GridFloor />
    </>
  );
}

);

export function Game() {
  return (
    <div
      style={{
        height: "98vh",
        width: "95vm",
        background: "black",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <Canvas>
        <Scene />
      </Canvas>
      <HUD />
    </div>
  )
}
