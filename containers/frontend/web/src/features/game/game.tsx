'use client';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useEffect, useState, useContext } from 'react';
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { Center, Environment, Html, MapControls, OrthographicCamera } from '@react-three/drei';
import { useGame, type pos as Position } from './store';
import { useTranslations } from 'next-intl';
import { Button } from '@components/controls/button';
import { Meter } from '@components/composites/meter';
import { Stack } from '@components/primitives/stack';
import { Text } from '@components/primitives/text';
import { useShallow } from 'zustand/react/shallow';
import { RoomsStoreContext } from '@/features/rooms/rooms-provider';
import { Crawler } from './meshes/Crawler.jsx';
import { Drone } from './meshes/Drone.jsx';
import { Gunner } from './meshes/Gunner.jsx';
import { Fighter } from './meshes/Fighter.jsx';
import { Generator } from './meshes/Generator.jsx';
import { Mage } from './meshes/Mage.jsx';
import { Alchemist } from './meshes/Alchemist.jsx';
import { Assassin } from './meshes/Assassin.jsx';
import { Paladin } from './meshes/Paladin.jsx';

const s = 0.975;

function FloatingVfx({ entityId }: { entityId: string }) {
  const entries = useGame(
    useShallow((s) => Object.values(s.vfx).filter((v) => v.eid === entityId))
  );

  useEffect(() => {
    const STYLE_ID = 'float-vfx-keyframes';
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = `
        @keyframes floatUp {
          0%   { opacity: 1; transform: translateY(0px);   }
          70%  { opacity: 1;                               }
          100% { opacity: 0; transform: translateY(-40px); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
  if (entries.length === 0)
    return null;
  return (
    <>
      {entries.map((v) => (
        <Html key={v.vfxid} position={[0, 1.5, 0]} center style={{ pointerEvents: 'none' }} zIndexRange={[100, 0]}>
          <span
            style={{
              display: 'block',
              animation: 'floatUp 1.4s ease-out forwards',
              fontWeight: 'bold',
              fontSize: 18,
              whiteSpace: 'nowrap',
              textShadow: '0 0 4px #000',
              color:
                v.type === 'damage' ? '#ff4444' :
                  v.type === 'doom' ? '#ff8800' :
                    v.type === 'shield' ? '#4488ff' :
                      v.type === 'boost' ? '#44ff88' :
                        v.type === 'burn' ? '#ff6600' :
                          v.type === 'restrain' ? '#cc88ff' :
                            v.type === 'oxidation' ? '#88ccff' :
                              v.type === 'miss' ? '#ffffff' :
                                '#ffcc00',
            }}
          >
            {v.label}
          </span>
        </Html>
      ))}
    </>
  );
}

function EntityEffects({ id, isHovered }: { id: string; isHovered: boolean }) {
  const isSelected = useGame((s) => s.selectedEnt === id);
  const entityTint = useGame((s) => (s as any).entityTints?.[id] ?? null);
  const hasTint = Boolean(entityTint);
  const tintColor = entityTint?.color ?? null;
  let lightColor: string | null = tintColor;
  let lightIntensity = hasTint ? 7 : 0;
  if (!lightColor) {
    if (isHovered) {
      lightColor = 'white';
      lightIntensity = 2.5;
    } else if (isSelected) {
      lightColor = '#99aaff';
      lightIntensity = 1.2;
    }
  }
  return (
    <>
      {lightColor && lightIntensity > 0 && (
        <pointLight
          color={lightColor}
          intensity={lightIntensity}
          distance={2.5}
          decay={2}
          position={[0, 0.8, 0]}
        />
      )}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]}>
          <circleGeometry args={[0.55, 32]} />
          <meshStandardMaterial
            color="white"
            emissive="white"
            emissiveIntensity={hasTint ? 0 : 1.5}
            transparent
            opacity={hasTint ? 0 : 0.45}
            depthWrite={false}
          />
        </mesh>
      )}
    </>
  );
}

function AbButtons() {
  const ent = useGame((state) => state.getSel());
  const selectAbility = useGame((state) => state.selectAbility);
  const selectedAb = useGame((state) => state.selectedAb);
  const abilityCD = useGame((state) => {
    if (!ent?.id)
      return null;
    return state.players[ent.id]?.abilitiesCD
      ?? state.clones[ent.id]?.abilitiesCD
      ?? state.enemies[ent.id]?.abilitiesCD
      ?? null;
  });
  const assignedCharacter = useGame((state) => state.assignedCharacter);
  const clearHighlights = useGame((state) => state.clearHighlights);
  const clearSelectables = useGame((state) => state.clearSelectables);
  const showAbRange = useGame((state) => state.showAbRange);
  return (
    <div className="z-10 bottom-[10%] left-[20%] flex gap-4">
      {ent?.abilities.map((ability) => {
        const cd = abilityCD?.[ability] || 0;
        const cn = cd === 0 ? "bg-red-600 text-white" : "bg-gray-600 text-white"
        return (
          <Button
            key={ability}
            className={cn}
            onMouseEnter={(event) => {
              if (cd === 0 && !selectedAb && Object.keys(useGame.getState().highlights).length === 0) {
                console.log('enter');
                event.stopPropagation();
                showAbRange(ability);
              }
            }}
            onMouseLeave={(event) => {
              if (cd === 0 && !selectedAb && Object.keys(useGame.getState().highlights).length === 0) {
                console.log('exit');
                event.stopPropagation();
                clearSelectables();
              }
            }}
            onPress={() => {
              if (cd === 0 && assignedCharacter === ent.id.replace('clone_', '')) {
                if (Object.keys(useGame.getState().highlights).length === 0)
                  clearHighlights();
                selectAbility(ability);
              }
            }}
          >
            {ability} {cd > 0 ? `(${cd})` : ""}
          </Button>
        )
      })}
    </div>
  );
}

function DiceButtons() {
  const ent = useGame((state) => state.getSel());
  const canSelect = useGame((state) => state.canSelect);
  const showMoveRange = useGame((state) => state.showMoveRange);
  const movDice = useGame((state) => state.movDice);
  const ability = useGame((state) => state.selectedAb);
  const selectDice = useGame((state) => state.selectDice);
  const selectedDice = useGame((state) => state.selectedDice);
  const assignedCharacter = useGame((state) => state.assignedCharacter);
  const clearHighlights = useGame((state) => state.clearHighlights);

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
            onMouseEnter={(event) => {
              event.stopPropagation();
              if (!ability)
                showMoveRange(diceNum);
            }}
            onMouseLeave={(event) => {
              if (!selectedDice) {
                event.stopPropagation();
                clearHighlights();
              }
            }}
            onPress={() => {
              if (assignedCharacter === useGame.getState().selectedEnt?.replace('clone_', '')) {
                (!canSelect || Boolean(ability)) ? selectDice(diceNum) : movDice(diceNum);
              }
            }}
            className={`px-4 py-2 bg-blue-500 text-white transition-all rounded
              ${!canSelect ? 'ring-4 ring-yellow-400 animate-pulse bg-yellow-500' : 'hover:bg-blue-600'}`}
          >
            {`d${diceNum}`}
          </Button>
        ))}
      </div>
    </div>
  );
}

function Reset() {
  const t = useTranslations('features.game');
  const history = useGame((state) => state.history);
  const resetHistory = useGame((state) => state.resetHistory);
  const assignedCharacter = useGame((state) => state.assignedCharacter);
  if (!history.some((h) => h.who === assignedCharacter && h.type !== 'forcedMov'))
    return null;
  return (
    <Button
      className="absolute z-10 top-16 left-8"
      variant="primary"
      w="auto"
      onPress={() => {
        resetHistory();
      }}
    >
      {t('resetPlan')}
    </Button>
  );
}

function EndPlan() {
  const t = useTranslations('features.game');
  const nextPhase = useGame((state) => state.nextPhase);
  const phase = useGame((state) => state.phase);
  const activePlayers = useGame((state) => state.activePlayers);
  const readyPlayers = useGame((state) => state.readyPlayers);
  return phase === 'PLAN' ? (
    <Button
      className="absolute z-10 bottom-8 right-64"
      variant="primary"
      w="auto"
      onPress={() => nextPhase()}
    >
      {t('endTurn')}
      <br />
      {readyPlayers?.length} / {activePlayers?.length}
    </Button>
  ) : null;
}

function HUD() {
  const t = useTranslations('features.game');
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
        {ent.status && (
          <div className="text-sm text-yellow-200 bg-black/60 px-2 py-1 rounded w-fit">
            ⚡ {ent.status}{ent.statusTurns > 0 ? ` (${ent.statusTurns})` : ''}
          </div>
        )}
        <DiceButtons />
      </Stack>
    </>
  );
}

function Tile({ id, pos }: { id: string; pos: Position }) {
  const phase = useGame((state) => state.phase);
  const moveClone = useGame((state) => state.moveClone);
  const isHighlighted = useGame((state) => state.highlights[id]);
  const selectedAb = useGame((state) => state.selectedAb);
  const isSelectable = useGame((state) => state.selectables[id]);
  const isAoePreview = useGame((state) => state.aoePreview[id]);
  const setAoePreview = useGame((state) => state.setAoePreview);
  const clearAoePreview = useGame((state) => state.clearAoePreview);
  const addHistoryAbility = useGame((state) => state.addHistoryAbility);
  const [isHovered, setHover] = useState(false);

  let color = 'orange';
  if (id.split(',')[1] === '0') color = 'green';
  else if (id.split(',')[1] === '2') color = 'purple';
  else if (id.split(',')[1] === '3') color = 'slategray';
  if (isHighlighted && !selectedAb) color = 'hotpink';
  else if (isSelectable) color = 'red';
  else if (isHovered) color = 'lightgray';
  if ((color === 'hotpink' || color === 'red') && isHovered) color = 'lightpink';
  if (isAoePreview) color = '#ffee00';

  return (
    <mesh
      position={[pos.x, pos.y, pos.z]}
      onPointerOver={(event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        setHover(true);
        if (isSelectable && selectedAb)
          setAoePreview(id);
      }}
      onPointerOut={(event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        setHover(false);
        if (isSelectable && selectedAb)
          clearAoePreview();
      }}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        if (phase !== 'PLAN') return;
        event.stopPropagation();
        if (isSelectable && isHovered)
          addHistoryAbility(id);
        else if (isHighlighted && !selectedAb && isHovered)
          moveClone(id);
      }}
    >
      <boxGeometry args={[s, s, s]} />
      <meshStandardMaterial color={color} wireframe={false} />
    </mesh>
  );
}

export function getMesh(id: string) {
  const name = id.split('_')[0].toLowerCase();
  switch (name) {
    case 'crawler':
      return Crawler;
    case 'drone':
      return Drone;
    case 'centurion':
      return Fighter;
    case 'generator':
      return Generator;
    case 'jaeger':
      return Gunner;
    case 'alchemist':
      return Alchemist;
    case 'paladin':
      return Paladin;
    case 'mage':
      return Mage;
    case 'assassin':
      return Assassin;
    default:
      return null;
  }
}

function EnemyTargetIndicator({ enemyId }: { enemyId: string }) {
  const phase = useGame((s) => s.phase);
  const enemy = useGame((s) => s.enemies[enemyId]);
  const players = useGame(useShallow((s) => s.players));
  const clones = useGame(useShallow((s) => s.clones));

  if (phase !== 'PLAN' || !enemy || (enemy as any).isDead)
    return null;
  if (!(enemy as any).abilities?.length || !(enemy as any).dice?.length)
    return null;
  const epos = (enemy as any).position;
  let closestId: string | null = null;
  let minDist = Infinity;
  const consider = (id: string, pos: { x: number; y: number; z: number }) => {
    const d = Math.abs(pos.x - epos.x) + Math.abs(pos.z - epos.z);
    if (d < minDist) { minDist = d; closestId = id; }
  };
  Object.values(players).forEach((p: any) => {
    if (!p.isDead) consider(p.id, p.position);
  });
  Object.values(clones).forEach((c: any) => {
    if (!c.isDead) consider(c.id.replace('clone_', ''), c.position);
  });
  if (!closestId)
    return null;
  return (
    <Html position={[0, 0.5, 0]} center style={{ pointerEvents: 'none' }} zIndexRange={[80, 0]}>
      <div style={{
        background: 'rgba(0,0,0,0.82)',
        color: '#ffaa00',
        border: '1px solid #ffaa00',
        borderRadius: 3,
        fontSize: 10,
        padding: '1px 5px',
        whiteSpace: 'nowrap',
        fontWeight: 'bold',
        letterSpacing: '0.03em',
      }}>
        Target: {closestId}
      </div>
    </Html>
  );
}

function Enemy({ id, pos }: { id: string; pos: Position }) {
  const eRef = useRef(null);
  const phase = useGame((state) => state.phase);
  const selectEntity = useGame((state) => state.selectEntity);
  const selected = useGame((state) => state.selectedEnt);
  const selectedDice = useGame((state) => state.selectedDice);
  const selectedAb = useGame((state) => state.selectedAb);
  const canSelect = useGame((state) => state.canSelect);
  const addHistoryAbility = useGame((state) => state.addHistoryAbility);
  const isTarget = useGame((state) => state.selectables[id]);
  const setAoePreview = useGame((state) => state.setAoePreview);
  const clearAoePreview = useGame((state) => state.clearAoePreview);
  const [isHovered, setHover] = useState(false);

  const Model = getMesh(id);
  if (!Model)
    return null;
  return (
    <group position={[pos.x, pos.y, pos.z]}>
      <Model
        position={[0, 0, 0]}
        ref={eRef}
        onPointerOver={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          setHover(true);
          if (isTarget && selectedAb) setAoePreview(id);
        }}
        onPointerOut={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          setHover(false);
          if (isTarget && selectedAb) clearAoePreview();
        }}
        onClick={(event: ThreeEvent<MouseEvent>) => {
          if (phase !== 'PLAN') return;
          event.stopPropagation();
          if (canSelect) selectEntity(id);
          else if (isTarget && selected && selectedDice && selectedAb)
            addHistoryAbility(id);
        }}
      />
      <EntityEffects id={id} isHovered={isHovered} />
      <FloatingVfx entityId={id} />
      <EnemyTargetIndicator enemyId={id} />
    </group>
  );
}

function Clone({ id, pos }: { id: string; pos: Position }) {
  const pRef = useRef(null);
  const phase = useGame((state) => state.phase);
  const selectEntity = useGame((state) => state.selectEntity);
  const selected = useGame((state) => state.selectedEnt);
  const selectedDice = useGame((state) => state.selectedDice);
  const selectedAb = useGame((state) => state.selectedAb);
  const canSelect = useGame((state) => state.canSelect);
  const addHistoryAbility = useGame((state) => state.addHistoryAbility);
  const isTarget = useGame((state) => state.selectables[id]);
  const setAoePreview = useGame((state) => state.setAoePreview);
  const clearAoePreview = useGame((state) => state.clearAoePreview);
  const [isHovered, setHover] = useState(false);

  const meshid = id.replace('clone_', '');
  const Model = getMesh(meshid);
  if (!Model)
    return null;
  return (
    <group position={[pos.x, pos.y, pos.z]}>
      <Model
        position={[0, 0, 0]}
        ref={pRef}
        onPointerOver={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          setHover(true);
          if (isTarget && selectedAb) setAoePreview(id);
        }}
        onPointerOut={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          setHover(false);
          if (isTarget && selectedAb) clearAoePreview();
        }}
        onClick={(event: ThreeEvent<MouseEvent>) => {
          if (phase !== 'PLAN')
            return;
          event.stopPropagation();
          if (canSelect) selectEntity(id);
          else if (isTarget && selected && selectedDice && selectedAb)
            addHistoryAbility(id);
        }}
      />
      <EntityEffects id={id} isHovered={isHovered} />
      <FloatingVfx entityId={id} />
    </group>
  );
}

function Player({ id, pos }: { id: string; pos: Position }) {
  const pRef = useRef(null);
  const phase = useGame((state) => state.phase);
  const selectEntity = useGame((state) => state.selectEntity);
  const canSelect = useGame((state) => state.canSelect);
  const addHistoryAbility = useGame((state) => state.addHistoryAbility);
  const selectedAb = useGame((state) => state.selectedAb);
  const isTarget = useGame((state) => state.selectables[id]);
  const setAoePreview = useGame((state) => state.setAoePreview);
  const clearAoePreview = useGame((state) => state.clearAoePreview);
  const [isHovered, setHover] = useState(false);

  const Model = getMesh(id);
  if (!Model)
    return null;
  return (
    <group position={[pos.x, pos.y, pos.z]}>
      <Model
        position={[0, 0, 0]}
        ref={pRef}
        onPointerOver={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          setHover(true);
          if (isTarget && selectedAb) setAoePreview(id);
        }}
        onPointerOut={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          setHover(false);
          if (isTarget && selectedAb) clearAoePreview();
        }}
        onClick={(event: ThreeEvent<MouseEvent>) => {
          if (phase !== 'PLAN')
            return;
          event.stopPropagation();
          if (canSelect) selectEntity(id);
          else if (isTarget) addHistoryAbility(id);
        }}
      />
      <EntityEffects id={id} isHovered={isHovered} />
      <FloatingVfx entityId={id} />
    </group>
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
      <Environment preset="city" />
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
      })}{' '}
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

function DoomCounter() {
  const percent = useGame((state) => state.doom);
  return (
    <div className="z-10 absolute left-32 bottom-8">
      {percent ?? "ERROR"}
    </div>
  )
}

function name(phase: string) {
  switch (phase) {
    case 'PLAN':
      return 'PLANNING PHASE';
    case 'EXEC':
      return 'EXECUTION PHASE';
    case 'ENEMY':
      return 'ENEMY PHASE';
    case 'END':
      return 'END PHASE';
    case 'WIN':
      return 'WIN PHASE';
    case 'LOSE':
      return 'LOSE PHASE';
    default:
      return 'ERROR';
  }
}

function GamePhase() {
  const assignedCharacter = useGame((state) => state.assignedCharacter);
  const phase = useGame((state) => state.phase);
  return (
    <div className="absolute top-4 left-32 transform z-20 bg-black text-white px-4 py-2 rounded">
      {name(phase)}
      {assignedCharacter}
    </div>
  )
}

const CLASS_COLOR: Record<string, string> = {
  assassin: '#a855f7',
  paladin: '#facc15',
  mage: '#38bdf8',
  alchemist: '#4ade80',
  spectator: '#6b7280',
};

const CLASS_ICON: Record<string, string> = {
  assassin: '🗡️',
  paladin: '🛡️',
  mage: '🔮',
  alchemist: '⚗️',
  spectator: '👁️',
};

function TopBar() {
  const doom = useGame((s) => s.doom);
  const phase = useGame((s) => s.phase);
  const turn = useGame((s) => s.turn);
  const pct = Math.min(Math.max(doom, 0), 100);

  const fillColor =
    pct >= 80 ? '#ef4444' :
      pct >= 50 ? '#f97316' :
        '#eab308';

  return (
    <div
      className="absolute top-0 left-8 right-16 z-30 h-8 flex items-center px-4 gap-4 transition-colors duration-700"
      style={{
        background: pct >= 80 ? 'rgba(60,0,0,0.94)' : 'rgba(0,0,0,0.90)',
        borderBottom: `1px solid ${pct >= 80 ? '#ef444430' : 'rgba(255,255,255,0.07)'}`,
      }}
    >
      <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase shrink-0 w-40">
        {name(phase)}
      </span>

      <span className="text-[10px] font-mono text-gray-600 shrink-0">
        Turn {String(turn).padStart(2, '0')}
      </span>

      <div className="flex flex-1 items-center gap-2">
        <span className="text-[11px] shrink-0" style={{ color: fillColor }}>☠</span>
        <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-800">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${fillColor}55, ${fillColor})`,
            }}
          />
        </div>
        <span
          className="text-[11px] font-mono w-8 text-right shrink-0 tabular-nums"
          style={{ color: fillColor }}
        >
          {pct}
        </span>
      </div>
    </div>
  );
}

