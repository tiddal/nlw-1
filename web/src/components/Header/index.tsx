import React from 'react';

import logo from '../../assets/logo.svg';

import { Container } from './styles';
import { Link } from 'react-router-dom';

interface HeaderProps {
	link?: {
		path: string;
		icon: React.ReactNode;
		text: string;
	};
}

const Header: React.FC<HeaderProps> = ({ link }) => {
	return (
		<Container>
			<img src={logo} alt="Ecoleta" />
			{link && (
				<Link to={link.path}>
					{link.icon} {link.text}
				</Link>
			)}
		</Container>
	);
};

export default Header;
