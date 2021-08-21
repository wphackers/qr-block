/**
 * External dependencies
 */
import QRCode from 'qrcode.react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	Popover,
	TextControl,
	MenuGroup,
} from '@wordpress/components';
import { useState, useEffect, useRef } from '@wordpress/element';

export default function ExportAndUploadPopover( {
	onClose,
	qrSize,
	onExportAndUpload,
	...qrProps
} ) {
	const [ size, setSize ] = useState( qrSize * 100 );
	const [ exportSize, setExportSize ] = useState();
	const isInvalidSize = ! size || size < 1;
	const qrCodeSize = ( Number ( size ) / 2 ) | 0;

	const qrCodeRef = useRef();

	function getCanvasElement() {
		if ( ! qrCodeRef.current ) {
			return;
		}

		return qrCodeRef.current.querySelector( 'canvas' );
	}

	useEffect( () => {
		const canvasElement = getCanvasElement();
		if ( ! canvasElement ) {
			return;
		}

		canvasElement.toBlob( ( imageBlob ) => {
			if ( ! imageBlob ) {
				return;
			}

			setExportSize( imageBlob.size );
		} );

	}, [ qrCodeSize, setExportSize ] );

	return (
		<Popover
			className="wp-block-wphackers-qr-block__popover"
			position="bottom"
			focusOnMount={ true }
			onClose={ onClose }
		>
			<MenuGroup label={ __( 'Upload to Media Library', 'qr-block' ) }>
				<TextControl
					type="number"
					className="wp-block-wphackers-qr-block-image-size-control"
					label={ __( 'Size' ) }
					value={ size }
					min={ 1 }
					onChange={ setSize }
					help={ __( 'Set the image size (width and height) before to generate and upload the image to the gallery.', 'qr-block' ) }
				/>

				{ ! isInvalidSize && (
					<p>
						{
							/* translators: 1: Image size, e.g. 200. 2: Image weigth, e.g. 3Kb. */
							sprintf( 'Image: %1$spx x %1$spx. Weigth: %2$sb.', size, exportSize )
						}
					</p>
				 ) }

				<div className="wp-block-wphackers-qr-block__actions" ref={ qrCodeRef }>
					<QRCode
						{ ...qrProps }
						style={ { display: 'none' } }
						size={ qrCodeSize }
						renderAs="canvas"
					/>
					<Button
						isPrimary
						isSmall
						disabled={ isInvalidSize }
						onClick={ () => {
							const el = getCanvasElement();
							el.toBlob( onExportAndUpload );
						} }
					>
						{ __( 'Export & Upload', 'qr-block' ) }
					</Button>

					<Button
						isSecondary
						isSmall
						onClick={ onClose }
					>
						{ __( 'Cancel', 'qr-block' ) }
					</Button>
				</div>
			</MenuGroup>
		</Popover>
	);
}
