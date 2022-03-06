/**
 * External dependencies
 */
import { registerPlugin } from '@wordpress/plugins';
import { PluginPostPublishPanel } from '@wordpress/edit-post';
import { useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { QRIcon } from '../../components/icons';
import QRPost from '../../components/qr-post';
import { qrDefaultLevels } from '../../utils/qr-levels';
import './editor.scss';

function PluginPostPublishPanelQRPost() {
	const qrCodeRef = useRef();
	const [ level, setLevel ] = useState( qrDefaultLevels[ 0 ].value );

	return (
		<PluginPostPublishPanel
			name="post-publish-post-qr-code"
			title={ __( 'QR Code', 'qr-block' ) }
			className="post-publish-post-qr-code"
			icon={ <QRIcon /> }
		>
			<div className="post-publish-post-qr-code__container" ref={ qrCodeRef }>
				<QRPost level={ level } />
			</div>

		</PluginPostPublishPanel>
	);
}

registerPlugin( 'post-publish-panel-qr-post', {
	render: PluginPostPublishPanelQRPost,
} );
