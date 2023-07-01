/**
 * This file is part of Aero, a next-generation Discord mod empowering users and developers alike.
 * Copyright (c) 2023 TheCommieAxolotl & contributors.
 *
 * Aero is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Aero is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Aero. If not, see <https://www.gnu.org/licenses/>.
 */

import { WebpackInstance } from "discord-types/other";
import React from "react";

declare class PatcherContructor {
    before: (mod: { [x: PropertyKey]: () => unknown }, method: PropertyKey, callback: (args: any) => void) => void;
    instead: (mod: { [x: PropertyKey]: () => unknown }, method: PropertyKey, callback: (args: any, original: any) => void) => void;
    after: (mod: { [x: PropertyKey]: () => unknown }, method: PropertyKey, callback: (args: any, ret: any) => void) => void;
    unpatchAll: () => void;
}

declare global {
    interface Window {
        aero: {
            settings: { [key: string]: any };
            plugins: { [key: string]: any };
            themes: { [key: string]: any };
            docs: {
                openDocumentationPageWithString: (str: string) => void;
                openByName: (name: string) => void;
            };
            contextMenu: {
                patch: (pluginId: string, navId: string, callback: (children: React.ReactNode) => void) => void;
                unpatch: (pluginId: string) => void;
            };
            webpack: {
                get: (filter: string | string[] | ((ele: unknown) => boolean | string), returnDefault?: boolean, all?: boolean) => any;
                waitFor: (filter: string | string[] | ((ele: unknown) => string | boolean), returnDefault?: boolean, all?: boolean) => Promise<any>;
                Filters: {
                    byDisplayName: (name: string) => (ele: unknown) => boolean;
                    byStore: (name: string) => (ele: unknown) => boolean;
                    byMangled: (filter: (ele: unknown) => boolean) => (mod: unknown) => string | false;
                    byKeys: (...keys: string[]) => (m: unknown) => boolean;
                    byStrings: (...strings: string[]) => (m: unknown) => boolean;
                };
                common;
                globalPromise: Promise<unknown>;
                readonly require: WebpackInstance;
            };
            dom: {
                h: <T extends keyof HTMLElementTagNameMap>(type: T, props?: Partial<{ [key in keyof HTMLElementTagNameMap[T]]: unknown }>, children?: HTMLElement) => HTMLElementTagNameMap[T];
                head: HTMLElement;
                body: HTMLElement;
                themes: HTMLElement;
                styles: HTMLElement;
                snippets: HTMLElement;
                injectStyles: (id: string, css: string) => void;
                removeStyles: (id: string) => void;
            };
            patcher: PatcherContructor;
            components: {
                Icons: {
                    [key in "External" | "Folder" | "Check" | "Cross" | "Cloud" | "Copy" | "Gear" | "Plus" | "Book" | "Dev"]: React.FC;
                };
                ErrorBoundary: React.FC;
                SettingsItem: React.FC;
                PanelButton: React.FC;
                FormTitle: React.FC;
                TextInput: React.FC;
                Button: React.FC;
                Switch: React.FC;
                Alert: React.FC;
            };
        };
    }
}
