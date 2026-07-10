// Central route map — mirrors the web app's react-router routes 1:1.
export type RootStackParamList = {
  Home: undefined;
  Location: undefined;
  VR: undefined;
  Amenities: undefined;
  ProjectDetails: undefined;
  UnitPlan: { id: string };
  Mobility: undefined;
  VerticalTransport: undefined;
  Blueprint: { unit?: string; floor?: string; image?: any } | undefined;
  AboutUs: undefined;
  Walkthrough: undefined;
  Gallery: undefined;
  Overview: undefined;
  Sustainability: undefined;
  ConceptSummary: undefined;
  ProjectInfo: undefined;
  Construction: undefined;
  TerraceLevel: undefined;
  PodiumLevel: undefined;
  LobbyReception: undefined;
  GroundLevel: undefined;
  Fitout: undefined;
  CirculationPlan: undefined;
};

// Route names where the persistent Sidebar is shown (web RootLayout sidebarRoutes).
export const SIDEBAR_ROUTES: (keyof RootStackParamList)[] = [
  'Home',
  'ProjectDetails',
  'Location',
  'Amenities',
  'VR',
];
