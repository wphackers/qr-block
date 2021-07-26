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

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 */
function fbqr_create_block_qr_block_block_init() {
	register_block_type( __DIR__ );
}
add_action( 'init', 'fbqr_create_block_qr_block_block_init' );
