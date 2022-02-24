/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { QRIcon } from '../../components/icons';
 
// Register the block
registerBlockType( 'wphackers/qr-post', {
	icon: QRIcon,
	edit: function () {
		return <p> Hello QR world (from the editor)</p>;
	},
	save: function () {
		return <p> Hola QR mundo (from the frontend) </p>;
	},
} );
