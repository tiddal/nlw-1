import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import { Container } from './styles';

interface Props {
	onFileUpload: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUpload }) => {
	const [selectedFileUrl, setSelectedFileUrl] = useState('');

	const onDrop = useCallback(
		(acceptedFiles) => {
			const file = acceptedFiles[0];
			setSelectedFileUrl(URL.createObjectURL(file));
			onFileUpload(file);
		},
		[onFileUpload]
	);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: 'image/*',
	});
	return (
		<Container {...getRootProps()}>
			<input {...getInputProps()} accept="image/*" />
			{selectedFileUrl ? (
				<img src={selectedFileUrl} alt="Preview" />
			) : (
				<p>
					<FiUpload />
					Imagem do estabelecimento
				</p>
			)}
		</Container>
	);
};

export default Dropzone;
