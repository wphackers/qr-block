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
 * @package           fancy-blocks
 */

// autoloader when using Composer
require( __DIR__ . '/vendor/autoload.php' );

function fbqr_render_qr_block( $attributes, $context, $block ) {
	if ( empty( $attributes['value'] ) ) {
		return;
	}

	// Block attributes.
	$fgc = isset( $attributes['codeHEXColor'] ) ? $attributes['codeHEXColor'] : 'black';
	$bgc = isset( $attributes['bgHEXColor'] ) ? $attributes['bgHEXColor'] : 'white';
	$size = isset( $attributes['size'] ) ? $attributes['size'] : 'medium';
	$align = isset( $attributes['align'] ) ? $attributes['align'] : false;
	$level = isset( $attributes['level'] ) ? $attributes['level'] : 'L';

	// Pick up size slug.
	$sizes = json_decode( file_get_contents( __DIR__ . "/src/sizes.json" ), true );
	$size_item = array_values( array_filter( $sizes, function( $item ) use ( $size ) {
		return $item['value'] === $size;
	} ) );
	$size_slug = count( $size_item ) > 0 ? $size_item[0]['slug'] : 'medium';
	
	// CSS classes
	$css_classes = "wp-block-fancy-blocks-qr-block is-size-${size_slug}";

	if ( $align ) {
		$css_classes .= " align${align}";
	}

	// Instantiate the barcode class.
	$barcode = new \Com\Tecnick\Barcode\Barcode();

	// Generate a barcode.
	$bobj = $barcode->getBarcodeObj(
		"QRCODE,${level}",
		$attributes['value'],
		- $size * 4, // https://github.com/tecnickcom/tc-lib-barcode#simple-code-example
		- $size * 4,
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
