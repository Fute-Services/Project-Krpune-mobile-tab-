import { goBack } from '../navigation/navigationRef';
import AboutUs from '../components/ProjectDetails/AboutUs';

/**
 * AboutUs screen — converted from web pages/AboutUs.
 * Renders the shared AboutUs overview card. Web `window.history.back()` -> goBack().
 */
export default function AboutUsScreen() {
  const handleClose = () => goBack();
  const handleOpen = () => {};
  return <AboutUs handleClose={handleClose} handleOpen={handleOpen} />;
}
