import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';
import api from '../../services/api';

import { Container, Input, InputGroup } from './styles';
import Header from '../../components/Header';
import { LeafletMouseEvent } from 'leaflet';
import { useHistory } from 'react-router-dom';
import Dropzone from '../../components/Dropzone';

interface Item {
	id: number;
	title: string;
	item_url: string;
}

interface IBGEUFResponse {
	sigla: string;
}

interface IBGECityResponse {
	nome: string;
}

const CreatePoint: React.FC = () => {
	const history = useHistory();

	const [items, setItems] = useState<Item[]>([]);
	const [ufs, setUFs] = useState<string[]>([]);
	const [cities, setCities] = useState<string[]>([]);
	const [initialPosition, setInitialPosition] = useState<[number, number]>([
		38.7105414,
		-9.1509587,
	]);
	const [selectedUF, setSelectedUF] = useState<string>();
	const [selectedCity, setselectedCity] = useState<string>();
	const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
		0,
		0,
	]);
	const [selectedItems, setSelectedItems] = useState<number[]>([]);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		whatsapp: '',
	});
	const [selectedFile, setSelectedFile] = useState<File>();

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(({ coords }) =>
			setInitialPosition([coords.latitude, coords.longitude])
		);
	}, []);

	useEffect(() => {
		async function getItems() {
			const response = await api.get('items');
			setItems(response.data);
		}
		getItems();
	}, []);

	useEffect(() => {
		async function getUFs() {
			const response = await axios.get<IBGEUFResponse[]>(
				'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
			);
			const ufInitials = response.data.map(({ sigla }) => sigla);
			setUFs(ufInitials);
		}
		getUFs();
	}, []);

	useEffect(() => {
		async function getCities(uf: string) {
			const response = await axios.get<IBGECityResponse[]>(
				`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
			);
			const citiesName = response.data.map(({ nome }) => nome);
			setCities(citiesName);
		}
		if (selectedUF) getCities(selectedUF);
	}, [selectedUF]);

	function handleInputChange({ target }: ChangeEvent<HTMLInputElement>) {
		const { name, value } = target;
		setFormData({ ...formData, [name]: value });
	}

	function handleSelectedItem(id: number) {
		selectedItems.includes(id)
			? setSelectedItems(selectedItems.filter((item) => item !== id))
			: setSelectedItems([...selectedItems, id]);
	}

	async function handleSubmission(event: FormEvent) {
		event.preventDefault();
		const { name, email, whatsapp } = formData;
		const uf = selectedUF;
		const city = selectedCity;
		const [latitude, longitude] = selectedPosition;
		const items = selectedItems;
		const image = selectedFile;
		const data = new FormData();

		data.append('name', name);
		data.append('email', email);
		data.append('whatsapp', whatsapp);
		data.append('uf', String(uf));
		data.append('city', String(city));
		data.append('latitude', String(latitude));
		data.append('longitude', String(longitude));
		data.append('items', items.join(','));
		if (image) {
			data.append('image', image);
		}

		await api.post('points', data);
		history.push('/');
	}

	return (
		<Container>
			<Header
				link={{ path: '/', icon: <FiArrowLeft />, text: 'Voltar para Home' }}
			/>
			<form onSubmit={handleSubmission}>
				<h1>Registo do ponto de recolha</h1>
				<Dropzone onFileUpload={setSelectedFile} />
				<fieldset>
					<legend>
						<h2>Dados</h2>
					</legend>
					<Input>
						<label htmlFor="name">Nome da entidade</label>
						<input
							type="text"
							name="name"
							id="name"
							onChange={handleInputChange}
						/>
					</Input>
					<InputGroup>
						<Input>
							<label htmlFor="email">E-mail</label>
							<input
								type="email"
								name="email"
								id="email"
								onChange={handleInputChange}
							/>
						</Input>
						<Input>
							<label htmlFor="whatsapp">Whatsapp</label>
							<input
								type="text"
								name="whatsapp"
								id="whatsapp"
								onChange={handleInputChange}
							/>
						</Input>
					</InputGroup>
				</fieldset>
				<fieldset>
					<legend>
						<h2>Morada</h2>
						<span>Selecione a morada no mapa</span>
					</legend>
					<Map
						center={initialPosition}
						zoom={15}
						className="map"
						onClick={(event: LeafletMouseEvent) =>
							setSelectedPosition([event.latlng.lat, event.latlng.lng])
						}
					>
						<TileLayer
							attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						<Marker position={selectedPosition} />
					</Map>
					<InputGroup>
						<Input>
							<label htmlFor="uf">UF</label>
							<select
								name="uf"
								id="uf"
								value={selectedUF}
								onChange={({ target }) => setSelectedUF(target.value)}
							>
								<option value="0">Selecione uma UF</option>
								{ufs.map((uf) => (
									<option key={uf} value={uf}>
										{uf}
									</option>
								))}
							</select>
						</Input>
						<Input>
							<label htmlFor="city">Cidade</label>
							<select
								name="city"
								id="city"
								value={selectedCity}
								onChange={({ target }) => setselectedCity(target.value)}
							>
								<option value="0">Selecione uma cidade</option>
								{cities.map((city) => (
									<option key={city} value={city}>
										{city}
									</option>
								))}
							</select>
						</Input>
					</InputGroup>
				</fieldset>
				<fieldset>
					<legend>
						<h2>Resíduos</h2>
						<span>Selecione um ou mais tipos de resíduos</span>
					</legend>
					<ul>
						{items.map((item) => (
							<li
								key={item.id}
								className={selectedItems.includes(item.id) ? 'selected' : ''}
								onClick={() => handleSelectedItem(item.id)}
							>
								<img src={item.item_url} alt={item.title} />
								<span>{item.title}</span>
							</li>
						))}
					</ul>
				</fieldset>
				<button type="submit">Registar ponto de recolha</button>
			</form>
		</Container>
	);
};

export default CreatePoint;
