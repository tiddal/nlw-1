import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import {
	Container,
	Main,
	Title,
	Description,
	Footer,
	Button,
	ButtonIcon,
	ButtonText,
	Input,
} from './styles';

const Home: React.FC = () => {
	const { navigate } = useNavigation();
	const [uf, setUf] = useState('');
	const [city, setCity] = useState('');

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
		>
			<Container>
				<Main>
					<Image source={require('../../assets/logo.png')} />
					<View>
						<Title>O marketplace de recolha de resíduos</Title>
						<Description>
							Ajudamos pessoas a encontrar pontos de recolha de forma eficiente.
						</Description>
					</View>
				</Main>
				<Footer>
					<Input
						placeholder="UF"
						value={uf}
						maxLength={2}
						autoCapitalize="characters"
						autoCorrect={false}
						onChangeText={setUf}
					/>

					<Input
						placeholder="Cidade"
						autoCorrect={false}
						value={city}
						onChangeText={setCity}
					/>

					<Button onPress={() => navigate('Points', { uf, city })}>
						<ButtonIcon>
							<Icon name="arrow-right" color="#FFF" size={24} />
						</ButtonIcon>
						<ButtonText>Entrar</ButtonText>
					</Button>
				</Footer>
			</Container>
		</KeyboardAvoidingView>
	);
};

export default Home;
