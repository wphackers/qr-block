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
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	Panel,
	PanelBody,
	TextareaControl,
	SelectControl,
	ToolbarGroup,
	ToolbarButton,
	Button,
	Popover,
} from '@wordpress/components';
import { upload } from '@wordpress/icons';
import { Fragment, useEffect, useState, useRef } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import sizes from './sizes.json';
import './editor.scss';

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
	const [ showPopover, setShowPopover ] = useState( false );

	const codeRef = useRef();

	const mediaUpload = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		return getSettings().mediaUpload;
	}, [] );

	const { createSuccessNotice, createErrorNotice, removeAllNotices } = useDispatch( noticesStore );

	function uploadToMediaLibrary() {
		if ( ! codeRef?.current ) {
			return;
		}

		const canvasElement = codeRef.current.querySelector( 'canvas' );
		if ( ! canvasElement ) {
			return;
		}

		canvasElement.toBlob( ( imageBlob ) => {
			const reader = new window.FileReader();
			reader.readAsDataURL( imageBlob );
			reader.onloadend = () => {
				mediaUpload( {
					additionalData: {
						title: __( 'Image generated from a QR block', 'qr-block' ),
						caption: value,
						description: value,
					},
					allowedTypes: [ 'image' ],
					filesList: [ imageBlob ],
					onFileChange: ( images ) => {
						if ( ! images?.length ) {
							return;
						}

						const image = images[ 0 ];
						if ( ! image?.id ) {
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
					},
					onError: ( message ) => {
						removeAllNotices();
						createErrorNotice( message );
					},
				} );
			};
		} );
	}

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
							label={ __( 'Level', 'qr-block' ) }
							options={ defaultLevels }
							onChange={ setLevel }
							value={ level }
						/>
					</PanelBody>
				</Panel>
			</InspectorControls>

			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton onClick={ () => setShowPopover( state => ! state ) }>
						{ __( 'Set QR content', 'qr-block' ) }
					</ToolbarButton>
					{ showPopover && (
						<Popover
							className="wp-block-wphackers-qr-block__popover"
							position="bottom left"
							focusOnMount={ true }
							onClose={ () => setShowPopover( false ) }
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

								<Button
									isSecondary
									isSmall
									isLink
									onClick={ () => setShowPopover( false ) }
								>
									{ __( 'Close', 'qr-block' ) }
								</Button>
							</div>
						</Popover>
					) }

					<ToolbarButton
						onClick={ uploadToMediaLibrary }
						icon={ upload }
						label={ __( 'Upload to Media Library' ) }
					/>
				</ToolbarGroup>
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