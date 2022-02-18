/**
 * External dependencies
 */
import QRCode from 'qrcode.react';
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { store as editorStore } from '@wordpress/editor';
import { useRef } from '@wordpress/element';
import { Button, PanelRow } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { QRIcon } from '../icons';
import './editor.scss';

const pluginNameSpace = 'plugin-document-setting-qr-code-panel';
const pluginName = 'post-qr-code';

// Post QR Code
const PluginDocumentSettingQRCode = () => {
	const qrCodeRef = useRef();

	const { link } = useSelect(
		select => select( editorStore ).getCurrentPost(),
		[]
	);

	function handleDownloadCode( ev ) {
		ev.preventDefault();

		if ( ! qrCodeRef?.current ) {
			return;
		}

		const canvasElement = qrCodeRef.current.querySelector( 'canvas' );
		if ( ! canvasElement ) {
			return;
		}

		// Convert to bitmap, and download.
		canvasElement.toBlob( ( imageBlob ) => {			
			const imageURL = URL.createObjectURL( imageBlob );
			const tempLink = document.createElement('a');
			tempLink.href = imageURL;
			tempLink.setAttribute( 'download', 'filename.png' );
			tempLink.click();
		} );
	}

	const qrContent = sprintf(
		/* translators: %s: Post permalink */
		__( 'Vist %s', 'qr-block' ), link
	);

	return (
		<PluginDocumentSettingPanel
			name={ pluginName }
			title={ <><QRIcon /> { __( 'QR Code', 'qr-block' ) }</> }
			className="post-qr-code"
		>
			<div className="post-qr-code__container" ref={ qrCodeRef }>
				<QRCode
					value={ qrContent }
					size={ 200 }
					level="L"
					renderAs="canvas"
				/>
			</div>

			<PanelRow>
				<Button variant="secondary" isSmall onClick={ handleDownloadCode }>
					{ __( 'Download', 'qr-block' ) }
				</Button>
			</PanelRow>
		</PluginDocumentSettingPanel>
	);
};
 
registerPlugin( pluginNameSpace, {
	render: PluginDocumentSettingQRCode,
	icon: null,
} );
