/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import '@media-manager/block-editor-complements';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import { QRIcon }  from './icons';
import './style.scss';

registerBlockType( 'create-block/qr-block', {
	edit: Edit,
	save,
	icon: QRIcon,
} );
