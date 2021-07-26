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
	Toolbar,
	Button,
	Popover,
} from '@wordpress/components';
import { Fragment, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { sizes } from '../block.json';
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
		value,
		size,
		level,
		codeHEXColor,
		bgHEXColor,
	} = attributes;

	useEffect( () => {
		setAttributes( { codeHEXColor: codeColorProp.color } );
	}, [ codeColorProp.color ] );

	useEffect( () => {
		setAttributes( { bgHEXColor: backgroundColorProp.color } );
	}, [ backgroundColorProp.color ] );

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
				<Toolbar>
					<Button onClick={ () => setShowPopover( state => ! state ) }>
						{ __( 'Set Value', 'qr-block' ) }
					</Button>
					{ showPopover && (
						<Popover
							className="wp-block-create-block-qr-block__popover"
							position="bottom left"
							focusOnMount={ true }
							onClose={ () => setShowPopover( false ) }
						>
							<TextareaControl
								value={ value }
								onChange={ value => setAttributes( { value } ) }
								multiple={ true }
							/>

							<Button
								isSecondary
								isSmall
								isLink
								onClick={ () => setShowPopover( false ) }
							>
								{ __( 'Close', 'qr-block' ) }
							</Button>
						</Popover>
					) }
				</Toolbar>
			</BlockControls>

			<figure { ...useBlockProps() }>
				<QRCode
					value={ value }
					size={ size * 100 }
					level={ level }
					fgColor={ codeHEXColor }
					bgColor={ bgHEXColor }
				/>
			</figure>
		</Fragment>
	);
}
