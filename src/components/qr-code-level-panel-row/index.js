/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	PanelRow,
	ExternalLink,
	__experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { qrDefaultLevels } from '../../utils/qr-levels';

export default function QRCodeLevelPanelRow( { value, onChange } ) {
	return (
		<PanelRow>
			<ToggleGroupControl
				value={ value }
				isBlock
				onChange={ onChange }
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
