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
import { useDispatch, useSelect } from '@wordpress/data';
import {
	Panel,
	PanelBody,
	SelectControl,
	ToolbarGroup,
	ToolbarButton,
	ExternalLink,
	ToolbarItem,
} from '@wordpress/components';
import { cog } from '@wordpress/icons';
import { Fragment, useEffect, useRef } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';
import { store as blocksStore } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import './editor.scss';
import uploadBlobToMediaLibrary from './lib/upload-image';
import { QRBlockSizeDropdown, SizeSelectorControl } from './components/sizes';
import { CodeContentControl, QRBlockContentDropdown, ToolbarGroupContent } from './components/set-content';
import { CreateAndUploadDropdown } from './components/create-and-upload';

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
	clientId,
	name: blockName,
} ) {
	const {
		value = __( 'Say Hello to the New Editor! https://wordpress.org/gutenberg/. AKA Gutenlove 💖', 'qr-block' ),
		size = 1,
		level = 'L',
		codeHEXColor = '#000000',
		bgHEXColor = '#ffffff',
	} = attributes;

	const match = useSelect(
		select => select( blocksStore ).getActiveBlockVariation( blockName, attributes ),
		[]
	);

	const variationsType = match?.attributes?.type;

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

	const codeRef = useRef();
	const { createErrorNotice, createInfoNotice } = useDispatch( noticesStore );

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
						<CodeContentControl
							value={ value }
							onSetContent={ ( value ) => setAttributes( { value } ) }
							variationsType={ variationsType }
						/>
					</PanelBody>

					<PanelBody>
						<SizeSelectorControl
							size={ size }
							onSize={ setSize }
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
				<ToolbarGroupContent
					value={ value }
					variationsType={ variationsType }
					onSetContent={ value => setAttributes( { value } ) }
				/>

				<ToolbarGroup>
					<ToolbarItem>
						{ ( toggleProps ) => (
							<QRBlockSizeDropdown
								toggleProps={ toggleProps }
								onSize={ setSize }
								size={ size }
							/>
						) }
					</ToolbarItem>

					<ToolbarButton
						onClick={ console.log }
						icon={ cog }
						label={ __( 'Error correction', 'qr-code' ) }
					/>

					<ToolbarItem>
						{ ( toggleProps ) => (
							<CreateAndUploadDropdown
								toggleProps={ toggleProps }
								qrSize={ size }
								value={ value }
								level={ level }
								fgColor={ codeHEXColor }
								bgColor={ bgHEXColor }
								onCreateAndUpload={ ( blob ) => {
									uploadBlobToMediaLibrary( blob, { caption: value, description: value }, function( err, image ) {
										if ( err ) {
											// removeAllNotices();
											createErrorNotice( err );
											return;
										}

										createInfoNotice(
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
					</ToolbarItem>
				</ToolbarGroup>
			</BlockControls>

			<figure { ...useBlockProps( { ref: codeRef } ) }>
				{ value && (
					<QRCode
						value={ value }
						size={ size }
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