/**
* External dependencies
*/
import QRCode from 'qrcode.react';

/**
* WordPress dependencies
*/
import { __, sprintf } from "@wordpress/i18n";
import {
	DropdownMenu,
	MenuGroup,
	Button,
} from '@wordpress/components';
import { cog } from '@wordpress/icons';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */

 export function ErrorCorrectionControl( {
	value,
	level,
	fgColor,
	bgColor,
	onSetLevel = () => {},
	help,
	className,
} ) {
	return (
		<Fragment>
			<div className={ className }>
				{ [ 'L', 'M', 'Q', 'H' ].map( ( newLevel ) => (
					<div className="correction-control-item" key={ `level-${ newLevel.toLocaleLowerCase() }` }>
						<label>
							{
								sprintf(
									/* translators: %s: Error correction level. */
									__( 'Level %s', 'qr-block' ),
									newLevel,
									)
								}
						</label>
						<Button
							isPrimary={ newLevel === level }
							onClick={ () => onSetLevel( newLevel ) }
							>
							<QRCode
								value={ value }
								size={ 100 }
								level={ newLevel }
								fgColor={ fgColor }
								bgColor={ bgColor }
								renderAs="canvas"
								/>
						</Button>
					</div>
				) ) }
			</div>
			{ help }
		</Fragment>
	);
}


export function QRBlockErrorCorrectionDropdown( {
	toggleProps,
	onSetLevel,
	className,
	...otherAttributes
} ) {
	return (
		<DropdownMenu
			icon={ cog }
			popoverProps={ {
				position: 'bottom right',
				isAlternate: true,
			} }
			toggleProps={ toggleProps }
			className="qr-block__size"
			label={ __( 'Change error correction', 'qr-block' ) }
		>
			{ ( { onClose } ) => (
				<MenuGroup
					className={ className }
					label={ __( 'Error correction', 'qr-block' ) }
				>
					<ErrorCorrectionControl
						className="error-correction-control-dropdown"
						onSetLevel={ ( value ) => {
							onSetLevel( value );
							onClose();
						} }
						{ ...otherAttributes }
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