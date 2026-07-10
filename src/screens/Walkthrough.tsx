import FullScreenVideo from '../components/FullScreenVideo';

// Web: Vimeo iframe (video 1184042049). Offline: local walkthrough.mp4 (user-supplied).
export default function WalkthroughScreen() {
  return <FullScreenVideo videoKey="walkthrough" title="Walkthrough" />;
}
