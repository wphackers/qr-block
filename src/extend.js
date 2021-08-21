/**
 * External dependencies
 */
 import QRCode from 'qrcode.react';

/**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment, useRef, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as blockEditorStore } from '@wordpress/block-editor';
import uploadBlobToMediaLibrary from './lib/upload-image';
 
const fromQRToImage = createHigherOrderComponent(
	( OriginalBlock ) => ( props ) => {
		const wrapperRef = useRef();
		const { attributes, setAttributes, isSelected } = props;
		const { caption, ...otherAttrs } = attributes;

		// Store QR component properties.
		let qrProps = {};

		const mediaUpload = useSelect( ( select ) => {
			const { getSettings } = select( blockEditorStore );
			return getSettings().mediaUpload;
		}, [] );

		// Convert, and probably upload, the image.
		useEffect( () => {
			if ( ! qrProps || ! wrapperRef?.current ) {
				return;
			}

			convertToImage( wrapperRef.current, function( err, attrs ) {
				if ( err ) {
					return;
				}

				setAttributes( attrs );
			} );
		}, [ qrProps, wrapperRef ] );


		function convertToImage( el, fn = () => {} ) {
			if ( ! el ) {
				return fn();
			}
	
			const canvasElement = el.querySelector( 'canvas' );
			if ( ! canvasElement ) {
				return fn();
			}

			const { value, size } = qrProps;
			const url = canvasElement.toDataURL('image/jpeg', 1.0 );

			/*
			 * Fragile: condition to check whether the block is inserted
			 * into the editor canvas, based on its isSelected value.
			 */
			if ( ! isSelected ) {
				return fn( null, {
					id: `temp-${ String( Math.random() ).split( '.' )[ 1 ] }`,
					url,
					caption: value,
					width: size,
					height: size,
					...otherAttrs,
				} );
			}

			canvasElement.toBlob( ( imageBlob ) => {
				uploadBlobToMediaLibrary( imageBlob, { caption: value, description: value }, function( err, image ) {
					if ( err ) {
						return fn( err );
					}

					fn( null, { ...image, width: size, height: size } );
				} );
			} );
		}

		if ( ! caption ) {
			return (
				<OriginalBlock { ...props } />
			);
		}

		// Check whether the `caption` attribute is a stringified data.
		try {
			qrProps = JSON.parse( attributes.caption );
		} catch ( e ) {
			return (
				<OriginalBlock { ...props } />
			);
		}

		// Check shape structure of the QR data.
		if ( ! qrProps?.value || ! qrProps?.size || ! qrProps?.level ) {
			return (
				<OriginalBlock { ...props } />
			);
		}

		return (
			<Fragment>
				{ qrProps && (
					<span style={ { display: 'none' } } ref={ wrapperRef }>
						<QRCode { ...qrProps } renderAs="canvas" />
					</span>
				) }
				<OriginalBlock { ...props } />
			</Fragment>
		);
	},
	'fromQRToImage'
);

export default fromQRToImage;
