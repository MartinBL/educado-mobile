import React, { useEffect, useState } from "react";
import { Alert, View, Text } from "react-native";
import { registerUser } from "../../api/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormTextField from "./FormTextField";
import FormButton from "./FormButton";
import PasswordEye from "./PasswordEye";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ShowAlert from "../general/ShowAlert";
import FormFieldAlert from "./FormFieldAlert";

const USER_INFO = "@userInfo";

/**
 * Component for logging into application, used on login screen and in registerform
 * @param {Object} props not used in this component as of now
 */
export default function LoginForm(props) {

  const [realName, setRealName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailAlert, setEmailAlert] = useState("");
  const [nameAlert, setNameAlert] = useState("");
  const [isAllInputValid, setIsAllInputValid] = useState(true);
  const [confirmPasswordAlert, setConfirmPasswordAlert] = useState("");

  // State variable to track password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password Constraint variables
  const [passwordContainsLetter, setPasswordContainsLetter] = useState(false);
  const [passwordLengthValid, setPasswordLengthValid] = useState(false);

  // Function to toggle the password visibility state
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    // clearing input
    setNameAlert("");
    setEmailAlert("");
    setIsAllInputValid(false);
    setConfirmPasswordAlert("");
    setRealName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }, []);

  useEffect(() => {
    validateInput();
  }, [nameAlert, emailAlert, passwordLengthValid, passwordContainsLetter, confirmPasswordAlert]);

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const checkPasswordContainsLetter = (password) => {
    // TODO: Brazilian letters needs to be included
    const regex = /.*\p{L}.*$/u;
    const containsLetter = regex.test(password);
    setPasswordContainsLetter(containsLetter);
  };

  const checkPasswordLength = (password) => {
    const lengthValid = password.length > 7;
    setPasswordLengthValid(lengthValid);
  };

  /**
   * Function for registering a new user in the database
   * @param {String} realName 
   * @param {String} email 
   * @param {String} password
   */
  async function register(realName, email, password) {
    validateInput(realName, email, password)
    if(!isAllInputValid) {
      return;
    }

    const obj = {
      name: realName,
      email: email,
      password: password,
    };

    try {
      await registerUser(obj)
        .then(async function (response) {
          await createProfile(response._id, realName, email);
        })
        .catch((error) => {
          switch (error.message) {
            case "Request failed with status code 400":
              //Invalid user data
              ShowAlert("Dados de usuário inválidos!");
              break;
            default:
              console.log(error);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Function for validating all input fields' content
   */
  function validateInput() {
    if (nameAlert === "" && emailAlert === "" && passwordLengthValid
      && passwordContainsLetter && confirmPasswordAlert === "") {
      setIsAllInputValid(true);
    } else {
      setIsAllInputValid(false);
    }
  }

  /**
   * Stores the user info in async storage
   * @param {*} id user id
   * @param {*} realName 
   * @param {*} email 
   */
  async function createProfile(id, realName, email) {
    try {
      const obj = {
        id: id,
        realName: realName,
        email: email,
      };

      await AsyncStorage.setItem(USER_INFO, JSON.stringify(obj));
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Validates the email according to the email pattern and 
   * sets the state variable accordingly
   * @param {String} email 
   */
  const validateEmail = (email) => {
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (emailPattern.test(email)) {
      setEmailAlert("");
    } else {
      setEmailAlert("Email inválido"); // Email invalid
    }
  }

  /**
   * Validates the real name according to the real name pattern and 
   * sets the state variable accordingly
   * @param {String} realName 
   */
  const validateRealName = (realName) => {
    const realNamePattern = /^(\p{L}+[- '])*\p{L}+$/u;

    if (realNamePattern.test(realName) && realName.length > 1) {
      setNameAlert("");
    } else {
      setNameAlert("Nome inválido"); // Invalid name
    }
  }

  /**
   * Function for validating the password input. It checks if the password contains any emojis and if so it does not change the password state variable.
   * @param {Function} setPasswordFunction 
   * @param {string} passwordInput current input in password field
   * @param {boolean} confirm whether the password is from the confirmation field or not
   * @returns either the password state variable or the confirm password state variable depending on the confirm parameter
   */
  const validatePasswordInput = (setPasswordFunction, passwordInput, confirm) => {
    const emojipattern = /\uD83C\uDFF4(?:\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74)\uDB40\uDC7F|\u200D\u2620\uFE0F)|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3]))|\uD83D\uDC69\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83D\uDC69\u200D[\u2695\u2696\u2708])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC68(?:\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])|(?:[#*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDD1-\uDDDD])/g

    if (!emojipattern.test(passwordInput)) {
      setPasswordFunction(passwordInput);
      return passwordInput;
    }
    return confirm ? confirmPassword : password;
  }

  const checkIfPasswordsMatch = (password, confirmPassword) => {
    if (password === confirmPassword) {
      setConfirmPasswordAlert("");
    } else {
      setConfirmPasswordAlert("As senhas devem corresponder");
    }
  }

  return (
    <View>
      <View className="mb-6">
        <FormTextField
          label="Nome"
          name={"Name"}
          value={realName}
          //Real name
          placeholder="Nome Sobrenome"
          required={true}
          onChangeText={(realName) => {
            setRealName(realName); validateRealName(realName);
          }}
        />
        <FormFieldAlert label={nameAlert} />
      </View>
      <View className="mb-6">
        <FormTextField
          className="mb-6"
          label="Email"
          name={"Email"}
          value={email}
          //Email
          placeholder="user@email.com"
          keyboardType="email-address"
          required={true}
          onChangeText={(email) => { setEmail(email); validateEmail(email); }}
        />
        <FormFieldAlert label={emailAlert} />
      </View>
      <View className="mb-6">
        <View className="relative">
          <FormTextField
            label="Senha"
            name={"password"}
            value={password}
            //Password
            placeholder="Entre sua senha" // Enter your password
            placeholderTextColor="grey"
            secureTextEntry={!showPassword}
            required={true}
            onChangeText={(password) => {
              password = validatePasswordInput(setPassword, password, false);
              checkPasswordContainsLetter(password);
              checkPasswordLength(password);
              checkIfPasswordsMatch(password, confirmPassword);
            }}
          />
          <PasswordEye
            showPasswordIcon={showPassword}
            toggleShowPassword={toggleShowPassword}
          />
        </View>

        <View className="flex-row justify-start mt-1 h-6">
          <Text className={"text-xs font-montserrat" + ((passwordLengthValid || !password) ? " text-gray" : " text-error")}>
            {/* Minimum 8 characters */}
            • Mínimo 8 caracteres
          </Text>
          <View className="flex-row items-center -translate-y-1">
            {passwordLengthValid ? (
              <MaterialCommunityIcons name="check" size={20} color="#4AA04A" />
            ) : null}
          </View>
        </View>
        <View className="flex-row justify-start h-6">
          <Text className={"text-xs font-montserrat" + ((passwordContainsLetter || !password) ? " text-gray" : " text-error")}>
            {/* Must contain at least one letter */}
            • Conter pelo menos uma letra
          </Text>
          <View className="flex-row items-center -translate-y-1">
            {passwordContainsLetter ? (
              <MaterialCommunityIcons name="check" size={20} color="#4AA04A"/>
            ) : null}
          </View>
        </View>
      </View>
      {/* TODO: compare password with confirm password and give error if not same.*/}
      <View className="mb-6">
        <View className="relative">
          <FormTextField
            label="Confirmar Senha" // Confirm password
            value={confirmPassword}
            onChangeText={(confirmPassword) => {
              confirmPassword = validatePasswordInput(setConfirmPassword, confirmPassword, true);
              checkIfPasswordsMatch(password, confirmPassword);
            }
            }
            placeholder="Confirme sua senha" // Confirm your password
            secureTextEntry={!showConfirmPassword}
            required={true}
          />
          <PasswordEye
            showPasswordIcon={showConfirmPassword}
            toggleShowPassword={toggleShowConfirmPassword}
          />
        </View>
        <FormFieldAlert label={confirmPasswordAlert} />
      </View>
      <View className="my-10">
        <FormButton
          onPress={() => register(realName, email, password)}
          label="Cadastrar" // Register
          disabled={!isAllInputValid}
        />
      </View>
    </View>
  );
}
