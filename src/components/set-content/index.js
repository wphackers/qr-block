/**
* External dependencies
*/
import { debounce } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import {
	DropdownMenu,
	MenuGroup,
	Button,
	TextareaControl,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { QRCodeContent } from '../../icons';

export function CodeContentControl( {
	value,
	onSetContent,
} ) {
	return (
		<TextareaControl
			label={ __( 'Code content', 'qr-data' ) }
			multiple={ true }
			value={ value }
			onChange={ onSetContent }
		/>
	);
}

export function QRBlockContentDropdown( {
	toggleProps,
	value,
	onSetContent,
} ) {
	return (
		<DropdownMenu
			icon={ QRCodeContent }
			popoverProps={ {
				position: 'bottom right',
				isAlternate: true,
			} }
			toggleProps={ toggleProps }
			className="qr-block__content"
		>
			{ ( { onClose } ) => (
				<MenuGroup className="wp-block-wphackers-qr-block__toolbar-menu-group">
					<CodeContentControl value={ value } onSetContent={ onSetContent } />

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
		</DropdownMenu>
	);
}