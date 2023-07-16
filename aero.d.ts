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

declare enum SettingsItemType {
    BOOLEAN = "boolean",
    NUMBER = "number",
    STRING = "string",
}

type SettingsOption<T extends SettingsItemType> = {
    id: string;
    name: string;
    description: string;
    initialValue?: T extends SettingsItemType.BOOLEAN ? boolean : T extends SettingsItemType.NUMBER ? number : T extends SettingsItemType.STRING ? string : never;
    type: T;
};

type APlugin<T extends SettingsItemType> = {
    id: string;
    name: string;
    description: string;
    author: Author | Author[];
    dependencies?: string[];
    settings?: SettingsOption<T>[];
    self?: Record<string, unknown>;
    patches?: Patch[];
    start?(): void;
    stop?(): void;
    color?: string;
};

type AnyPlugin<T extends SettingsItemType> = APlugin<T>;

type AeroPlugin<T extends SettingsItemType> = APlugin<T>;

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
    function definePlugin<T extends SettingsItemType>(plugin: AeroPlugin<T>): AeroPlugin<T>;
    function pluginSettings(pluginID: string): ProxyHandler<Record<string, unknown>>;
    enum SettingsItemType {
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
    function removeStyles(id: string): void;
    function h<T extends keyof HTMLElementTagNameMap>(type: T, props?: Partial<{ [key in keyof HTMLElementTagNameMap[T]]: unknown }>, children?: HTMLElement): HTMLElementTagNameMap[T];
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
    function getByDisplayName(name: string): any;
    function getByStore(name: string): any;
    function getByMangled(filter: (ele: unknown) => boolean): any;
    function getByKeys(...keys: string[]): any;
    function getByStrings(...strings: string[]): any;
}

declare module "aero/ui" {
    export var Icons: {
        [key in "Eye" | "External" | "Folder" | "Check" | "Cross" | "Cloud" | "Copy" | "Gear" | "Plus" | "Book" | "Dev"]: any;
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

declare module "aero/badges" {
    export type PartialUser = {
        bot: boolean;
        id: string;
        username: string;
        globalName?: string;
        discriminator: string;
    };
    export type Badge = {
        predicate?: (user: PartialUser) => boolean;
        tooltipText?: string;
        onClick?: (event: MouseEvent, user: PartialUser) => void;
        /**
         * Component to render on the user's profile.
         */
        component?: (props: { user: PartialUser; html: any }) => JSX.Element;
        /**
         * URL to the image to render on the user's profile.
         */
        url?: string;
    };

    function removeProfileBadge(badge: Badge): void;
    function addProfileBadge(badge: Badge): void;
}
