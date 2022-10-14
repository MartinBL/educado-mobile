import { Video } from 'expo-av'
import { StyleSheet } from 'react-native'
import { React } from 'react'

const LaerningInputVideoExample1 = () => {
  return (
    <Video
      source={{
        uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'
      }}
      rate={1.0}
      volume={1.0}
      isMuted={false}
      resizeMode="cover"
      shouldPlay
      useNativeControls
      isLooping
      style={styles.backgroundVideo}
    />
  )
}

const styles = StyleSheet.create({
  backgroundVideo: {
    height: '100%'
  }
})

export default LaerningInputVideoExample1
