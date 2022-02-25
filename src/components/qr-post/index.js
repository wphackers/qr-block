/**
 * External dependencies
 */
import QRCode from 'qrcode.react';
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';

export default function QRPost( { level } ) {
	const { post: { title: postTitle }, permalink, edits: { title: editTitle } } = useSelect(
		select => ( {
			post: select( editorStore ).getCurrentPost(),
			slug: select( editorStore ).getEditedPostSlug(),
			permalink: select( editorStore ).getPermalink(),
			edits: select( editorStore ).getPostEdits(),
		} ),
		[]
	);

	// Post title: edited value or current one.
	const title = editTitle || postTitle;

	const qrContent = sprintf(
		/* translators: %s %s: Post Title - Post permalink */
		__( '%s %s', 'qr-block' ), title, permalink
	);

	return (
		<QRCode
			value={ qrContent }
			size={ 200 }
			level={ level }
			renderAs="canvas"
		/>
	);
}
