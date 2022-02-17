/**
 * External dependencies
 */
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { QRIcon } from '../icons';
import './editor.scss';

// Post QR Code
const PluginDocumentSettingQRCode = () => (
    <PluginDocumentSettingPanel
        name="post-qr-code"
        title={ <><QRIcon /> { __( 'QR Code', 'qr-block' ) }</> }
        className="post-qr-code"
    >
        Custom Panel Contents
    </PluginDocumentSettingPanel>
);
 
registerPlugin( 'plugin-document-setting-qr-code-panel', {
    render: PluginDocumentSettingQRCode,
    icon: null,
} );
