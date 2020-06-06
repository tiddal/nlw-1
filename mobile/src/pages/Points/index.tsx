import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
	requestPermissionsAsync,
	getCurrentPositionAsync,
} from 'expo-location';
import api from '../../services/api';

import { Feather as Icon } from '@expo/vector-icons';
import { SvgUri as Svg } from 'react-native-svg';
import {
	Container,
	Title,
	Description,
	MapContainer,
	Map,
	ItemsContainer,
	Item,
	ItemTitle,
	MapMarker,
	MapMarkerContainer,
	MapMarkerTitle,
	MapMarkerImage,
} from './styles';

interface Item {
	id: number;
	title: string;
	item_url: string;
}

interface Point {
	id: number;
	name: string;
	image: string;
	latitude: number;
	longitude: number;
}

interface IParams {
	uf: string;
	city: string;
}

const Points: React.FC = () => {
	const { goBack, navigate } = useNavigation();
	const [items, setItems] = useState<Item[]>([]);
	const [points, setPoints] = useState<Point[]>([]);
	const [selectedItems, setSelectedItems] = useState<number[]>([]);
	const [initialPosition, setInitialPosition] = useState<[number, number]>([
		0,
		0,
	]);
	const { uf, city } = useRoute().params as IParams;

	useEffect(() => {
		async function getItems() {
			const response = await api.get('items');
			setItems(response.data);
		}
		getItems();
	}, []);

	useEffect(() => {
		async function getPoints() {
			const response = await api.get('points', {
				params: {
					city,
					uf,
					items: selectedItems,
				},
			});
			setPoints(response.data);
		}
		getPoints();
	}, [selectedItems]);

	useEffect(() => {
		async function loadPosition() {
			const { status } = await requestPermissionsAsync();
			if (status !== 'granted') {
				Alert.alert('Precisamos da sua premissão para obter a localização');
				return;
			}
			const {
				coords: { latitude, longitude },
			} = await getCurrentPositionAsync();
			setInitialPosition([latitude, longitude]);
		}
		loadPosition();
	}, []);

	function handleSelectedItem(id: number) {
		selectedItems.includes(id)
			? setSelectedItems(selectedItems.filter((item) => item !== id))
			: setSelectedItems([...selectedItems, id]);
	}

	return (
		<>
			<Container>
				<TouchableOpacity onPress={() => goBack()}>
					<Icon name="arrow-left" size={20} color="#34cb79" />
				</TouchableOpacity>
				<Title>Bem-vindo.</Title>
				<Description>Encontre no mapa um ponto de recolha.</Description>
				<MapContainer>
					{initialPosition[0] !== 0 && (
						<Map
							initialRegion={{
								latitude: initialPosition[0],
								longitude: initialPosition[1],
								latitudeDelta: 0.014,
								longitudeDelta: 0.014,
							}}
						>
							{points.map((point) => (
								<MapMarker
									key={String(point.id)}
									coordinate={{
										latitude: point.latitude,
										longitude: point.longitude,
									}}
									onPress={() => navigate('Details', { point_id: point.id })}
								>
									<MapMarkerContainer>
										<MapMarkerImage
											source={{
												uri: point.image,
											}}
										/>
										<MapMarkerTitle>{point.name}</MapMarkerTitle>
									</MapMarkerContainer>
								</MapMarker>
							))}
						</Map>
					)}
				</MapContainer>
			</Container>
			<ItemsContainer>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ paddingHorizontal: 20 }}
				>
					{items.map((item) => (
						<Item
							key={String(item.id)}
							onPress={() => {
								handleSelectedItem(item.id);
							}}
							activeOpacity={0.6}
							selected={selectedItems.includes(item.id)}
						>
							<Svg width={42} height={42} uri={item.item_url} />
							<ItemTitle>{item.title}</ItemTitle>
						</Item>
					))}
				</ScrollView>
			</ItemsContainer>
		</>
	);
};

export default Points;
