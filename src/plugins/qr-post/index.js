/**
 * External dependencies
 */
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import { useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { qrDefaultLevels } from '../../utils/qr-levels';
import { QRIcon } from '../../components/icons';
import QRPost from '../../components/qr-post';
import QRCodeLevelPanelRow from '../../components/qr-code-level-panel-row';
import QRCodeImageActionsPanelRow from '../../components/qr-code-image-actions-panel-row';
import './editor.scss';

// Post QR Code
const PluginDocumentSettingQRCode = () => {
	const qrCodeRef = useRef();
	const [ level, setLevel ] = useState( qrDefaultLevels[ 0 ].value );

	return (
		<PluginDocumentSettingPanel
			name='post-qr-code'
			title={ <><QRIcon /> { __( 'QR Code', 'qr-block' ) }</> }
			className="post-qr-code"
		>
			<div className="post-qr-code__container" ref={ qrCodeRef }>
				<QRPost level={ level } />
			</div>

			<QRCodeLevelPanelRow value={ level } onChange={ setLevel } />

			<QRCodeImageActionsPanelRow qrCodeRef={ qrCodeRef } />
		</PluginDocumentSettingPanel>
	);
};
 
registerPlugin( 'plugin-document-setting-qr-code-panel', {
	render: PluginDocumentSettingQRCode,
	icon: null,
} );
