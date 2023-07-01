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

import { definePlugin } from "aero/plugin";

export default definePlugin({
    color: "#df9aaa",
    id: "prettyLinks",
    name: "Pretty Links",
    description: "Remove release channel information from message links.",
    author: {
        name: "TheCommieAxolotl",
        id: "538487970408300544",
    },
    patches: [
        {
            find: '"//").concat(location.host)',
            replacement: {
                match: ".concat(location.host)",
                replace: ".concat('discord.com')",
            },
        },
    ],
});
