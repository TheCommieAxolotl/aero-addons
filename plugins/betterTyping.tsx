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

import { common, getByStore, getByStrings } from "aero/webpack";
import { definePlugin, SettingsItemType, pluginSettings } from "aero/plugin";
import { injectStyles } from "aero/dom";

const settings = pluginSettings("betterTyping");

let TypingStore: any;

const getTyping = (): { id: string; user: any; member: any }[] => {
    if (!TypingStore) TypingStore = getByStore("TypingStore");

    const channel = common.stores.SelectedChannelStore.getChannelId();
    const guild = common.stores.SelectedGuildStore.getGuildId();

    if (!channel) throw new Error("Dms are bad");

    const ids = Object.keys(TypingStore.getTypingUsers(channel));

    return ids.map((id) => ({
        id,
        user: common.stores.UserStore.getUser(id),
        member: common.stores.GuildMemberStore.getMember(guild, id),
    }));
};

// thanks ven
const openUserProfile = async (userId: string) => {
    const fetchUser = getByStrings(".USER(");
    const openProfile = getByStrings("friendToken", "USER_PROFILE_MODAL_OPEN");
    const guildId = common.stores.SelectedGuildStore.getGuildId();
    const channelId = common.stores.SelectedChannelStore.getChannelId();

    await fetchUser(userId);

    openProfile({
        userId,
        guildId,
        channelId,
        analyticsLocation: {
            page: guildId ? "Guild Channel" : "DM Channel",
            section: "Profile Popout",
        },
    });
};

injectStyles(
    "clickableTyping",
    `
.clickableTyping-user {
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
}`
);

export default definePlugin({
    color: "#df9aaa",
    id: "betterTyping",
    name: "BetterTyping",
    description: "Enhance the typing indicator to be more useful. (Show Role Colors, Clickable Usernames)",
    settings: [
        {
            id: "showRoleColors",
            name: "Show Role Colors",
            type: SettingsItemType.BOOLEAN,
            description: "Show Role Colors in the typing indicator.",
            initialValue: true,
        },
    ],
    author: {
        name: "TheCommieAxolotl",
    },
    self: {
        makeChildren: (p) => {
            const typing = getTyping();

            if (!p || !Array.isArray(p)) return p;

            return p.map((e: any) => {
                if (e.type === "strong") {
                    const t = typing.find(({ user, member }) => {
                        return user.globalName === e.props.children[0] || member?.nick === e.props.children[0] || user.username === e.props.children[0];
                    });

                    if (!t) return e;

                    return (
                        <strong
                            className="clickableTyping-user"
                            style={{
                                color: settings["showRoleColors"] ? t.member?.colorString : undefined,
                            }}
                            onClick={() => {
                                openUserProfile(t.id);
                            }}
                        >
                            {e.props.children}
                        </strong>
                    );
                }

                return e;
            });
        },
    },
    patches: [
        {
            find: ".Z.Messages.TWO_USERS_TYPING.format({",
            replacement: {
                match: /aria-atomic":!0,children:(\w{1,2})/,
                replace: `aria-atomic":!0,children:$self.makeChildren($1)`,
            },
        },
    ],
});
