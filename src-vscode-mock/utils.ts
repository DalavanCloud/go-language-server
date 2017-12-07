/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import URI from "vscode-uri";

export class Deferred<T> {

    constructor(private operation: string, timeout?: number) {
        setTimeout(() => {
            this.reject(new Error(this.operation + " timeout"));
        }, timeout || 20000)
    }

    resolve: (value?: T) => void;
    reject: (err?: any) => void;

    promise = new Promise<T>((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
    });
}

export function getTsserverExecutable(): string {
    return isWindows() ? 'tsserver.cmd' : 'tsserver'
}

export function isWindows(): boolean {
    return /^win/.test(process.platform);
}

export function uriToPath(stringUri: string): string {
    const uri = URI.parse(stringUri);
    return uri.fsPath;
}

export function pathToUri(p: string): string {
    return 'file://' + (isWindows() ? '/' + p.replace(/\//g, '/') : p);
}

export function uriToStringUri(uri: URI) {
    return pathToUri(uri.fsPath)
}