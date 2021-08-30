/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { Fragment } from '@wordpress/element';
import {
	DropdownMenu,
	MenuGroup,
	MenuItem,
	Button,
	TextareaControl,
	TextControl,
	ExternalLink,
	ToolbarGroup,
	ToolbarItem,
	PanelBody,
	SelectControl,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { QRCodeContentIcon, WiFiEncryptionIcon, WiFiVisibilityIcon } from '../../icons';

const WIFI_ENCRYPTION_TYPES = [
	{
		slug: 'wpa',
		value: 'WPA',
		label: __( 'WPA', 'qr-block' ),
	},
	{
		slug: 'wep',
		value: 'WEP',
		label: __( 'WEP', 'qr-block' ),
	},
	{
		slug: 'blank',
		value: 'blank',
		label: __( 'Unencrypted', 'qr-block' ),
	},
];

const WIFI_VISIVILITY_TYPES = [
	{
		value: 'true',
		label: __( 'Visible', 'qr-block' ),
	},
	{
		value: 'false',
		label: __( 'Not visible', 'qr-block' ),
	},
	{
		value: 'blank',
		label: __( 'Undefined', 'qr-block' ),
	},
];

// https://en.wikipedia.org/wiki/QR_code#Joining_a_Wi%E2%80%91Fi_network
export function parseWiFiNetworkData( value ) {
	const data = value.match( /^WIFI:S:(.*);P:(.*);T:(WEP|WPA|blank);H:(true|false|blank)/ );
	return {
		ssid: data?.[ 1 ] ?? '',
		password: data?.[ 2 ] ?? '',
		type: data?.[ 3 ] ?? 'WPA',
		hidden: data?.[ 4 ] ?? 'false',
	};
}

function stringifyWiFiNetworkData( data, set ) {
	const { ssid, password, type, hidden } = { ...data, ...set };
	return `WIFI:S:${ ssid };P:${ password };T:${ type };H:${ hidden };`;
}

export function CodeContentControl( {
	value,
	onSetContent,
	variationsType,
} ) {
	const wifiNetworkData = parseWiFiNetworkData( value );
	
	if ( variationsType === 'wifinetwork' ) {
		return (
			<Fragment>
				<TextControl
					label={ __( 'SSID - Service Set Identifier', 'qr-block' ) }
					value={ wifiNetworkData.ssid }
					onChange={ ( ssid ) => onSetContent( stringifyWiFiNetworkData( wifiNetworkData, { ssid } ) ) }
					placeholder={ __( 'Service Set Identifier', 'qr-block' ) }
					help={
						<Fragment>
							{ __( 'In other words, the name of the Wi-Fi network. ', 'qr-block' ) }
							<ExternalLink href="https://en.wikipedia.org/wiki/Service_set_(802.11_network)#:~:text=The%20service%20set%20identifier%20(SSID,as%20a%20wireless%20network%20name.">
								{ __( 'More Info', 'qr-block' ) }
							</ExternalLink>
						</Fragment>
					}
				/>

				<TextControl
					label={ __( 'Password', 'qr-block' ) }
					value={ wifiNetworkData.password }
					onChange={ ( password ) => onSetContent( stringifyWiFiNetworkData( wifiNetworkData, { password } ) ) }
					placeholder={ __( 'password', 'qr-block' ) }
				/>
			</Fragment>
		);
	}
		
	return (
		<TextareaControl
			label={ __( 'Code content', 'qr-data' ) }
			multiple={ true }
			value={ value }
			onChange={ onSetContent }
		/>
	);
}

function QRDropdownMenu( { toggleProps, children, icon, label } ) {
	return (
		<DropdownMenu
			icon={ icon }
			popoverProps={ {
				position: 'bottom right',
				isAlternate: true,
			} }
			label={ label }
			toggleProps={ toggleProps }
			className="qr-block__content"
		>
			{ children }
		</DropdownMenu>
	);
}

export function QRBlockContentDropdown( {
	value,
	onSetContent,
	variationsType,
	...other
} ) {
	return (
		<QRDropdownMenu { ...other }>
			{ ( { onClose } ) => (
				<MenuGroup className="wp-block-wphackers-qr-block__toolbar-menu-group">
					<CodeContentControl
						value={ value }
						onSetContent={ onSetContent }
						variationsType={ variationsType }
					/>

					<div className="wp-block-wphackers-qr-block__actions">
						<Button
							isSecondary
							isSmall
							onClick={ onClose }
						>
							{ __( 'Close', 'qr-block' ) }
						</Button>
					</div>
				</MenuGroup>
			) }
		</QRDropdownMenu>
	);
}

function QRBlockWiFiEncryptControl( {
	onClose = () => {},
	onSetContent,
	data,
	className,
} ) {
	return (
		<MenuGroup
			className={ className }
			label={ __( 'Encryption', 'qr-block' ) }
		>
			{ WIFI_ENCRYPTION_TYPES.map( ( { slug, label, value } ) => (
				<MenuItem
					key={ `type-${ slug }` }
					onClick={ () => {
						onSetContent( stringifyWiFiNetworkData( data, { type: value } ) );
						onClose();
					} }
					role="menuitemradio"
					isSelected={ value === data.type }
				>
					{ label }
				</MenuItem>
			) ) }
		</MenuGroup>
	);
}

export function QRBlockWiFiEncryptDropdown( {
	value,
	onSetContent,
	...other
} ) {
	return (
		<QRDropdownMenu { ...other } icon={ WiFiEncryptionIcon }>
			{ ( { onClose } ) => (
				<QRBlockWiFiEncryptControl
					className="wp-block-wphackers-qr-block__toolbar-encrypt"
					onClose={ onClose }
					onSetContent={ onSetContent }
					data={ parseWiFiNetworkData( value ) }
				/>
			) }
		</QRDropdownMenu>
	);
}

function QRBlockWiFiVisibilityControl( {
	onClose = () => {},
	onSetContent,
	data,
	className,
} ) {
	return (
		<MenuGroup
			className={ className }
			label={ __( 'Visibility', 'qr-block' ) }
		>
			{ WIFI_VISIVILITY_TYPES.map( ( { value, label }, i ) => (
				<MenuItem
					key={ `type-${ i }` }
					onClick={ () => {
						onSetContent( stringifyWiFiNetworkData( data, { hidden: value } ) );
						onClose();
					} }
					role="menuitemradio"
					isSelected={ value === data.hidden }
				>
					{ label }
				</MenuItem>
			) ) }
		</MenuGroup>
	);
}

export function QRBlockWiFiVisibilityDropdown( {
	value,
	onSetContent,
	...other
} ) {
	return (
		<QRDropdownMenu { ...other } icon={ WiFiVisibilityIcon }>
			{ ( { onClose } ) => (
				<QRBlockWiFiVisibilityControl
					className="wp-block-wphackers-qr-block__toolbar-visibility"
					onClose={ onClose }
					onSetContent={ onSetContent }
					data={ parseWiFiNetworkData( value ) }
				/>
			) }
		</QRDropdownMenu>
	);
}

export function ToolbarGroupContent( { variationsType, onSetContent, value } ) {
	const contentDropdown = ( toggleProps ) => (
		<QRBlockContentDropdown
			toggleProps={ toggleProps }
			value={ value }
			onSetContent={ onSetContent }
			variationsType={ variationsType }
			label={ __( 'Set QR Code content', 'qr-block' ) }
			icon={ QRCodeContentIcon }
		/>
	);

	if ( ! variationsType ) {
		return (
			<ToolbarGroup>
				<ToolbarItem>
					{ contentDropdown }
				</ToolbarItem>
			</ToolbarGroup>
		);
	}

	return (
		<ToolbarGroup>
			<ToolbarItem>{ contentDropdown }</ToolbarItem>
			<ToolbarItem>
				{ ( toggleProps ) => (
					<QRBlockWiFiEncryptDropdown
						toggleProps={ toggleProps }
						value={ value }
						onSetContent={ onSetContent }
						label={ __( 'Encryption', 'qr-block' ) }
					/>
				) }
			</ToolbarItem>
			<ToolbarItem>
				{ ( toggleProps ) => (
					<QRBlockWiFiVisibilityDropdown
						toggleProps={ toggleProps }
						value={ value }
						onSetContent={ onSetContent }
						label={ __( 'Visibility', 'qr-code' ) }
					/>
				) }
			</ToolbarItem>
		</ToolbarGroup>
	);
}

export function PanelBodyQRContent( { variationsType, onSetContent, value } ) {
	const CodeControl = <CodeContentControl
		value={ value }
		onSetContent={ onSetContent }
		variationsType={ variationsType }
	/>;

	if ( ! variationsType ) {
		return (
			<PanelBody title={ __( 'Code content', 'qr-block' ) }>
				{ CodeControl }
			</PanelBody>
		);
	}

	const wifiNetworkData = parseWiFiNetworkData( value );

	return (
		<PanelBody title={ __( 'Code content', 'qr-block' ) }>
			{ CodeControl }

			<SelectControl
				label={ __( 'Encryption', 'qr-block' ) }
				options={ WIFI_ENCRYPTION_TYPES }
				onChange={ ( newType ) => {
					onSetContent( stringifyWiFiNetworkData( wifiNetworkData, { type: newType } ) )
				} }
				value={ wifiNetworkData.type }
			/>

			<SelectControl
				label={ __( 'Visibility', 'qr-block' ) }
				options={ WIFI_VISIVILITY_TYPES }
				onChange={ ( newVisibility ) => {
					onSetContent( stringifyWiFiNetworkData( wifiNetworkData, { hidden: newVisibility } ) )
				} }
				value={ wifiNetworkData.hidden }
			/>
		</PanelBody>
	);
}
