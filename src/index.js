/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import '@media-manager/block-editor-complements';
import { createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import { QRIcon }  from './icons';
import './style.scss';
import fromQRToImageBlock from './extend';

registerBlockType( 'wphackers/qr-block', {
	apiVersion: 2,
	title: __( 'QR Block', 'qr-block' ),
	category: 'widgets',
	edit: Edit,
	save,
	icon: QRIcon,
	transforms: {
		to: [
			{
				type: 'block',
				blocks: [ 'core/image' ],
				transform: ( {
					value = __( 'Say Hello to the New Editor! https://wordpress.org/gutenberg/. AKA Gutenlove 💖', 'qr-block' ),
					size = 200,
					level = 'L',
					codeHEXColor = '#000000',
					bgHEXColor = '#ffffff',
					align,
				} ) => {
					// Parse the QR block attributes and store them in the image block caption.
					return createBlock( 'core/image', {
						caption: JSON.stringify( {
							value,
							size,
							level,
							fgColor: codeHEXColor,
							bgColor: bgHEXColor,
						} ),
						align,
					} );
				},
			},
		]
	},
} );

function addMediaManagerSizeSupport( settings ) {
	if ( ! settings?.name || settings.name !== 'core/image') {
		return settings;
	}

	return {
		...settings,
		edit: fromQRToImageBlock( settings.edit ),
	};
}

addFilter(
	'blocks.registerBlockType',
	'qr-block/register-media-player-buttons-blocks',
	addMediaManagerSizeSupport,
);
