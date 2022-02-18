/**
 * External dependencies
 */
import QRCode from 'qrcode.react';
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { store as editorStore } from '@wordpress/editor';
import { useRef, useState } from '@wordpress/element';
import {
	Button,
	PanelRow,
	__experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { QRIcon } from '../icons';
import './editor.scss';
import { defaultLevels } from '../edit';

const pluginNameSpace = 'plugin-document-setting-qr-code-panel';
const pluginName = 'post-qr-code';

// Post QR Code
const PluginDocumentSettingQRCode = () => {
	const qrCodeRef = useRef();

	const { post: { link }, slug } = useSelect(
		select => ( {
			post: select( editorStore ).getCurrentPost(),
			slug: select( 'core/editor' ).getEditedPostSlug(),
		} ),
		[]
	);

	const [ level, setLevel ] = useState( defaultLevels[ 0 ].value );

	function handleDownloadCode( download = true ) {
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
			const tempLink = document.createElement( 'a' );
			tempLink.href = imageURL;
			tempLink.setAttribute( download ? 'download' : 'target', `qr-post-${ slug }.png` );
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
					level={ level }
					renderAs="canvas"
				/>
			</div>

			<PanelRow>
				<ToggleGroupControl
					label={ __( 'QR Code level', 'qr-block' ) }
					value={ level }
					isAdaptiveWidth={ true }
					isBlock
					onChange={ setLevel }
				>
					{ defaultLevels.map( ( { value } ) => (
						<ToggleGroupControlOption
							key={ value }
							label={ value }
							value={ value }
						/>
					) ) }
				</ToggleGroupControl>
			</PanelRow>

			<PanelRow>
				<Button isTertiary isSmall onClick={ () => handleDownloadCode( false ) }>
					{ __( 'View', 'qr-block' ) }
				</Button>

				<Button isSecondary isSmall onClick={ handleDownloadCode }>
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
