import * as vscode from 'vscode';

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {
	let equDecorationType = vscode.window.createTextEditorDecorationType({
		backgroundColor: 'transparent',
		border: 'none',
		textDecoration: 'none',
	});
	let usageDecorationType = vscode.window.createTextEditorDecorationType({
		backgroundColor: 'transparent',
		border: 'none',
		textDecoration: 'none',
	});

	console.log('decorator sample is activated');

	let timeout: NodeJS.Timeout | undefined = undefined;

	let activeEditor = vscode.window.activeTextEditor;

	function updateEqus() {
		if (!activeEditor) {
			return;
		}

		const regEx = /\.equ\s+([A-Za-z_][A-Za-z0-9_]*)\s*,\s*([^\s]+)/g;
		const text = activeEditor.document.getText();
		const equDecorations: vscode.DecorationOptions[] = [];
		const usageDecorations: vscode.DecorationOptions[] = [];
		const symbolMap: Record<string, string> = {};

		let match;
		while ((match = regEx.exec(text))) {
			const symbolName = match[1];
			const symbolValue = match[2];
			symbolMap[symbolName] = symbolValue;

			const fullMatchStart = match.index;
			const nameRelativeIndex = match[0].indexOf(symbolName);
			const nameStartPos = activeEditor.document.positionAt(fullMatchStart + nameRelativeIndex);
			const nameEndPos = activeEditor.document.positionAt(fullMatchStart + nameRelativeIndex + symbolName.length);

			//equDecorations.push({
			//	range: new vscode.Range(nameStartPos, nameEndPos),
			//	hoverMessage: `**${symbolName}** defined as \`${symbolValue}\``,
			//});
		}

		// Now find other occurrences of each symbol in the document
		for (const symbol in symbolMap) {
			const usageRegex = new RegExp(`\\b${symbol}\\b`, 'g');
			let usageMatch;
			while ((usageMatch = usageRegex.exec(text))) {
				const start = activeEditor.document.positionAt(usageMatch.index);
				const end = activeEditor.document.positionAt(usageMatch.index + symbol.length);
				usageDecorations.push({
					range: new vscode.Range(start, end),
					hoverMessage: `**${symbol}** expands to \`${symbolMap[symbol]}\``,
				});
			}
		}

		// Apply both decorations
		activeEditor.setDecorations(equDecorationType, equDecorations);
		activeEditor.setDecorations(usageDecorationType, usageDecorations);
	}


	function triggerUpdateDecorations(throttle = false) {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
		if (throttle) {
			timeout = setTimeout(updateEqus, 500);
		} else {
			updateEqus();
		}
	}

	if (activeEditor) {
		triggerUpdateDecorations();
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			console.log("Detected language ID:", editor.document.languageId);
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations(true);
		}
	}, null, context.subscriptions);

}
