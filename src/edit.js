/**
 * External dependencies
 */
import QRCode from 'qrcode.react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps, BlockControls } from '@wordpress/block-editor';
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
import { Fragment, useEffect, useState } from '@wordpress/element';

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

export default function QRBlockEdit( {
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

	useEffect( () => {
		if ( ! codeColorProp?.color ) {
			return;
		}

		setAttributes( { codeHEXColor: codeColorProp.color } );
	}, [ codeColorProp?.color ] );

	useEffect( () => {
		if ( ! backgroundColorProp?.color ) {
			return;
		}
		setAttributes( { bgHEXColor: backgroundColorProp.color } );
	}, [ backgroundColorProp?.color ] );

	const [ showPopover, setShowPopover ] = useState( false );

	function setLevel( value ) {
		setAttributes( { level: value } );
	}

	function setSize( value ) {
		setAttributes( { size: Number( value ) } );
	}

	return (
		<Fragment>
			<InspectorControls>
				<Panel>
					<PanelBody title={ __( 'QR Data', 'qr-block' ) }>
						<TextareaControl
							label={ __( 'Value', 'qr-data' ) }
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
							className="wp-block-fancy-blocks-qr-block__popover"
							position="bottom left"
							focusOnMount={ true }
							onClose={ () => setShowPopover( false ) }
						>
							<TextareaControl
								value={ value }
								onChange={ value => setAttributes( { value } ) }
								multiple={ true }
							/>

							<div className="wp-block-fancy-blocks-qr-block__actions">
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
				</ToolbarGroup>
			</BlockControls>

			<figure { ...useBlockProps() }>
				{ value && (
					<QRCode
						value={ value }
						size={ size * 100 }
						level={ level }
						fgColor={ codeHEXColor }
						bgColor={ bgHEXColor }
						renderAs="svg"
					/>
				) }
			</figure>
		</Fragment>
	);
}
