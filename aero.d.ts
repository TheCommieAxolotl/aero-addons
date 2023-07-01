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

type PatchReplacment = {
    match: string | RegExp;
    replace: string | ((...args: string[]) => string);
    predicate?(): boolean;
};

type Patch = {
    _active?: boolean;
    find: string;
    replacement: PatchReplacment[] | PatchReplacment;
    all?: boolean;
    ignoreWarnings?: boolean;
    predicate?(): boolean;
};

type Author<T = string> = {
    name: string;
    id?: T;
};

declare enum SettingsItemTypes {
    BOOLEAN = "boolean",
    NUMBER = "number",
    STRING = "string",
}

type SettingsOption = {
    id: string;
    name: string;
    description: string;
    type: SettingsItemTypes;
};

type APlugin = {
    id: string;
    name: string;
    description: string;
    author: Author | Author[];
    dependencies?: string[];
    settings?: SettingsOption[];
    self?: Record<string, unknown>;
    patches?: Patch[];
    start?(): void;
    stop?(): void;
    color?: string;
};

type AnyPlugin = APlugin;

type AeroPlugin = APlugin;

type Theme = {
    id: string;
    name: string;
    entrypoint: string;
    description: string;
    author: Author | Author[];
    dependencies?: string[];
    color?: string;
};

declare module "aero/plugin" {
    function definePlugin(plugin: AeroPlugin): AeroPlugin;
    function pluginSettings(pluginID: string): ProxyHandler<Record<string, unknown>>;
    enum SettingsItemTypes {
        BOOLEAN = "boolean",
        NUMBER = "number",
        STRING = "string",
    }
}

declare module "aero/theme" {
    function defineTheme(theme: Theme): Theme;
}

declare module "aero/dom" {
    function injectStyles(id: string, css: string): void;
}

declare module "aero/webpack" {
    var common: {
        stores: Record<string, any>;
        actions: Record<string, any>;
        components: Record<string, (...props: any[]) => any>;
        hljs: any;
        React: any;
        Dispatcher: any;
    };
    function getModule(filter: string | string[] | ((module: any) => boolean)): any;
}

declare module "aero/ui" {
    export var Icons: {
        [key in "External" | "Folder" | "Check" | "Cross" | "Cloud" | "Copy" | "Gear" | "Plus" | "Book" | "Dev"]: any;
    };

    export var ErrorBoundary: any;
    export var SettingsItem: any;
    export var PanelButton: any;
    export var FormTitle: any;
    export var TextInput: any;
    export var Button: any;
    export var Switch: any;
    export var Alert: any;
}
