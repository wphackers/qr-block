/**
 * External dependencies
 */
import { debounce } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, sprintf } from "@wordpress/i18n";
import {
	Fragment,
	useState,
	useCallback,
	createInterpolateElement,
} from '@wordpress/element';
import {
	DropdownMenu,
	MenuGroup,
	RangeControl,
	SelectControl,
	Button,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import sizes from './sizes.json';
import { QRSizeIcon } from '../icons';

export function SizeSelectorControl( {
	onSize,
	size = 200,
	onPresetSize = () => {},
} ) {
	const [ customSize, setCustomSize ] = useState( size );

	function setSize( size ) {
		size = Number( size );
		onSize( size );
		setCustomSize( size );
		onPresetSize( size ); 
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
				label={ __( 'Preset sizes', 'qr-block' ) }
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

			<p>
				{ createInterpolateElement(
					sprintf(
						/* translators: 1: Image size, e.g. 200 */
						'Image size: <strong>%1$spx</strong> x <strong>%1$spx</strong>.',
						customSize
					),
					{
						strong: (
							<strong />
						),
					}
				) }
			</p>
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
			icon={ QRSizeIcon }
			popoverProps={ {
				position: 'bottom right',
				isAlternate: true,
			} }
			toggleProps={ toggleProps }
			className="qr-block__size"
			label={ __( 'Change block size', 'qr-block' ) }
		>
			{ ( { onClose } ) => (
				<MenuGroup className="wp-block-wphackers-qr-block__toolbar-menu-group">
					<SizeSelectorControl
						onSize={ onSize }
						size={ size }
						onPresetSize={ onClose }
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