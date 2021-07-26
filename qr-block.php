<?php
/**
 * Plugin Name:       QR Block
 * Description:       Create a QR code on your website with this nice block.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.0.1
 * Author:            retrofox
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       qr-block
 *
 * @package           create-block
 */

// autoloader when using Composer
require( __DIR__ . '/vendor/autoload.php' );

function fbqr_render_qr_block( $attributes, $context, $block ) {
	if ( empty( $attributes['value'] ) ) {
		return;
	}

	// Compute the QR code size.
	$block_metadata = json_decode( file_get_contents( __DIR__ . "/block.json" ), true );

	// Block attributes.
	$fgc = isset( $attributes['codeHEXColor'] ) ? $attributes['codeHEXColor'] : 'black';
	$bgc = isset( $attributes['bgHEXColor'] ) ? $attributes['bgHEXColor'] : 'white';
	$size = isset( $attributes['size'] ) ? $attributes['size'] : 'medium';
	$align = isset( $attributes['align'] ) ? $attributes['align'] : false;
	$level = isset( $attributes['level'] ) ? $attributes['level'] : 'L';

	// CSS classes
	$css_classes = "wp-block-create-block-qr-block is-size-${size}";

	if ( $align ) {
		$css_classes .= " align${align}";
	}

	$size_options = $block_metadata['supports']['media-manager/sizes']['options'];
	$size_value = array_values( array_filter( $size_options, function ( $option ) use ( $size ) {
		return $size === $option['slug'];
	} ) );
	$code_size = (int) ( count( $size_value ) ? $size_value[0]['size'] : 1 ) * 4;

	// Instantiate the barcode class.
	$barcode = new \Com\Tecnick\Barcode\Barcode();

	// Generate a barcode.
	$bobj = $barcode->getBarcodeObj(
		"QRCODE,${level}",
		$attributes['value'],
		- $code_size,
		- $code_size,
		$fgc
	)->setBackgroundColor( $bgc );

	return sprintf(
		'<figure class="%1$s"><img alt="%2$s" src="data:image/png;base64,%3$s" title="%2$s" /></figure>',
		$css_classes,
		esc_html( $attributes['value'] ),
		base64_encode( $bobj->getPngData() )
	);
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 */
function fbqr_create_block_qr_block_block_init() {
	register_block_type(
		__DIR__,
		array(
			'render_callback' => 'fbqr_render_qr_block',
		)
	);
}
add_action( 'init', 'fbqr_create_block_qr_block_block_init' );
