
/* IMPORT */

import * as _ from 'lodash';
import * as path from 'path';
import * as resolveFrom from 'resolve-from';
import * as vscode from 'vscode';
import Utils from './utils';

/* COMMANDS */

async function open ( pkg?: string | string[] ) {

  const textEditor = vscode.window.activeTextEditor;

  if ( !textEditor ) return vscode.window.showErrorMessage ( 'You need to have at least a file open' );

  /* SELECTIONS */

  if ( !pkg ) {

    const editor = vscode.window.activeTextEditor;

    if ( editor ) {

      const {document, selections} = editor,
            texts = _.compact ( selections.map ( selection => document.getText ( selection ) ) );

      if ( texts.length ) {

        pkg = texts;

      }

    }

  }

  /* INPUT BOX */

  if ( !pkg ) {

    pkg = await vscode.window.showInputBox ({
      placeHolder: 'NPM package name...'
    });

  }

  /* OPEN */

  if ( pkg ) {

    const fromPath = textEditor.document.uri.fsPath;

    _.castArray ( pkg ).forEach ( pkg => {

      try {

        const filePath: string = resolveFrom ( fromPath, pkg ),
              fileParts = filePath.split ( /(?:\\|\/)+/g ),
              pkgParts = pkg.split ( /(?:\\|\/)+/g ),
              endIndex = _.findLastIndex ( fileParts, ( p, index ) => _.isEqual ( fileParts.slice ( index - pkgParts.length, index ), pkgParts ) ),
              folderPath = fileParts.slice ( 0, endIndex ).join ( path.sep );

        Utils.folder.open ( folderPath, true );

      } catch ( e ) {

        vscode.window.showErrorMessage ( `Module "${pkg}" not found in node_modules` );

      }

    });

  }

}

/* EXPORT */

export {open};
