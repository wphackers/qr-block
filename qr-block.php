<?php
/**
 * Plugin Name:       QR Block
 * Description:       Another amazing QR Code block for Gutenberg.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.0.8
 * Author:            retrofox
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       qr-block
 *
 * @package           wphackers
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 */
function wph_qr_create_block_qr_block_block_init() {
	register_block_type_from_metadata( __DIR__ );
}
add_action( 'init', 'wph_qr_create_block_qr_block_block_init' );
