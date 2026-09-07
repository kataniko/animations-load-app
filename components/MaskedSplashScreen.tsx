import MaskedView from '@react-native-masked-view/masked-view';
import { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    Image,
    StyleSheet,
    View,
} from 'react-native';

import { appColors } from '@/constants/AppColors';

const splashLogo = require('../assets/images/splash-icon.png');
const { height, width } = Dimensions.get('window');
const logoSize = 150;
const finalScale = Math.max(width, height) / logoSize + 4.8;

type MaskedSplashScreenProps = {
  onFinish: () => void;
};

export function MaskedSplashScreen({ onFinish }: MaskedSplashScreenProps) {
  const [isMounted, setIsMounted] = useState(true);
  const [maskScale] = useState(() => new Animated.Value(1));
  const [overlayOpacity] = useState(() => new Animated.Value(1));
  const [logoOpacity] = useState(() => new Animated.Value(0));
  const [haloScale] = useState(() => new Animated.Value(0.76));

  useEffect(() => {
    Animated.sequence([
      Animated.delay(160),
      Animated.parallel([
        Animated.timing(haloScale, {
          toValue: 1,
          duration: 520,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 360,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(maskScale, {
          toValue: finalScale,
          duration: 1180,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 980,
          delay: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setIsMounted(false);
      onFinish();
    });
  }, [haloScale, logoOpacity, maskScale, onFinish, overlayOpacity]);

  if (!isMounted) {
    return null;
  }

  return (
    <Animated.View pointerEvents="none" style={[styles.container, { opacity: overlayOpacity }]}> 
      <View style={styles.stage}>
        <Animated.View style={[styles.halo, { transform: [{ scale: haloScale }] }]} />
        <Image source={splashLogo} style={styles.logoGhost} />
      </View>

      <MaskedView
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        maskElement={
          <View style={styles.maskContainer}>
            <Animated.Image
              source={splashLogo}
              style={[
                styles.maskLogo,
                {
                  opacity: logoOpacity,
                  transform: [{ scale: maskScale }],
                },
              ]}
            />
          </View>
        }>
        <View style={styles.portalFill}>
          <View style={[styles.portalBeam, styles.portalBeamPink]} />
          <View style={[styles.portalBeam, styles.portalBeamGold]} />
          <View style={[styles.portalBeam, styles.portalBeamBlue]} />
        </View>
      </MaskedView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: appColors.background,
    zIndex: 100,
  },
  stage: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    backgroundColor: 'rgba(240, 154, 214, 0.16)',
    borderColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 118,
    borderWidth: 1,
    height: 236,
    position: 'absolute',
    width: 236,
  },
  logoGhost: {
    height: logoSize,
    opacity: 0.22,
    tintColor: appColors.text,
    width: logoSize,
  },
  maskContainer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maskLogo: {
    height: logoSize,
    tintColor: appColors.text,
    width: logoSize,
  },
  portalFill: {
    ...StyleSheet.absoluteFill,
    backgroundColor: appColors.pink,
    overflow: 'hidden',
  },
  portalBeam: {
    borderRadius: 999,
    position: 'absolute',
    transform: [{ rotate: '-22deg' }],
  },
  portalBeamPink: {
    backgroundColor: '#fff7fb',
    height: height * 0.9,
    left: -width * 0.2,
    opacity: 0.82,
    top: -height * 0.1,
    width: width * 0.38,
  },
  portalBeamGold: {
    backgroundColor: appColors.gold,
    height: height * 0.72,
    opacity: 0.84,
    right: width * 0.02,
    top: height * 0.1,
    width: width * 0.32,
  },
  portalBeamBlue: {
    backgroundColor: appColors.lavender,
    bottom: -height * 0.08,
    height: height * 0.58,
    left: width * 0.32,
    opacity: 0.74,
    width: width * 0.28,
  },
});