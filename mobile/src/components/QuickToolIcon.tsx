import Svg, { Circle, Path, Polygon, Rect } from 'react-native-svg'

type Kind = 'gpa' | 'vocacional' | 'mundos' | 'plano' | 'ranking' | 'exames'

export function QuickToolIcon({kind}:{kind:Kind}) {
  return <Svg width={55} height={55} viewBox="0 0 64 64" fill="none" accessible={false}>
    {kind==='gpa'&&<>
      <Rect x={13} y={13} width={38} height={47} rx={8} fill="#aecaff" />
      <Rect x={12} y={10} width={38} height={47} rx={8} fill="#2470ed" stroke="#1551bc" strokeWidth={2} />
      <Rect x={19} y={18} width={24} height={10} rx={3} fill="#d9f3ff" />
      <Circle cx={23} cy={36} r={3} fill="white" /><Circle cx={32} cy={36} r={3} fill="white" />
      <Circle cx={41} cy={36} r={3} fill="white" /><Circle cx={23} cy={45} r={3} fill="white" />
      <Circle cx={32} cy={45} r={3} fill="white" /><Rect x={38} y={42} width={6} height={12} rx={2} fill="#ffc845" />
      <Polygon points="18,12 31,5 45,12 31,19" fill="#102d72" />
      <Path d="M45 12v9" stroke="#102d72" strokeWidth={2.5} strokeLinecap="round" />
      <Circle cx={45} cy={23} r={2} fill="#ffc845" />
    </>}
    {kind==='vocacional'&&<>
      <Rect x={15} y={11} width={37} height={48} rx={6} fill="#d9caff" />
      <Rect x={12} y={8} width={37} height={48} rx={6} fill="white" stroke="#5f68da" strokeWidth={2.5} />
      <Rect x={22} y={5} width={17} height={7} rx={3} fill="#7768ec" />
      <Path d="M23 22h17M23 30h12M23 38h16" stroke="#92b7ed" strokeWidth={3} strokeLinecap="round" />
      <Circle cx={42} cy={43} r={11} fill="#8a6bef" stroke="#5e49c9" strokeWidth={2} />
      <Path d="m42 36 2 6 6 1-6 2-2 6-2-6-6-2 6-1 2-6Z" fill="#ffc845" stroke="#fff1af" strokeWidth={1.5} />
      <Path d="m17 23 2 2 3-4M17 31l2 2 3-4" stroke="#29bf9f" strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round" />
    </>}
    {kind==='mundos'&&<>
      <Circle cx={27} cy={27} r={19} fill="#8ad5ff" />
      <Path d="M15 18c3-4 9-6 13-6l-2 5-5 2-1 5-5 2-4-3 4-5ZM30 13l6 1 5 6-4 3-1 6-6-2-3-5 3-9ZM17 32l7 1 5 5-2 7-6-2-4-5v-6ZM38 33l7-2-2 8-6 5-4-4 5-7Z"
        fill="#44c79b" />
      <Path d="M9 27h36M27 8c-8 9-8 29 0 38M27 8c8 9 8 29 0 38" stroke="#f3fbff" strokeWidth={1.5} opacity={0.8} />
      <Circle cx={27} cy={27} r={20} stroke="#1957af" strokeWidth={4} />
      <Path d="M42 42 55 55" stroke="#123f86" strokeWidth={8} strokeLinecap="round" />
      <Path d="M44 44 55 55" stroke="#3388e9" strokeWidth={4} strokeLinecap="round" />
      <Path d="m51 6 1.3 3.7L56 11l-3.7 1.3L51 16l-1.3-3.7L46 11l3.7-1.3L51 6Z" fill="#ffc845" />
    </>}
    {kind==='plano'&&<>
      <Rect x={11} y={11} width={40} height={47} rx={7} fill="#ffd7c7" />
      <Rect x={9} y={8} width={40} height={47} rx={7} fill="white" stroke="#eb765c" strokeWidth={2.5} />
      <Rect x={21} y={5} width={17} height={7} rx={3} fill="#eb765c" />
      <Circle cx={19} cy={23} r={4} fill="#d6edff" stroke="#2675e8" strokeWidth={2} />
      <Path d="m17 23 2 2 4-5M29 23h12M18 35l2 2 4-5M29 35h12M18 46l2 2 4-5M29 46h12"
        stroke="#2675e8" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="m52 13 1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5 1.5-4Z" fill="#ffc845" />
    </>}
    {kind==='ranking'&&<>
      <Rect x={8} y={49} width={49} height={7} rx={2} fill="#1d56b8" />
      <Rect x={11} y={45} width={43} height={5} rx={2} fill="#71b5ff" />
      <Polygon points="7,21 32,8 57,21 57,26 7,26" fill="#2d7ce9" stroke="#154caa" strokeWidth={2} />
      <Rect x={12} y={27} width={8} height={19} rx={2} fill="#96c9ff" stroke="#3375d4" strokeWidth={1.5} />
      <Rect x={27} y={27} width={8} height={19} rx={2} fill="#96c9ff" stroke="#3375d4" strokeWidth={1.5} />
      <Rect x={44} y={27} width={8} height={19} rx={2} fill="#96c9ff" stroke="#3375d4" strokeWidth={1.5} />
      <Path d="m32 10 2 4 4 1-3.2 2.6.8 4.1-3.6-2-3.6 2 .8-4.1L26 15l4-1 2-4Z" fill="#ffc845" />
      <Circle cx={53} cy={11} r={3} fill="#ffc845" />
    </>}
    {kind==='exames'&&<>
      <Rect x={13} y={9} width={35} height={47} rx={5} fill="#ffd79b" />
      <Rect x={10} y={6} width={35} height={47} rx={5} fill="white" stroke="#2f72d6" strokeWidth={2.5} />
      <Rect x={17} y={13} width={20} height={5} rx={2.5} fill="#87b5ff" />
      <Circle cx={20} cy={27} r={3.4} fill="#dce9ff" stroke="#2b73de" strokeWidth={2} />
      <Circle cx={20} cy={38} r={3.4} fill="#dce9ff" stroke="#2b73de" strokeWidth={2} />
      <Path d="M28 27h10M28 38h10" stroke="#8fb6ee" strokeWidth={2.5} strokeLinecap="round" />
      <Path d="m18 27 2 2 4-5" stroke="#24b88b" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="m48 26 8 8-18 18-9 2 2-9 17-19Z" fill="#ffca45" stroke="#d4912a" strokeWidth={2} strokeLinejoin="round" />
      <Path d="m46 29 8 8" stroke="#fff2bd" strokeWidth={2.5} />
      <Path d="m7 11 1.2 3.8L12 16l-3.8 1.2L7 21l-1.2-3.8L2 16l3.8-1.2L7 11Z" fill="#ffc845" />
    </>}
  </Svg>
}
