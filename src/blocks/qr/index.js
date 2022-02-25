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
import { QRIcon }  from '../../components/icons';
import fromQRToImageBlock from './extend';
import './style.scss';

registerBlockType( 'wphackers/qr', {
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
					type: variationsType,
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
							type: variationsType,
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

	variations: [
		{
			name: 'qr-post',
			title: __( 'QR Post', 'qr-block' ),
			description: __( 'Share your post with a QR Code.', 'qr-block' ),
			attributes: {
				type: 'qr-post',
				value: 'QR Post',
			},
			keywords: [ 'post' ],
			isActive: ( blockAttributes, variationAttributes ) => {
				return blockAttributes.type === variationAttributes.type;
			}
		},
		{
			name: 'wifinetwork',
			title: __( 'Wi-Fi Network Connection', 'qr-block' ),
			description: __( 'Connect to a Wi-Fi Network via a QR Code.', 'qr-block' ),
			attributes: {
				type: 'wifinetwork',
				value: 'WIFI:S:MySSID;T:WPA;P:MyPassword;H:true;',
			},
			keywords: [ 'wifi', 'share' ],
			isActive: ( blockAttributes, variationAttributes ) => {
				return blockAttributes.type === variationAttributes.type;
			}
		},
	],
} );

function addMediaManagerSizeSupport( settings, name ) {
	if ( name !== 'core/image') {
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
