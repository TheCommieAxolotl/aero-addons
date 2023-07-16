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

import { Icons, ErrorBoundary } from "aero/ui";
import { definePlugin } from "aero/plugin";
import { injectStyles, removeStyles } from "aero/dom";
import { common } from "aero/webpack";

injectStyles(
    "codeblocks",
    `
#a-c-codeblock {
    background-color: var(--background-secondary);
    border: 1px solid var(--background-tertiary);
    border-radius: 4px;
    padding: 8px;
    font-family: var(--font-mono);
    position: relative;

    code {
        background-color: transparent;
        border: none;
    }

    .buttons {
        display: flex;
        justify-content: flex-end;
        position: absolute;
        top: 8px;
        right: 8px;
        gap: 4px;
        background-color: var(--background-secondary);
        padding: 0 0 4px 4px;
        border-bottom-left-radius: 4px;

        .lang {
            text-transform: capitalize;
            font-size: 12px;
            line-height: 20px;
            font-weight: 500;
            color: var(--interactive-normal);
            padding-right: 4px;
        }

        button {
            background-color: transparent;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            padding: 0;
            color: var(--interactive-normal);

            &:hover {
                color: var(--interactive-active);
            }
        }
    }
}
`
);

const enc = (str: string) => {
    return Array.from(str)
        .map((char) => char.charCodeAt(0).toString(16))
        .join("");
};

const Codeblock = (props: { lang?: string; content: string; isPreview: boolean; tempSettings?: Record<string, any> }) => {
    const encode = enc(props.content);

    const [previewed, setPreviewed] = common.React.useState(Boolean(document.getElementById(`codeblocks-${encode}`)));
    const [copied, setCopied] = common.React.useState(false);

    return (
        <ErrorBoundary>
            <pre id="a-c-codeblock" data-lang={props.lang || "plaintext"}>
                <div className="buttons">
                    <div className="lang">{props.lang || "plaintext"}</div>
                    {(props.lang === "css" || props.lang === "scss") && (
                        <common.components.Tooltip text={previewed ? "Stop Previewing" : "Preview"}>
                            {(p) => (
                                <button
                                    {...p}
                                    className="preview"
                                    onClick={() => {
                                        if (previewed) {
                                            removeStyles(`codeblocks-${encode}`);
                                        } else {
                                            injectStyles(`codeblocks-${encode}`, props.content);
                                        }

                                        setPreviewed(!previewed);
                                    }}
                                >
                                    {previewed ? <Icons.Cross fill="var(--text-danger)" /> : <Icons.Eye />}
                                </button>
                            )}
                        </common.components.Tooltip>
                    )}
                    <common.components.Tooltip text={copied ? "Copied!" : "Copy"}>
                        {(p) => (
                            <button
                                {...p}
                                className="copy"
                                onClick={() => {
                                    window.DiscordNative?.clipboard.copy(props.content);

                                    setCopied(true);

                                    setTimeout(() => {
                                        setCopied(false);
                                    }, 3000);
                                }}
                            >
                                {copied ? <Icons.Check fill="var(--text-positive)" /> : <Icons.Copy />}
                            </button>
                        )}
                    </common.components.Tooltip>
                </div>
                <code dangerouslySetInnerHTML={{ __html: common.hljs.highlight(common.hljs.getLanguage(props.lang) ? props.lang : "plaintext", props.content).value }}></code>
            </pre>
        </ErrorBoundary>
    );
};

export default definePlugin({
    color: "#df9aaa",
    id: "betterCodeblocks",
    name: "Better Codeblocks",
    description: "Enhances Discord's codeblocks with language indicators, copy buttons, and more.",
    author: {
        name: "TheCommieAxolotl",
        id: "538487970408300544",
    },
    self: {
        render: (props: { lang?: string; content: string; isPreview: boolean; tempSettings?: Record<string, any> }) => {
            return <Codeblock {...props} />;
        },
    },
    patches: [
        {
            find: "codeBlock:{react:",
            replacement: {
                match: /codeBlock:\{react:function\((.{1,2}),(.{1,2}),(.{1,2})\)\{/,
                replace: "$&return $self.render($1,$2,$3);",
            },
        },
    ],
});