function CharacterCard() {
  const assignedCharacter = useGame((s) => s.assignedCharacter);
  const color = CLASS_COLOR[assignedCharacter] ?? CLASS_COLOR.spectator;
  const icon = CLASS_ICON[assignedCharacter] ?? '?';

  return (
    <div
      className="absolute top-10 left-16 z-20 flex items-center gap-2.5 px-3 py-2 rounded select-none"
      style={{
        background: 'rgba(0,0,0,0.82)',
        border: `1px solid ${color}30`,
        boxShadow: `inset 2px 0 0 ${color}`,
      }}
    >
      <span className="text-base leading-none">{icon}</span>
      <div className="leading-none">
        <div className="text-[9px] tracking-[0.18em] text-gray-600 uppercase mb-1">
          Playing as
        </div>
        <div className="text-[13px] font-bold uppercase tracking-wide leading-none" style={{ color }}>
          {assignedCharacter}
        </div>
      </div>
    </div>
  );
}

function HandlePhaseScreen() {
  const phase = useGame((state) => state.phase);
  const resetGame = useGame((state) => state.resetGame);
  const cleanupSocketListeners = useGame((state) => state.cleanupSocketListeners);
  const router = useRouter();

  const handleExitRoom = useCallback(() => {
    cleanupSocketListeners();
    router.push('/');
  }, [cleanupSocketListeners, router]);

  switch (phase) {
    case 'WIN':
      return (
        <div className="absolute inset-0 bg-black flex items-center justify-center text-white z-50">
          <div className="text-center space-y-8">
            <h2 className="text-5xl font-bold text-green-400 tracking-widest">
              YOU WIN!
            </h2>
            <div className="flex gap-4 justify-center">
              <Button variant="primary" w="auto" onPress={resetGame}>
                Reset
              </Button>
              <Button w="auto" onPress={handleExitRoom}>
                Exit Room
              </Button>
            </div>
          </div>
        </div>
      );
    case 'LOSE':
      return (
        <div className="absolute inset-0 bg-black flex items-center justify-center text-white z-50">
          <div className="text-center space-y-8">
            <h2 className="text-5xl font-bold text-red-500 tracking-widest">
              YOU LOSE!
            </h2>
            <div className="flex gap-4 justify-center">
              <Button variant="primary" w="auto" onPress={resetGame}>
                Reset
              </Button>
              <Button w="auto" onPress={handleExitRoom}>
                Exit Room
              </Button>
            </div>
          </div>
        </div>
      );
    default:
      return (
        <>
          <TopBar />
          <CharacterCard />
          <HUD />
          <Reset />
          <EndPlan />
          <Canvas>
            <Scene />
          </Canvas>
        </>
      );
  }
}

