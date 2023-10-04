import { useFonts } from 'expo-font';
import { React } from 'react';
import { View } from 'react-native';
import Text from '../general/Text';

/**
 * Component for showing an alert below a form field
 * @param {Object} props should contain the following properties:
 * - label: String
 * @returns {React.Element} JSX element for showing alerts
 */
export default function FormFieldAlert(props) {
  const [loaded] = useFonts({
    fontFileName: require("../../assets/fonts/Montserrat-Regular.ttf")
  });

  return (
    <View className="flex-row items-center">
      <Text className={"text-xs text-error mx-2"}>
        {/* Passwords must match */}
        {props.label}
      </Text>
    </View>
  )
}