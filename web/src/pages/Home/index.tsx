import React from 'react';

import { FiLogIn } from 'react-icons/fi';

import { Container, Content } from './styles';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';

const Home: React.FC = () => {
	return (
		<Container>
			<Content>
				<Header />

				<main>
					<h1>O marketplace de recolha de resíduos.</h1>
					<p>
						Ajudamos pessoas a encontrar pontos de recolha de forma eficiente.
					</p>

					<Link to="/create-point">
						<span>
							<FiLogIn />
						</span>
						<strong>Registe um ponto de recolha</strong>
					</Link>
				</main>
			</Content>
		</Container>
	);
};

export default Home;
