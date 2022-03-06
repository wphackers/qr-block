/**
 * External dependencies
 */
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { store as editorStore } from '@wordpress/editor';
import { useRef, useState } from '@wordpress/element';
import {
	Button,
	PanelRow,
	ExternalLink,
	__experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { qrDefaultLevels } from '../../utils/qr-levels';
import { QRIcon } from '../../components/icons';
import QRPost from '../../components/qr-post';
import './editor.scss';

const pluginNameSpace = 'plugin-document-setting-qr-code-panel';
const pluginName = 'post-qr-code';

// Post QR Code
const PluginDocumentSettingQRCode = () => {
	const qrCodeRef = useRef();

	const slug = useSelect(
		select => select( editorStore ).getEditedPostSlug(),
		[]
	);

	const [ level, setLevel ] = useState( qrDefaultLevels[ 0 ].value );

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

	function PluginWrapper( { children } ) {
		return (
			<PluginDocumentSettingPanel
				name={ pluginName }
				title={ <><QRIcon /> { __( 'QR Code', 'qr-block' ) }</> }
				className="post-qr-code"
			>
				{ children }
			</PluginDocumentSettingPanel>
		);
	}

	function QRPostLevelPanelRow( { onLevelChange } ) {
		return (
			<PanelRow>
				<ToggleGroupControl
					value={ level }
					isBlock
					onChange={ onLevelChange }
					help={
						<>
							{ __( 'Read more about the ', 'qr-block' ) }
							<ExternalLink href="https://en.wikipedia.org/wiki/QR_code#Error_correction">
								{ __( 'Error correction Level', 'qr-block' ) }
							</ExternalLink>
							{ __( '⇔ you are in love with Math ∀', 'qr-block' ) }
						</>
					}
				>
					{ qrDefaultLevels.map( ( { value } ) => (
						<ToggleGroupControlOption
							key={ value }
							label={ value }
							value={ value }
						/>
					) ) }
				</ToggleGroupControl>
			</PanelRow>
		);
	}

	function QRPostImageActionsPanelRow( { children } ) {
		return (
			<PanelRow>
				<Button isTertiary isSmall onClick={ () => handleDownloadCode( false ) }>
					{ __( 'View', 'qr-block' ) }
				</Button>

				<Button isSecondary isSmall onClick={ handleDownloadCode }>
					{ __( 'Download', 'qr-block' ) }
				</Button>
			</PanelRow>
		);
	}

	return (
		<PluginWrapper>
			<div className="post-qr-code__container" ref={ qrCodeRef }>
				<QRPost level={ level } />
			</div>

			<QRPostLevelPanelRow onLevelChange={ setLevel } />

			<QRPostImageActionsPanelRow />
		</PluginWrapper>
	);
};
 
registerPlugin( pluginNameSpace, {
	render: PluginDocumentSettingQRCode,
	icon: null,
} );
