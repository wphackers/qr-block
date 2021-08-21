/**
 * External dependencies
 */
import QRCode from 'qrcode.react';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	BlockControls,
} from '@wordpress/block-editor';
import { useDispatch } from '@wordpress/data';
import {
	Panel,
	PanelBody,
	TextareaControl,
	SelectControl,
	ToolbarGroup,
	ToolbarButton,
	Button,
	Popover,
	ExternalLink,
} from '@wordpress/components';
import { upload } from '@wordpress/icons';
import { Fragment, useEffect, useState, useRef } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import sizes from './sizes.json';
import ExportAndUploadPopover from './components/export-and-upload';
import './editor.scss';
import uploadBlobToMediaLibrary from './lib/upload-image';

const defaultLevels = [
	{
		label: __( 'Level L', 'qr-block' ),
		value: 'L',
	},
	{
		label: __( 'Level M', 'qr-block' ),
		value: 'M',
	},
	{
		label: __( 'Level Q', 'qr-block' ),
		value: 'Q',
	},
	{
		label: __( 'Level H', 'qr-block' ),
		value: 'H',
	},
];

function QRBlockEdit( {
	attributes,
	setAttributes,
	codeColor: codeColorProp,
	backgroundColor: backgroundColorProp,
} ) {
	const {
		value = __( 'Say Hello to the New Editor! https://wordpress.org/gutenberg/. AKA Gutenlove 💖', 'qr-block' ),
		size = 1,
		level = 'L',
		codeHEXColor = '#000000',
		bgHEXColor = '#ffffff',
	} = attributes;

	/*
	 * Watch code color property and pick up
	 * its color HEX shape value.
	 */
	useEffect( () => {
		if ( ! codeColorProp?.color ) {
			return;
		}

		setAttributes( { codeHEXColor: codeColorProp.color } );
	}, [ codeColorProp?.color ] );

	/*
	 * Watch background color property and pick up
	 * its color HEX shape value.
	 */
	useEffect( () => {
		if ( ! backgroundColorProp?.color ) {
			return;
		}
		setAttributes( { bgHEXColor: backgroundColorProp.color } );
	}, [ backgroundColorProp?.color ] );

	// Popover visibility state.
	const [ showCodePopover, setShowCodePopover ] = useState( false );
	const [ showUploadSizePopover, setShowUploadSizePopover ] = useState( false );

	const codeRef = useRef();

	const { createSuccessNotice, createErrorNotice, removeAllNotices } = useDispatch( noticesStore );
	

	/**
	 * Set Level block attribute.
	 *
	 * @param string QR code level value.
	 */
	function setLevel( value ) {
		setAttributes( { level: value } );
	}

	/**
	 * Set Size block attribute.
	 *
	 * @param string QR code Size value.
	 */
	function setSize( value ) {
		setAttributes( { size: Number( value ) } );
	}

	return (
		<Fragment>
			<InspectorControls>
				<Panel>
					<PanelBody title={ __( 'QR Data', 'qr-block' ) }>
						<TextareaControl
							label={ __( 'Text content', 'qr-data' ) }
							value={ value }
							onChange={ value => setAttributes( { value } ) }
							multiple={ true }
						/>

						<SelectControl
							label={ __( 'Size', 'qr-block' ) }
							options={ sizes }
							onChange={ setSize }
							value={ size }
						/>

						<SelectControl
							label={ __( 'Correction level', 'qr-block' ) }
							options={ defaultLevels }
							onChange={ setLevel }
							value={ level }
							help={
								<>
									{ __( 'Read more about the ', 'qr-block' ) }
									<ExternalLink href="https://en.wikipedia.org/wiki/QR_code#Error_correction">
										{ __( 'Error correction Level', 'qr-block' ) }
									</ExternalLink>
									{ __( '⇔ you are in love with Math ∀', 'qr-block' ) }
								</>
							}
						/>
					</PanelBody>
				</Panel>
			</InspectorControls>

			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton onClick={ () => setShowCodePopover( state => ! state ) }>
						{ __( 'Code', 'qr-block' ) }
					</ToolbarButton>

					<ToolbarButton
						onClick={ () => setShowUploadSizePopover( state => ! state ) }
						icon={ upload }
						label={ __( 'Upload to Media Library' ) }
					/>
				</ToolbarGroup>

				{ showCodePopover && (
					<Popover
						className="wp-block-wphackers-qr-block__popover"
						position="bottom left"
						focusOnMount={ true }
						onClose={ () => setShowCodePopover( false ) }
					>
						<TextareaControl
							value={ value }
							onChange={ value => setAttributes( { value } ) }
							multiple={ true }
						/>

						<div className="wp-block-wphackers-qr-block__actions">
							<SelectControl
								options={ sizes }
								onChange={ setSize }
								value={ size }
							/>
							
							<SelectControl
								options={ defaultLevels }
								onChange={ setLevel }
								value={ level }
								isSmall
							/>
						</div>

						<div className="wp-block-wphackers-qr-block__actions">
							<Button
								isSecondary
								isSmall
								onClick={ () => setShowCodePopover( false ) }
							>
								{ __( 'Close', 'qr-block' ) }
							</Button>
						</div>
					</Popover>
				) }

				{ showUploadSizePopover && (
					<ExportAndUploadPopover
						qrSize={ size }
						value={ value }
						level={ level }
						fgColor={ codeHEXColor }
						bgColor={ bgHEXColor }
						onClose={ () => setShowUploadSizePopover( false ) }
						onExportAndUpload={ ( blob ) => {
							setShowUploadSizePopover( false );
							uploadBlobToMediaLibrary( blob, { caption: value, description: value }, function( err, image ) {
								if ( err ) {
									removeAllNotices();
									createErrorNotice( message );
									return;
								}

								createSuccessNotice(
									sprintf(
										/* translators: %s: Publish state and date of the post. */
										__( 'Image {%s} created and uploaded to the library', 'qr-block' ),
										image.id,
									),
									{
										id: `uploaded-image-${ image.id }`,
										type: 'snackbar',
									}
								);
							} );
						} }
					/>
				) }
			</BlockControls>

			<figure { ...useBlockProps( { ref: codeRef } ) }>
				{ value && (
					<QRCode
						value={ value }
						size={ size * 100 }
						level={ level }
						fgColor={ codeHEXColor }
						bgColor={ bgHEXColor }
						renderAs="canvas"
					/>
				) }
			</figure>
		</Fragment>
	);
}

export default QRBlockEdit;