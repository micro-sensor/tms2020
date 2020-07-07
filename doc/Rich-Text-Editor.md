### CKEDITOR

If you wonder, where ```barsbek/ckeditor5-build-baylor-tms": "^1.0.0"``` in ```package.json``` comes from, 
it's a customization of CKEditor's classic build. 
Instructions are [here](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/development/custom-builds.html).

What I did:
1. clone or fork ```https://github.com/ckeditor/ckeditor5-build-classic.git``` somewhere outside of the project
It was on version 19.0.0. when it was lastly cloned and used
2. ```npm install```
3. modify ```src/ckeditor.js``` and add extra features and plugins
4. ```npm run build```
5. create account in [https://www.npmjs.com/](https://www.npmjs.com/)
6. ```npm login```
7. ```npm publish --access public```
8. add ```barsbek/ckeditor5-build-baylor-tms": "^1.0.0``` into your project's package.json

#### Content of ```src/ckeditor.js``` :
```
/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import InlineEditorBase from '@ckeditor/ckeditor5-editor-inline/src/inlineeditor';

import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Code from '@ckeditor/ckeditor5-basic-styles/src/code';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock';
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock';
import Font from '@ckeditor/ckeditor5-font/src/font';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters';
import SpecialCharactersEssentials from '@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';

import GFMDataProcessor from '@ckeditor/ckeditor5-markdown-gfm/src/gfmdataprocessor';

class ClassicEditor extends ClassicEditorBase {}
class InlineEditor extends InlineEditorBase {}

// custom plugins:
function Markdown( editor ) {
	editor.data.processor = new GFMDataProcessor( editor.editing.view.document );
}

// Plugins to include in the build.
const plugins = [
	// Added:
	Markdown,
	Underline,
	Strikethrough,
	Code,
	Subscript,
	Superscript,
	IndentBlock,
	CodeBlock,
	Font,
	RemoveFormat,
	SpecialCharacters,
	SpecialCharactersEssentials,
	Alignment,
	// Was in Classis build:
	Essentials,
	UploadAdapter,
	Autoformat,
	Bold,
	Italic,
	BlockQuote,
	CKFinder,
	EasyImage,
	Heading,
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Indent,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar,
	TextTransformation
];

// Editor configuration.
const config = {
	toolbar: {
		items: [
			'heading',
			'|',
			'undo',
			'redo',
			'|',
			'selectAll',
			'bold',
			'italic',
			'underline',
			'strikethrough',
			'subscript',
			'superscript',
			'fontColor',
			'fontBackgroundColor',
			'blockQuote',
			'|',
			'code',
			'codeBlock',
			'|',
			'bulletedList',
			'numberedList',
			'|',
			'alignment',
			'indent',
			'outdent',
			'|',
			'specialCharacters',
			'link',
			'imageUpload',
			'insertTable',
			'mediaEmbed',
			'|',
			'removeFormat'
		]
	},
	image: {
		toolbar: [
			'imageStyle:full',
			'imageStyle:side',
			'|',
			'imageTextAlternative'
		]
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells'
		]
	},
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'en'
};

ClassicEditor.builtinPlugins = plugins;
InlineEditor.builtinPlugins = plugins;

ClassicEditor.defaultConfig = config;
InlineEditor.defaultConfig = config;

export default {
	ClassicEditor, InlineEditor
};

```
#### Content of ```package.json``` after modification:
```
{
  "name": "@barsbek/ckeditor5-build-baylor-tms",
  "version": "1.0.0",
  "description": "The custom editor build for TMS project with extra plugins added on top of the classic editor build of CKEditor 5 version 19.0.0",
  "keywords": [
    "ckeditor5-build",
    "ckeditor",
    "ckeditor5",
    "ckeditor 5",
    "wysiwyg",
    "rich text",
    "editor",
    "html",
    "contentEditable",
    "editing",
    "operational transformation",
    "ot",
    "collaboration",
    "collaborative",
    "real-time",
    "framework"
  ],
  "main": "./build/ckeditor.js",
  "files": [
    "build"
  ],
  "devDependencies": {
    "@ckeditor/ckeditor5-alignment": "^19.0.0",
    "@ckeditor/ckeditor5-code-block": "^19.0.0",
    "@ckeditor/ckeditor5-font": "^19.0.0",
    "@ckeditor/ckeditor5-markdown-gfm": "^19.0.0",
    "@ckeditor/ckeditor5-remove-format": "^19.0.0",
    "@ckeditor/ckeditor5-special-characters": "^19.0.0",
    "@ckeditor/ckeditor5-adapter-ckfinder": "^19.0.0",
    "@ckeditor/ckeditor5-autoformat": "^19.0.0",
    "@ckeditor/ckeditor5-basic-styles": "^19.0.0",
    "@ckeditor/ckeditor5-block-quote": "^19.0.0",
    "@ckeditor/ckeditor5-ckfinder": "^19.0.0",
    "@ckeditor/ckeditor5-core": "^19.0.0",
    "@ckeditor/ckeditor5-dev-utils": "^13.0.0",
    "@ckeditor/ckeditor5-dev-webpack-plugin": "^9.0.0",
    "@ckeditor/ckeditor5-easy-image": "^19.0.0",
    "@ckeditor/ckeditor5-editor-inline": "^19.0.0",
    "@ckeditor/ckeditor5-editor-classic": "^19.0.0",
    "@ckeditor/ckeditor5-essentials": "^19.0.0",
    "@ckeditor/ckeditor5-heading": "^19.0.0",
    "@ckeditor/ckeditor5-image": "^19.0.0",
    "@ckeditor/ckeditor5-indent": "^19.0.0",
    "@ckeditor/ckeditor5-link": "^19.0.0",
    "@ckeditor/ckeditor5-list": "^19.0.0",
    "@ckeditor/ckeditor5-media-embed": "^19.0.0",
    "@ckeditor/ckeditor5-paragraph": "^19.0.0",
    "@ckeditor/ckeditor5-paste-from-office": "^19.0.0",
    "@ckeditor/ckeditor5-table": "^19.0.0",
    "@ckeditor/ckeditor5-typing": "^19.0.0",
    "@ckeditor/ckeditor5-theme-lark": "^19.0.0",
    "eslint": "^5.5.0",
    "eslint-config-ckeditor5": "^2.0.0",
    "husky": "^1.3.1",
    "lint-staged": "^7.0.0",
    "stylelint": "^13.3.3",
    "stylelint-config-ckeditor5": "^1.0.0",
    "postcss-loader": "^3.0.0",
    "raw-loader": "^3.1.0",
    "style-loader": "^1.0.0",
    "terser-webpack-plugin": "^2.2.1",
    "webpack": "^4.39.1",
    "webpack-cli": "^3.3.6"
  },
  "engines": {
    "node": ">=8.0.0",
    "npm": ">=5.7.1"
  },
  "author": "CKSource (http://cksource.com/)",
  "license": "GPL-2.0-or-later",
  "homepage": "https://ckeditor.com/ckeditor-5",
  "bugs": "https://github.com/ckeditor/ckeditor5/issues",
  "repository": {
    "type": "git",
    "url": "https://github.com/ckeditor/ckeditor5-build-classic.git"
  },
  "scripts": {
    "build": "webpack --mode production",
    "lint": "eslint --quiet '**/*.js'",
    "stylelint": "stylelint --quiet --allow-empty-input 'theme/**/*.css' 'docs/**/*.css'",
    "preversion": "npm run build"
  },
  "lint-staged": {
    "**/*.js": [
      "eslint --quiet"
    ],
    "**/*.css": [
      "stylelint --quiet --allow-empty-input"
    ]
  },
  "eslintIgnore": [
    "build/**",
    "packages/**"
  ],
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  }
}


```



