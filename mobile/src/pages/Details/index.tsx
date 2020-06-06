import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import { Feather as Icon, FontAwesome5 } from '@expo/vector-icons';
import { composeAsync } from 'expo-mail-composer';
import {
	Container,
	PointImage,
	PointName,
	PointItems,
	Address,
	AddressContent,
	AddressTitle,
	Button,
	ButtonText,
	Footer,
} from './styles';
import api from '../../services/api';

interface IParams {
	point_id: number;
}

interface IData {
	image: string;
	name: string;
	email: string;
	whatsapp: string;
	city: string;
	uf: string;
	items: {
		title: string;
	}[];
}

const Details: React.FC = () => {
	const [data, setData] = useState<IData>({} as IData);
	const { goBack } = useNavigation();
	const { point_id } = useRoute().params as IParams;

	useEffect(() => {
		async function getDetails() {
			const response = await api.get(`points/${point_id}`);
			setData(response.data);
		}
		getDetails();
	}, []);

	function handleComposeMail() {
		composeAsync({
			subject: 'Iteresse na recolha de resíduos',
			recipients: [data.email],
		});
	}

	function handleWhatsapp() {
		Linking.openURL(`whatsapp://send?phone=${data.whatsapp}`);
	}

	if (!data.name) {
		return null;
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Container>
				<TouchableOpacity onPress={() => goBack()}>
					<Icon name="arrow-left" size={20} color="#34cb79" />
				</TouchableOpacity>
				<PointImage
					source={{
						uri: data.image,
					}}
				/>
				<PointName>{data.name}</PointName>
				<PointItems>
					{data.items.map(({ title }) => title).join(', ')}
				</PointItems>
				<Address>
					<AddressTitle>Morada</AddressTitle>
					<AddressContent>
						{data.city}, {data.uf}
					</AddressContent>
				</Address>
			</Container>
			<Footer>
				<Button onPress={handleWhatsapp}>
					<FontAwesome5 name="whatsapp" size={20} color="#fff" />
					<ButtonText>Whatsapp</ButtonText>
				</Button>
				<Button onPress={handleComposeMail}>
					<Icon name="mail" size={20} color="#fff" />
					<ButtonText>Email</ButtonText>
				</Button>
			</Footer>
		</SafeAreaView>
	);
};

export default Details;
