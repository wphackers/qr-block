/**
 * External dependencies
 */
import { debounce } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { Fragment, useState, useCallback } from '@wordpress/element';
import {
	DropdownMenu,
	MenuGroup,
	RangeControl,
	SelectControl,
	Button,
} from '@wordpress/components';
import { aspectRatio } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import sizes from './sizes.json';

export function SizeSelectorControl( {
	onSize,
	size,
} ) {
	const [ customSize, setCustomSize ] = useState( size );

	function setSize( size ) {
		onSize( Number( size ) );
		setCustomSize( Number( size ) );
	}

	const debouncedOnChange = useCallback(
		debounce( function( debSize, debOnSizeChange ) {
			debOnSizeChange( debSize );
		}, 250 ),
		[]
	);

	function onRangeChange( newSize ) {
		setCustomSize( newSize );
		debouncedOnChange( newSize, onSize );
	}

	return (
		<Fragment>
			<SelectControl
				label={ __( 'Preset', 'qr-block' ) }
				options={ sizes }
				onChange={ setSize }
				value={ size }
			/>

			<RangeControl
				label={ __( 'Custom' ) }
				min={ 2 }
				max={ 2048 }
				value={ customSize }
				onChange={ onRangeChange }
			/>
		</Fragment>
	);
}

export function QRBlockSizeDropdown( {
	toggleProps,
	size,
	onSize,
} ) {
	return (
		<DropdownMenu
			icon={ aspectRatio }
			label={ __( 'Size', 'qr-block' ) }
			popoverProps={ {
				position: 'bottom right',
				isAlternate: true,
			} }
			toggleProps={ toggleProps }
			className="qr-block__size"
		>
			{ ( { onClose } ) => (
				<MenuGroup
					label={ __( 'QR Block size', 'qr-block' ) }
					className="wp-block-wphackers-qr-block__toolbar-menu-group"
				>
					<SizeSelectorControl
						onSize={ onSize }
						size={ size }
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
		</DropdownMenu>
	);
}