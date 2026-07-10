import { View, Text, Image, StyleSheet } from 'react-native';
import { resolveAsset } from '../offline/resolveAsset';
import BackButton from '../components/BackButton';

/**
 * Blueprint screen — converted from web BluePrintPage.
 * Reads { unit, floor, image } from route params. The `image` is a remote URL
 * string resolved to a bundled asset via resolveAsset.
 */
export default function BlueprintScreen({ route }: any) {
  const floor: string | undefined = route?.params?.floor;
  const image: string | undefined = route?.params?.image;
  const source = resolveAsset(image);

  return (
    <View style={styles.root}>
      {source ? (
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Unit Specifications</Text>
            <Text style={styles.floorLine}>
              Floor <Text style={styles.floorValue}>{floor}</Text>
            </Text>
          </View>

          <View style={styles.imageWrap}>
            <Image source={source} style={styles.image} resizeMode="contain" />
          </View>
        </View>
      ) : (
        <View style={styles.notFound}>
          <View style={styles.badge}>
            <Text style={styles.badgeMark}>!</Text>
          </View>
          <Text style={styles.notFoundText}>Unit not found</Text>
        </View>
      )}

      <BackButton />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  content: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  header: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  eyebrow: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 5,
    color: '#737373',
    marginBottom: 4,
  },
  floorLine: {
    fontSize: 28,
    fontWeight: '300',
    color: '#171717',
    margin: 10,
  },
  floorValue: {
    fontWeight: '600',
    fontSize: 20,
  },
  imageWrap: {
    width: '65%',
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  notFound: {
    marginTop: 80,
    alignItems: 'center',
    gap: 16,
  },
  badge: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeMark: {
    color: '#dc2626',
    fontSize: 20,
  },
  notFoundText: {
    color: '#991b1b',
    fontWeight: '500',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#fee2e2',
    overflow: 'hidden',
  },
});
