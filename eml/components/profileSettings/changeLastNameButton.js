import React, { useEffect, useState } from 'react';
import {
	View,
	TextInput,
	TouchableOpacity,
	Modal,
	Alert,
	ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUserFields } from '../../api/userApi.js';
import Text from '../general/Text';
import { getUserInfo } from '../../services/StorageService.js';

let LOGIN_TOKEN;
const USER_INFO = '@userInfo';

export default function ProfileComponent() {
	const [id, setId] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [newLastName, setNewLastName] = useState('');
	const [lastNameModalVisible, setLastNameModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false); // Add a loading state

	const getProfile = async () => {
		try {
			const fetchedProfile = getUserInfo();

			if (fetchedProfile !== null) {
				setId(fetchedProfile.id);
				setFirstName(fetchedProfile.firstName);
				setLastName(fetchedProfile.lastName);
				setEmail(fetchedProfile.email);
				LOGIN_TOKEN = await AsyncStorage.getItem('@loginToken');
			}
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		getProfile();
	}, []);

	const saveLastNameChanges = async () => {
		if (newLastName !== lastName) {
			// Call the updateUserName function to update the username on the server
			try {
				setIsLoading(true); // Set loading state to true

				await updateUserFields(id, { lastName: newLastName }, LOGIN_TOKEN);


				// Update the state with the new username and close modal
				setLastName(newLastName);

				// Save changes to AsyncStorage or your API
				const updatedProfile = {
					id,
					firstName,
					lastName: newLastName,
					email,
				};

				await AsyncStorage.setItem(USER_INFO, JSON.stringify(updatedProfile));
				setLastNameModalVisible(false);
			} catch (error) {
				Alert.alert('Alerta', 'Erro ao atualizar o nome, tente novamente', error.message);
			} finally {
				setIsLoading(false); // Set loading state to false after the operation
			}
		} else {
			Alert.alert('Alerta', 'Nome não foi alterado');
		}
		setIsLoading(false);
	};

	return (
		<View>
			<Text className="text-left text-caption-medium text-black mb-2">Sobrenome</Text>
			<TouchableOpacity
				className="bg-projectWhite px-5 py-4 rounded-medium w-full"
				onPress={() => setLastNameModalVisible(true)}
			>
				<Text 
					className="text-left text-body text-gray">
					{lastName}
				</Text>
			</TouchableOpacity>

			{/* Editable Username Modal */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={lastNameModalVisible}
				onRequestClose={() => setLastNameModalVisible(false)}
			>
				<View className="flex justify-center items-center h-full bg-opacity-50 bg-black">
					<View className="bg-projectLightGray p-4 rounded-lg w-11/12 max-w-md">
						<View className="flex flex-col items-center">
							<TextInput
								value={newLastName}
								onChangeText={setNewLastName}
								placeholder="Digite o novo nome"
								className="w-full p-4 mb-4 bg-projectWhite rounded"
							/>
							{isLoading ? ( // Conditional rendering based on loading state
								<ActivityIndicator size="large" color="#0000ff" /> // Loading spinner
							) : (
								<TouchableOpacity
									className="bg-primary px-10 py-4 rounded-medium w-full"
									onPress={() => saveLastNameChanges()}
								>
									<Text
										className="text-center font-sans-bold text-body text-projectWhite">
                        Salvar alterações
									</Text>
								</TouchableOpacity>
							)}
							<TouchableOpacity
								className="px-10 py-4 rounded-medium w-full mt-2 border-0 border-opacity-0"
								onPress={() => setLastNameModalVisible(false)}
							>
								<Text className="text-black text-center font-sans-bold">Cancelar</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}  