/**
 * External dependencies
 */
import QRCode from 'qrcode.react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Panel, PanelBody, TextareaControl, CustomSelectControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { getButtonSizeBySlug } from '@media-manager/block-editor-complements';

/**
 * Internal dependencies
 */
import './editor.scss';

const defaultLevels = [
	{
		name: __( 'Level L', 'qr-block' ),
		slug: 'L',
		key: 'key-level-l',
	},
	{
		name: __( 'Level M', 'qr-block' ),
		slug: 'M',
		key: 'key-level-m',
	},
	{
		name: __( 'Level Q', 'qr-block' ),
		slug: 'Q',
		key: 'key-level-q',
	},
	{
		name: __( 'Level H', 'qr-block' ),
		slug: 'H',
		key: 'key-level-h',
	},
];

export default function QRBlockEdit( { attributes, setAttributes, backgroundColor, codeColor } ) {
	const { value, size, level } = attributes;

	function setLevel( { selectedItem } ) {
		if ( ! selectedItem?.slug ) {
			return;
		}
		setAttributes( { level: selectedItem.slug.toUpperCase() } );
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

						<CustomSelectControl
							label={ __( 'Level', 'qr-block' ) }
							options={ defaultLevels }
							onChange={ setLevel }
							value={ defaultLevels.find(
								( option ) => option.slug === level
							) }
						/>
					</PanelBody>
				</Panel>
			</InspectorControls>

			<figure { ...useBlockProps() }>
				<QRCode
					value={ value }
					size={ getButtonSizeBySlug( size ) * 128 - 64 }
					level={ level }
					fgColor={ backgroundColor?.color }
					bgColor={ codeColor.color }
				/>
			</figure>
		</Fragment>
	);
}
