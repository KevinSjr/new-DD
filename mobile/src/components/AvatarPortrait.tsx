import { Image, Text, View } from 'react-native'

export const AVATAR_FLAGS=[
  {id:'brasil',name:'Brasil',flag:'🇧🇷'},
  {id:'alemanha',name:'Alemanha',flag:'🇩🇪'},
  {id:'australia',name:'Austrália',flag:'🇦🇺'},
  {id:'belgica',name:'Bélgica',flag:'🇧🇪'},
  {id:'canada',name:'Canadá',flag:'🇨🇦'},
  {id:'china',name:'China',flag:'🇨🇳'},
  {id:'coreia-do-sul',name:'Coreia do Sul',flag:'🇰🇷'},
  {id:'dinamarca',name:'Dinamarca',flag:'🇩🇰'},
  {id:'espanha',name:'Espanha',flag:'🇪🇸'},
  {id:'estados-unidos',name:'Estados Unidos',flag:'🇺🇸'},
  {id:'finlandia',name:'Finlândia',flag:'🇫🇮'},
  {id:'franca',name:'França',flag:'🇫🇷'},
  {id:'paises-baixos',name:'Países Baixos',flag:'🇳🇱'},
  {id:'irlanda',name:'Irlanda',flag:'🇮🇪'},
  {id:'italia',name:'Itália',flag:'🇮🇹'},
  {id:'japao',name:'Japão',flag:'🇯🇵'},
  {id:'malasia',name:'Malásia',flag:'🇲🇾'},
  {id:'noruega',name:'Noruega',flag:'🇳🇴'},
  {id:'portugal',name:'Portugal',flag:'🇵🇹'},
  {id:'reino-unido',name:'Reino Unido',flag:'🇬🇧'},
  {id:'singapura',name:'Singapura',flag:'🇸🇬'},
  {id:'suica',name:'Suíça',flag:'🇨🇭'},
  {id:'suecia',name:'Suécia',flag:'🇸🇪'},
  {id:'taiwan',name:'Taiwan',flag:'🇹🇼'},
  {id:'hong-kong',name:'Hong Kong',flag:'🇭🇰'},
  {id:'nova-zelandia',name:'Nova Zelândia',flag:'🇳🇿'},
] as const

export type AvatarFlag=(typeof AVATAR_FLAGS)[number]['id']
export type AvatarChoice = {
  character:number; outfit:'hoodie'|'shirt'|'jacket'
  accessory:'none'|'glasses'|'cap'; style:AvatarFlag
}

export const defaultAvatar:AvatarChoice={character:1,outfit:'hoodie',accessory:'none',style:'brasil'}
const heads=[
  require('../../assets/images/avatars/head-1.png'),
  require('../../assets/images/avatars/head-2.png'),
  require('../../assets/images/avatars/head-3.png'),
  require('../../assets/images/avatars/head-4.png'),
  require('../../assets/images/avatars/head-5.png'),
  require('../../assets/images/avatars/head-6.png'),
  require('../../assets/images/avatars/head-7.png'),
  require('../../assets/images/avatars/head-8.png'),
]
const outfits={
  hoodie:require('../../assets/images/avatars/outfit-hoodie.png'),
  shirt:require('../../assets/images/avatars/outfit-shirt.png'),
  jacket:require('../../assets/images/avatars/outfit-jacket.png'),
}
const accessories={
  glasses:require('../../assets/images/avatars/accessory-glasses.png'),
  cap:require('../../assets/images/avatars/accessory-cap.png'),
}
const defaultOutfits:AvatarChoice['outfit'][]=['hoodie','shirt','shirt','shirt','shirt','shirt','shirt','shirt']
const defaultAccessories:AvatarChoice['accessory'][]=['none','none','glasses','none','none','none','none','none']
// The PNGs are square canvases. Keep their aspect ratio and align their actual
// features, rather than stretching the canvas to make it fit each character.
const eyes=[.40,.43,.41,.42,.43,.49,.42,.44]
const hairTop=[.02,.06,.04,.05,.04,.06,.04,.05]
const collar=[.69,.73,.71,.72,.73,.76,.72,.74]
const outfitNeck:Record<AvatarChoice['outfit'],number>={hoodie:.43,shirt:.49,jacket:.46}
const outfitScale:Record<AvatarChoice['outfit'],number>={hoodie:1.05,shirt:1.05,jacket:1.05}

export function avatarForCharacter(character:number,style:AvatarFlag='brasil'):AvatarChoice{
  const index=Math.max(0,Math.min(7,character-1))
  return {character:index+1,outfit:defaultOutfits[index],accessory:defaultAccessories[index],style}
}

export function AvatarPortrait({avatar,size=96}:{avatar:AvatarChoice;size?:number}){
  const index=Math.max(0,Math.min(7,avatar.character-1))
  const flag=AVATAR_FLAGS.find(item=>item.id===avatar.style)||AVATAR_FLAGS[0]
  const garmentSize=size*outfitScale[avatar.outfit]
  const garmentLeft=(size-garmentSize)/2
  const garmentTop=size*collar[index]-garmentSize*outfitNeck[avatar.outfit]
  const glassesSize=size*.56
  // The lenses occupy the middle of the square accessory asset.
  const glassesTop=size*eyes[index]-glassesSize*.52
  const capSize=size*.62
  const capTop=size*hairTop[index]-capSize*.12
  const garmentStyle={position:'absolute' as const,left:garmentLeft,top:garmentTop,
    width:garmentSize,height:garmentSize}
  return <View accessibilityLabel={`Avatar, personagem ${avatar.character}, bandeira de ${flag.name}`}
    style={{width:size,height:size,borderRadius:size/2,overflow:'hidden',backgroundColor:'#e6efff',
      borderWidth:Math.max(1,size*.012),borderColor:'#fff'}}>
    <Text aria-hidden style={{position:'absolute',width:size,height:size,textAlign:'center',textAlignVertical:'center',
      fontSize:size*.79,lineHeight:size,opacity:.25}}>{flag.flag}</Text>
    <Image source={outfits[avatar.outfit]} resizeMode="contain" style={garmentStyle} />
    <Image source={heads[index]} resizeMode="contain" style={{position:'absolute',width:size,height:size}} />
    {/* The collar sits over the cut edge of the generated neck. Keep long hair
        visible on both sides by limiting this foreground layer to the centre. */}
    <View pointerEvents="none" style={{position:'absolute',left:size*.33,top:size*(collar[index]+.055),
      width:size*.34,height:size*(1-collar[index]-.055),overflow:'hidden'}}>
      <Image source={outfits[avatar.outfit]} resizeMode="contain"
        style={{...garmentStyle,left:garmentLeft-size*.33,top:garmentTop-size*(collar[index]+.055)}} />
    </View>
    {avatar.accessory==='glasses'&&<Image source={accessories.glasses} resizeMode="contain"
      style={{position:'absolute',left:(size-glassesSize)/2,top:glassesTop,
        width:glassesSize,height:glassesSize}} />}
    {avatar.accessory==='cap'&&<Image source={accessories.cap} resizeMode="contain"
      style={{position:'absolute',left:(size-capSize)/2,top:capTop,
        width:capSize,height:capSize}} />}
    <View aria-hidden style={{position:'absolute',right:size*.025,top:size*.035,width:size*.23,height:size*.23,
      borderRadius:size*.12,backgroundColor:'#fffffff0',alignItems:'center',justifyContent:'center'}}>
      <Text style={{fontSize:size*.17,lineHeight:size*.23}}>{flag.flag}</Text>
    </View>
  </View>
}
