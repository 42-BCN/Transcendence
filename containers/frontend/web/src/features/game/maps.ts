export const testMap = `
wwwwwwwwww
wwwwwwwwww
wwwwwwwwww
wwwwwwwwww
wwwwwwwwww
wwwwwwwwww
wwwwwwwwww
wwwwwwwwww
wwwwwwwwww
wwwwwwwwww,

wwwwwwwwww
wwowwwwoww
wooowwooow
ooooooooow
oooooooooo
oooooooooo
ooooooooow
woooooooow
wwooooooww
wwwopoowww,

wwwwwwwwww
owoowwoowo
oooooooooo
oooooooooo
oooooooooo
oooooooooo
oooooooooo
oooooooooo
owoooooowo
wwooooooww,

wwwwwwwwww
wwooeoooww
woooooooow
woooooooow
woooooooow
wwwwwwwwww
owwoooowwo
owwoooowwo
owwwwwwwwo
oooooooooo
`

export const simpleMap = `
wwwooeooww
oooooooooo
oooooooooo
oooowwooow
owowpwwooo
ooowwwwoow
oooowwoooo
woooowooow
owooowoooo
oooopwoooo
`

export const emptyMap = ``

export type pos = {
  x: number,
  y: number,
  z: number
}

export type tile = {
  id: string,
  type: string,
  position: pos
}

export type parse_entity = {
  id: string,
  type: string,
  position: pos
}


type info = {
  width: number; //x
  height: number; //y
  depth: number; //z
  planum: number;
  enenum: number;
  entities: parse_entity[];
  tiles: tile[];
}

export const parseMap = (map: string) => {
  const info: info = {
    width: 0, height: 0, depth: 0, planum: 1,
    enenum: 1, entities: [], tiles: []
  };
  const levels = map.trim().split(',');
  info.height = levels.length;
  levels.forEach((level: string, y: number) => {
    const rows = level.trim().split('\n')
    info.depth = rows.length
    rows.forEach((row: string, z: number) => {
      const chars = row.trim().split('')
      info.width = chars.length;
      chars.forEach((char, x) => {
        const position = { x, y, z };
        switch (char) {
          case 'w':
            info.tiles.push({
              id: `${x},${y},${z}`,
              type: 'wall',
              position
            })
            break
          case 'p':
            ++info.planum;
            info.entities.push({
              id: `player_${info.planum}`,
              type: 'player',
              position
            });
            break;
          case 'e':
            ++info.enenum;
            info.entities.push({
              id: `enemy_${info.enenum}`,
              type: 'enemy',
              position
            });
            break;
        }
      })
    })
  })
  return { info }
};
