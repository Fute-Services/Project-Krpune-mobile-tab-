import { Pressable, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import nightIcon from '../assets/night_icon.png';

/** Circular glass "floating-btn" used across Home controls. */
export function FloatingButton({
  onPress,
  children,
  size = 54,
}: {
  onPress?: () => void;
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.85 }}>
      <LinearGradient
        colors={['#105ca8a6', '#062442b0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.btn, { width: size, height: size, borderRadius: size / 2 }]}
      >
        {children}
      </LinearGradient>
    </Pressable>
  );
}

export default function DayNightToggle({
  isNight,
  onToggle,
  size = 54,
}: {
  isNight: boolean;
  onToggle: () => void;
  size?: number;
}) {
  const iconSize = Math.round(size * 0.44);
  return (
    <FloatingButton onPress={onToggle} size={size}>
      {isNight ? (
        <Image
          source={nightIcon}
          style={[styles.icon, { width: iconSize, height: iconSize }]}
          resizeMode="contain"
        />
      ) : (
        <Svg height={iconSize} width={iconSize} viewBox="0 -960 960 960" fill="#ffffff">
          <Path d="M565-395q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Zm-226.5 56.5Q280-397 280-480t58.5-141.5Q397-680 480-680t141.5 58.5Q680-563 680-480t-58.5 141.5Q563-280 480-280t-141.5-58.5ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z" />
        </Svg>
      )}
    </FloatingButton>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: { width: 24, height: 24, tintColor: '#ffffff' },
});