export function Game() {
  const roomsStore = useContext(RoomsStoreContext);
  const initSocketListeners = useGame((state) => state.initSocketListeners);
  const cleanupSocketListeners = useGame((state) => state.cleanupSocketListeners);
  const assignedCharacter = useGame((state) => state.assignedCharacter);
  const connectionError = useGame((state) => state.connectionError);
  const activePlayers = useGame((state) => state.activePlayers);
  const mapBounds = useGame((state) => state.mapBounds);
  const [debugInfo, setDebugInfo] = useState('Initializing...');
  const roomState = roomsStore?.roomState;
  const isRoomFull = roomState?.isGameRoomFull ?? false;


  useEffect(() => {
    if (!isRoomFull) {
      cleanupSocketListeners();
      return;
    }

    initSocketListeners();

    return () => {
      cleanupSocketListeners();
    };
  }, [cleanupSocketListeners, initSocketListeners, isRoomFull]);

  useEffect(() => {
    const debugTimer = setInterval(() => {
      setDebugInfo(
        `Character: ${assignedCharacter || 'waiting...'} | Map: ${mapBounds.width}x${mapBounds.height}x${mapBounds.depth}`,
      );
    }, 1000);

    return () => {
      clearInterval(debugTimer);
    };
  }, [mapBounds]);

  if (connectionError) {
    return (
      <div className="absolute inset-0 bg-black flex items-center justify-center text-white z-25">
        <div className="text-center max-w-md px-6">
          <h2>Game unavailable</h2>
          <p className="text-sm text-gray-300 mt-4">{connectionError}</p>
        </div>
      </div>
    );
  }

  if (!isRoomFull) {
    return (
      <div className="absolute inset-0 bg-black flex items-center justify-center text-white z-25">
        <div className="text-center max-w-md px-6">
          <h2>Room not ready</h2>
          <p className="text-sm text-gray-300 mt-4">The game route is only available when the room has 4 players.</p>
        </div>
      </div>
    );
  }

  if (mapBounds.width > 0 && (activePlayers?.length ?? 0) < 4) {
    return (
      <div className="absolute inset-0 bg-black flex items-center justify-center text-white z-25">
        <div className="text-center max-w-md px-6">
          <h2>Game paused</h2>
          <p className="text-sm text-gray-300 mt-4">A player disconnected. The game is blocked until the room is full again.</p>
        </div>
      </div>
    );
  }

  return !mapBounds || mapBounds.width === 0 ? (
    <div className="absolute inset-0 bg-black flex items-center justify-center text-white z-25">
      <div className="text-center">
        <h2>Connecting to Server...</h2>
        <p className="text-sm text-gray-400 mt-4">{debugInfo}</p>
        <p className="text-xs text-gray-500 mt-2">Check browser console for detailed logs</p>
      </div>
    </div>
  ) : <HandlePhaseScreen />
}
