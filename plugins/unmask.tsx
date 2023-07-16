/**
 * This file is an addon created for use with Aero, a next-generation Discord mod empowering users and developers alike.
 * Copyright (c) 2023 TheCommieAxolotl & contributors.
 *
 * This addon is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This addon is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this addon. If not, see <https://www.gnu.org/licenses/>.
 */

// @ts-ignore
import React from "react";

import { definePlugin, pluginSettings, SettingsItemType } from "aero/plugin";
import { injectStyles } from "aero/dom";

const settings = pluginSettings("unmask");

injectStyles(
    "unmask",
    `
.unmask {
    color: var(--text-muted);
    font-weight: 500;
    font-size: 0.9em;
    margin-left: 4px;
    text-decoration: none;
}`
);

export default definePlugin({
    color: "#df9aaa",
    id: "unmask",
    name: "Unmask",
    description: "Shows users with nicknames' usernames in chat.",
    author: {
        name: "TheCommieAxolotl",
        id: "538487970408300544",
    },
    settings: [
        {
            id: "at",
            name: "@ instead of parenthesis",
            description: "Use @ instead of parenthesis to show the username.",
            type: SettingsItemType.BOOLEAN,
        },
    ],
    self: {
        make: (a: string, username: string) => {
            return (
                <>
                    {a}
                    <span className="unmask">{settings["at"] ? ` @${username}` : ` (${username})`}</span>
                </>
            );
        },
    },
    patches: [
        {
            find: ".withMentionPrefix,",
            replacement: {
                match: /children:(.{1,2}\+.{1,2})};/,
                replace: "children: (($1).toLowerCase() === e.message.author.username.toLowerCase()) ? $1 : $self.make(($1), e.message.author.username)};",
            },
        },
    ],
});
