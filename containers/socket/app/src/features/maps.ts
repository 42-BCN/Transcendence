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
oooowwoooo
ooooooooow
woooooooow
wwooooooww
wwwapmlwww,

wwwwwwwwww
wwoowwooww
woooooooow
woooooooow
oooooooooo
oooooooooo
oowwoowwoo
oooooooooo
owoooooowo
wwooooooww,

wwwwoowwww
owooeooowo
oooooooooo
oooooooooo
woooooooow
wwwoooooww
oowooooowo
oowooooowo
oowwwwwwwo
oooooooooo
`

export const simpleMap = `
wwwooeooww
oooooooooo
oooooooooo
oooowwooow
owowawwooo
ooowwwwoow
oooowwoooo
woooowooow
owooowoooo
ooooawoooo
`

export const emptyMap = ``

export type pos = {
  x: number,
  y: number,
  z: number
}

export type mapInfo = {
  width: number;
  height: number;
  depth: number;
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


export const parseMap = (map: string) => {
  let width = 0;
  let height = 0;
  let depth = 0;
  let enenum = 1;
  let entities: parse_entity[] = [];
  let tiles: tile[] = [];
  const levels = map.trim().split(',');
  height = levels.length;
  levels.forEach((level: string, y: number) => {
    const rows = level.trim().split('\n')
    depth = rows.length
    rows.forEach((row: string, z: number) => {
      const chars = row.trim().split('')
      width = chars.length;
      chars.forEach((char, x) => {
        const position = { x, y, z };
        switch (char) {
          case 'w':
            tiles.push({
              id: `${x},${y},${z}`,
              type: 'wall',
              position
            })
            break
          case 'a':
            entities.push({
              id: 'assassin',
              type: 'assassin',
              position
            });
            break;
          case 'p':
            entities.push({
              id: 'paladin',
              type: 'paladin',
              position
            });
            break;
          case 'm':
            entities.push({
              id: 'mage',
              type: 'mage',
              position
            });
            break;
          case 'l':
            entities.push({
              id: `alchemist`,
              type: 'alchemist',
              position
            });
            break;
          case 'c':
            ++enenum;
            entities.push({
              id: `crawler_${enenum}`,
              type: 'crawler',
              position
            });
            break;
          case 'd':
            ++enenum;
            entities.push({
              id: `drone_${enenum}`,
              type: 'drone',
              position
            });
            break;
          case 's':
            ++enenum;
            entities.push({
              id: `spawner${enenum}`,
              type: 'spawner',
              position
            });
            break;
          case 't':
            ++enenum;
            entities.push({
              id: `mortar${enenum}`,
              type: 'mortar',
              position
            });
            break;
          case 'j':
            ++enenum;
            entities.push({
              id: `jaeger`,
              type: 'jaeger',
              position
            });
            break;
          case 'n':
            ++enenum;
            entities.push({
              id: `centurion`,
              type: 'centurion',
              position
            });
            break;
        }
      })
    })
  })
  return { tiles, entities, width, height, depth }
};
