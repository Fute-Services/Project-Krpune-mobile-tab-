import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';

import Home from '../screens/Home';
import Location from '../screens/Location';
import VR from '../screens/VR';
import Amenities from '../screens/Amenities';
import ProjectDetails from '../screens/ProjectDetails';
import UnitPlan from '../screens/UnitPlan';
import Mobility from '../screens/Mobility';
import VerticalTransport from '../screens/VerticalTransport';
import Blueprint from '../screens/Blueprint';
import AboutUs from '../screens/AboutUs';
import Walkthrough from '../screens/Walkthrough';
import Gallery from '../screens/Gallery';
import Overview from '../screens/Overview';
import Sustainability from '../screens/Sustainability';
import ConceptSummary from '../screens/ConceptSummary';
import ProjectInfo from '../screens/ProjectInfo';
import Construction from '../screens/Construction';
import TerraceLevel from '../screens/TerraceLevel';
import PodiumLevel from '../screens/PodiumLevel';
import LobbyReception from '../screens/LobbyReception';
import GroundLevel from '../screens/GroundLevel';
import Fitout from '../screens/Fitout';
import CirculationPlan from '../screens/CirculationPlan';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: '#0b1020' },
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Location" component={Location} />
      <Stack.Screen name="VR" component={VR} />
      <Stack.Screen name="Amenities" component={Amenities} />
      <Stack.Screen name="ProjectDetails" component={ProjectDetails} />
      <Stack.Screen name="UnitPlan" component={UnitPlan} />
      <Stack.Screen name="Mobility" component={Mobility} />
      <Stack.Screen name="VerticalTransport" component={VerticalTransport} />
      <Stack.Screen name="Blueprint" component={Blueprint} />
      <Stack.Screen name="AboutUs" component={AboutUs} />
      <Stack.Screen name="Walkthrough" component={Walkthrough} />
      <Stack.Screen name="Gallery" component={Gallery} />
      <Stack.Screen name="Overview" component={Overview} />
      <Stack.Screen name="Sustainability" component={Sustainability} />
      <Stack.Screen name="ConceptSummary" component={ConceptSummary} />
      <Stack.Screen name="ProjectInfo" component={ProjectInfo} />
      <Stack.Screen name="Construction" component={Construction} />
      <Stack.Screen name="TerraceLevel" component={TerraceLevel} />
      <Stack.Screen name="PodiumLevel" component={PodiumLevel} />
      <Stack.Screen name="LobbyReception" component={LobbyReception} />
      <Stack.Screen name="GroundLevel" component={GroundLevel} />
      <Stack.Screen name="Fitout" component={Fitout} />
      <Stack.Screen name="CirculationPlan" component={CirculationPlan} />
    </Stack.Navigator>
  );
}
