/**
 * External dependencies
 */
import QRCode from 'qrcode.react';
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { store as editorStore } from '@wordpress/editor';


/**
 * Internal dependencies
 */
import { QRIcon } from '../icons';
import './editor.scss';

// Post QR Code
const PluginDocumentSettingQRCode = () => {
	const { link } = useSelect(
		select => select( editorStore ).getCurrentPost(),
		[]
	);

	const qrContent = sprintf(
		/* translators: %s: Post permalink */
		__( 'Vist %s', 'qr-block' ), link
	);

	return (
		<PluginDocumentSettingPanel
			name="post-qr-code"
			title={ <><QRIcon /> { __( 'QR Code', 'qr-block' ) }</> }
			className="post-qr-code"
		>
			<div className='post-qr-code__container'>
				<QRCode
					value={ qrContent }
					size={ 200 }
					level="L"
					renderAs="canvas"
				/>
			</div>
		</PluginDocumentSettingPanel>
	);
};
 
registerPlugin( 'plugin-document-setting-qr-code-panel', {
    render: PluginDocumentSettingQRCode,
    icon: null,
} );
