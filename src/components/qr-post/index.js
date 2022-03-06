/**
 * External dependencies
 */
import QRCode from 'qrcode.react';
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { store as editorStore } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';

/**
 * QRPost is a component that renders a QR code for a post,
 * pulling the post data from the editor store.
 * It supports a onContentChange callback to update the QR code.
 * 
 * ToDo: consider to replace this component with a dynamic block.
 * 
 * @param {object} props                 - Component props.
 * @param {string} props.onContentChange - Callback to update the QR code.
 * 
 * @returns {object} - React component.
 */
export default function QRPost( { onContentChange, ...props } ) {
	const { post: { title: postTitle }, permalink, edits: { title: editTitle } } = useSelect(
		select => ( {
			post: select( editorStore ).getCurrentPost(),
			slug: select( editorStore ).getEditedPostSlug(),
			permalink: select( editorStore ).getPermalink(),
			edits: select( editorStore ).getPostEdits(),
		} ),
		[]
	);

	function buildQRContent( title, permalink ) {
		return sprintf(
			/* translators: %s %s: Post Title - Post permalink */
			__( '%s %s', 'qr-block' ), title, permalink
		);
	}

	// Post title: edited value or current one.
	const title = editTitle || postTitle;

	const [ content, setContent ] = useState( buildQRContent( title, permalink ) );

	useEffect( () => {
		const qrContent = buildQRContent( title, permalink );
		setContent( qrContent );

		if ( onContentChange ) {
			onContentChange( qrContent );
		}
	}, [ title, permalink, buildQRContent, onContentChange ] );

	return (
		<QRCode
			value={ content }
			renderAs="canvas"
			{ ... props }
		/>
	);
}
