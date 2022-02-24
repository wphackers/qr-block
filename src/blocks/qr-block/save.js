
/**
 * External dependencies
 */
import QRCode from 'qrcode.react';
 
 /**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const {
		value,
		size,
		level,
		codeHEXColor,
		bgHEXColor,
	} = attributes;

	return (
		<figure { ...useBlockProps.save() }>
			<QRCode
				value={ value }
				size={ size }
				level={ level }
				fgColor={ codeHEXColor }
				bgColor={ bgHEXColor }
				renderAs="svg"
			/>
		</figure>
	);
}
