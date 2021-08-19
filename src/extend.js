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

			convertToImage( wrapperRef.current, ( err, attrs ) {
				if ( err ) {
					return;
				}

				setAttributes( attrs );
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
				return fn( {
					id: `temp-${ String( Math.random() ).split( '.' )[ 1 ] }`,
					url,
					caption: value,
					width: size,
					height: size,
					...otherAttrs,
				} );
			}
	
			canvasElement.toBlob( ( imageBlob ) => {
				const reader = new window.FileReader();
				reader.readAsDataURL( imageBlob );
				reader.onloadend = () => {
					mediaUpload( {
						additionalData: {
							title: __( 'Image generated from a QR block', 'qr-block' ),
							caption: value,
							description: value,
						},
						allowedTypes: [ 'image' ],
						filesList: [ imageBlob ],
						onFileChange: ( images ) => {
							if ( ! images?.length ) {
								return;
							}
	
							const image = images[ 0 ];
							if ( ! image?.id ) {
								return;
							}

							fn( null, { ...image, width: size, height: size } );
						},
						onError: fn,
					} );
				};
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
