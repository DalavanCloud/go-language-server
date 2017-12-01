import { GoImplementationProvider } from '../src/goImplementations';
import { installCurrentPackage } from '../src/goInstall';
import { commands } from './commands'
import { addImport } from '../src/goImport';
import { LspClient } from './lsp-client';
import { LspServer } from './lsp-server';
import { errorDiagnosticCollection, warningDiagnosticCollection } from '../src/goMain';
import { window } from './window';
import { Logger } from './logger';
import { lintCode } from '../src/goLint';
import { vetCode } from '../src/goVet';
import * as goGenerateTests from '../src/goGenerateTests';
import { goGetPackage } from '../src/goGetPackage';
import { addTags, removeTags } from '../src/goModifytags';

export function activate(lspClient: LspClient, lspServer: LspServer, logger: Logger) {
	console.log = logger.log.bind(logger)
	console.error = logger.error.bind(logger)
	console.warn = logger.warn.bind(logger)
	console.info = logger.info.bind(logger)

	errorDiagnosticCollection.onSet(lspClient.publishDiagnostics.bind(lspClient))
	warningDiagnosticCollection.onSet(lspClient.publishDiagnostics.bind(lspClient))
	window.lspClient = lspClient

	commands.lspClient = lspClient
	commands.registerCommand('go.import.add', (arg: string) => {
		if (Array.isArray(arg) && arg.length == 1)
			arg = arg[0]
		return addImport(typeof arg === 'string' ? arg : null);
	})

	commands.registerCommand('go.install.package', installCurrentPackage);

	commands.registerCommand('go.lint.package', lintCode);
	commands.registerCommand('go.lint.workspace', () => lintCode(true));

	commands.registerCommand('go.vet.package', vetCode);
	commands.registerCommand('go.vet.workspace', () => vetCode(true));

	commands.registerCommand('go.test.generate.package', () => {
		goGenerateTests.generateTestCurrentPackage();
	});
	commands.registerCommand('go.test.generate.file', () => {
		goGenerateTests.generateTestCurrentFile();
	});
	commands.registerCommand('go.test.generate.function', () => {
		goGenerateTests.generateTestCurrentFunction();
	});
	// unmapped:
	// 'go.toggle.test.file': missing command 'open.file'

	commands.registerCommand('go.get.package', goGetPackage);
	
	commands.registerCommand('go.add.tags', (args) => {
		addTags(args);
	});
	commands.registerCommand('go.remove.tags', (args) => {
		removeTags(args);
	});
}