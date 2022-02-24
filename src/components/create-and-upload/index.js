/**
 * External dependencies
 */
import QRCode from 'qrcode.react'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	TextControl,
	MenuGroup,
	Notice,
	DropdownMenu,
} from '@wordpress/components';
import {
	useState,
	useEffect,
	useRef,
	Fragment,
	createInterpolateElement,
} from '@wordpress/element';
import convertFormatBytes from '../../lib/bites-unit-converter';

/**
 * Internal dependencies
 */
import { UploadToMediaLibraryIcon } from '../icons';

export function CreateAndUploadDropdown( {
	toggleProps,
	qrSize,
	onCreateAndUpload,
	...qrProps
} ) {
	const [ size, setSize ] = useState( qrSize );
	const qrCodeSize = ( Number ( size ) / 2 ) | 0;
	const [ exportSize, setExportSize ] = useState();

	const isInvalidSize = ! size || size < 2;

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
				return setExportSize( null );
			}

			setExportSize( convertFormatBytes( imageBlob.size ) );
		} );

	}, [ qrCodeRef, qrCodeSize, setExportSize ] );

	useEffect( () => {
		setSize( qrSize );
	}, [ qrSize ] );

	return (
		<Fragment>
			<div className="wp-block-wphackers-qr-block__preview" ref={ qrCodeRef }>
				<QRCode
					style={ { display: 'none' } }
					{ ...qrProps }
					size={ qrCodeSize }
					renderAs="canvas"
				/>
			</div>
			<DropdownMenu
				icon={ UploadToMediaLibraryIcon }
				popoverProps={ {
					position: 'bottom right',
					isAlternate: true,
				} }
				toggleProps={ toggleProps }
				className="qr-block__upload-to-media-library"
				label={ __( 'Upload to Media Library', 'wporg-qr-block' ) }
			>
				{ ( { onClose } ) => (
					<MenuGroup className="wp-block-wphackers-qr-block__toolbar-menu-group">
						<TextControl
							type="number"
							className="wp-block-wphackers-qr-block-image-size-control"
							label={ __( 'Size' ) }
							value={ size }
							min={ 1 }
							onChange={ setSize }
							help={ __( 'Width and Height of te image before to create and upload it to the gallery.', 'qr-block' ) }
						/>
						{ ( ! isInvalidSize && exportSize ) && (
							<Fragment>
								<p>
									{ createInterpolateElement(
										sprintf(
											/* translators: 1: Image size, e.g. 200 */
											'Image size: <strong>%1$spx</strong> x <strong>%1$spx</strong>.',
											size
										),
										{
											strong: (
												<strong />
											),
										}
									) }
									<br />
									{ createInterpolateElement(
										sprintf(
											/* translators: Image weigth, e.g. 3Kb. */
											'Image Weigth: <strong>%s</strong>.',
											exportSize
										),
										{
											strong: (
												<strong />
											),
										}	
									) }
								</p>
							</Fragment>
						) }

						{ ! exportSize && (
							<Notice
								spokenMessage={ null }
								status="warning"
								isDismissible={ false }
							>
								{ __( 'Wrong image size.', 'qr-block' ) }
							</Notice>
						) }

						<div className="wp-block-wphackers-qr-block__actions">
							<Button
								isPrimary
								isSmall
								disabled={ isInvalidSize }
								onClick={ () => {
									const el = getCanvasElement();
									el.toBlob( onCreateAndUpload );
									onClose();
								} }
							>
								{ __( 'Create & Upload', 'qr-block' ) }
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
				) }
			</DropdownMenu>
		</Fragment>
	);
}
