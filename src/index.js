/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import '@media-manager/block-editor-complements';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import { QRIcon }  from './icons';
import './style.scss';

registerBlockType( 'fancy-blocks/qr-block', {
	apiVersion: 2,
	title: __( 'QR Block', 'qr-block' ),
	category: 'widgets',
	edit: Edit,
	save,
	icon: QRIcon,
} );
