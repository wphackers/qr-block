/**
 * External dependencies
 */
import QRCode from 'qrcode.react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Panel, PanelBody, TextareaControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { getButtonSizeBySlug } from '@media-manager/block-editor-complements';

/**
 * Internal dependencies
 */
import './editor.scss';

export default function QRBlockEdit( { attributes, setAttributes, backgroundColor, codeColor } ) {
	const { value, size } = attributes;

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
					</PanelBody>
				</Panel>
			</InspectorControls>

			<figure { ...useBlockProps() }>
				<QRCode
					value={ value }
					size={ getButtonSizeBySlug( size ) * 128 - 64 }
					fgColor={ backgroundColor?.color }
					bgColor={ codeColor.color }
				/>
			</figure>
		</Fragment>
	);
}
