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

import { definePlugin } from "aero/plugin";
import { injectStyles } from "aero/dom";
import { common } from "aero/webpack";

injectStyles(
    "previewMessage",
    `
.preview-button {
    background-color: transparent;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    filter: grayscale(100%);
    cursor: pointer;
    color: var(--interactive-normal);

    &:hover {
        color: var(--interactive-active);
    }
}

[class*=innerDisabled] .preview-button {
    display: none;
}`
);

export default definePlugin({
    color: "#df9aaa",
    id: "previewMessage",
    name: "Preview Message",
    description: "Allows you to preview a message before you send it.",
    author: {
        name: "TheCommieAxolotl",
        id: "538487970408300544",
    },

    self: {
        sendPreview: () => {
            const channelID = common.stores.SelectedChannelStore.getChannelId();

            const draft = common.stores.DraftStore.getDraft(channelID, 0);

            if (draft) {
                common.actions.MessageActions.sendBotMessage(channelID, draft);
            }
        },
        renderPreviewButton: () => {
            return (
                <common.components.Tooltip text="Preview Message">
                    {(props) => (
                        <button
                            {...props}
                            className="preview-button"
                            onClick={() => {
                                window.aero.plugins.previewMessage.self.sendPreview();
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="24" height="24">
                                <ellipse fill="currentColor" cx="8.828" cy="18" rx="7.953" ry="13.281" />
                                <path
                                    fill="currentColor"
                                    d="M8.828 32.031C3.948 32.031.125 25.868.125 18S3.948 3.969 8.828 3.969 17.531 10.132 17.531 18s-3.823 14.031-8.703 14.031zm0-26.562C4.856 5.469 1.625 11.09 1.625 18s3.231 12.531 7.203 12.531S16.031 24.91 16.031 18 12.8 5.469 8.828 5.469z"
                                />
                                <circle fill="var(--bg-overlay-3,var(--channeltextarea-background))" cx="6.594" cy="18" r="4.96" />
                                <circle fill="var(--bg-overlay-3,var(--channeltextarea-background))" cx="6.594" cy="18" r="3.565" />
                                <circle fill="currentColor" cx="7.911" cy="15.443" r="1.426" />
                                <ellipse fill="currentColor" cx="27.234" cy="18" rx="7.953" ry="13.281" />
                                <path
                                    fill="currentColor"
                                    d="M27.234 32.031c-4.88 0-8.703-6.163-8.703-14.031s3.823-14.031 8.703-14.031S35.938 10.132 35.938 18s-3.824 14.031-8.704 14.031zm0-26.562c-3.972 0-7.203 5.622-7.203 12.531 0 6.91 3.231 12.531 7.203 12.531S34.438 24.91 34.438 18 31.206 5.469 27.234 5.469z"
                                />
                                <circle fill="var(--bg-overlay-3,var(--channeltextarea-background))" cx="25" cy="18" r="4.96" />
                                <circle fill="var(--bg-overlay-3,var(--channeltextarea-background))" cx="25" cy="18" r="3.565" />
                                <circle fill="currentColor" cx="26.317" cy="15.443" r="1.426" />
                            </svg>
                        </button>
                    )}
                </common.components.Tooltip>
            );
        },
    },
    patches: [
        {
            find: "consolidateGifsStickersEmojis||null",
            replacement: {
                match: /className:(\w+)\(\)\.buttons,children:(\w+)}/,
                replace: (_, className, children) => {
                    return `className:${className}().buttons,children:[$self.renderPreviewButton(),${children}]}`;
                },
            },
        },
    ],
});
