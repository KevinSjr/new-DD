import { Tabs } from 'expo-router'
import { View } from 'react-native'
import { AppIcon } from '../../components/AppIcon'
import { theme } from '../../theme'

type IconName = 'home'|'globe'|'search'|'journey'|'person'
function tabIcon(name:IconName, focused:boolean) {
  return <View style={{ width:42,height:32,alignItems:'center',justifyContent:'center',borderRadius:13,backgroundColor:focused ? theme.pale : 'transparent' }}>
    <AppIcon name={name} size={23} color={focused ? theme.blue : theme.muted} />
  </View>
}

export default function TabsLayout() {
  return <Tabs screenOptions={{ headerShown:false, tabBarActiveTintColor:theme.blue,
    tabBarInactiveTintColor:theme.muted, tabBarStyle:{ backgroundColor:theme.white, borderTopColor:theme.border, height:68, paddingTop:5, paddingBottom:6 },
    tabBarLabelStyle:{ fontSize:11, fontWeight:'700' } }}>
    <Tabs.Screen name="index" options={{ title:'Início',tabBarIcon:({focused})=>tabIcon('home',focused) }} />
    <Tabs.Screen name="paises" options={{ title:'Países',tabBarIcon:({focused})=>tabIcon('globe',focused) }} />
    <Tabs.Screen name="bolsas" options={{ title:'Buscar',tabBarIcon:({focused})=>tabIcon('search',focused) }} />
    <Tabs.Screen name="jornada" options={{ title:'Meu plano',tabBarIcon:({focused})=>tabIcon('journey',focused) }} />
    <Tabs.Screen name="conta" options={{ title:'Perfil',tabBarIcon:({focused})=>tabIcon('person',focused) }} />
  </Tabs>
}
