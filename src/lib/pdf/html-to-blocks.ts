import { parse, HTMLElement, TextNode, Node } from "node-html-parser";
import { sanitizeHtml } from "@/lib/sanitize";

export type Inline =
    | { text: string; bold?: boolean; italic?: boolean; underline?: boolean; href?: string }
    | { br: true };

export type Block =
    | { type: "p" | "h1" | "h2" | "h3" | "h4" | "quote"; inlines: Inline[] }
    | { type: "li"; marker: string; inlines: Inline[] }
    | { type: "hr" }
    | { type: "img"; src: string };

type Style = { bold?: boolean; italic?: boolean; underline?: boolean; href?: string };
type TextType = "p" | "h1" | "h2" | "h3" | "h4" | "quote";

function walkInline(node: Node, style: Style, out: Inline[], hoisted: Block[]) {
    if (node instanceof TextNode) {
        const text = node.text.replace(/\s+/g, " ");
        if (text) out.push({ text, ...style });
        return;
    }

    if (!(node instanceof HTMLElement)) return;
    const tag = node.tagName?.toLowerCase();
    if (tag === "br") {
        out.push({ br: true });
        return;
    }
    if (tag === "img") {
        const src = node.getAttribute("src");
        if (src) hoisted.push({ type: "img", src });
        return;
    }
    const next: Style = { ...style };
    if (tag === "strong" || tag === "b") next.bold = true;
    if (tag === "em" || tag === "i") next.italic = true;
    if (tag === "u") next.underline = true;
    if (tag === "a") next.href = node.getAttribute("href") ?? undefined;
    node.childNodes.forEach((c) => walkInline(c, next, out, hoisted));
}

function tidy(inlines: Inline[]): Inline[] {
    const r = [...inlines];
    const first = r[0];
    if (first && "text" in first) r[0] = { ...first, text: first.text.replace(/^\s+/, "") };
    const last = r[r.length - 1];
    if (last && "text" in last) r[r.length - 1] = { ...last, text: last.text.replace(/\s+$/, "") };
    return r.filter((i) => !("text" in i) || i.text.length > 0);
}

const hasContent = (inlines: Inline[]) =>
    inlines.some((i) => "br" in i || i.text.trim().length > 0);

function pushText(type: TextType, node: HTMLElement, blocks: Block[]) {
    const out: Inline[] = [];
    const hoisted: Block[] = [];
    node.childNodes.forEach((c) => walkInline(c, {}, out, hoisted));
    const inlines = tidy(out);
    if (hasContent(inlines)) blocks.push({ type, inlines });
    blocks.push(...hoisted);
}

function walkBlocks(nodes: Node[], blocks: Block[], inQuote = false) {
    for (const node of nodes) {
        if (node instanceof TextNode) {
        const t = node.text.trim();
        if (t) blocks.push({ type: inQuote ? "quote" : "p", inlines: [{ text: t }] });
        continue;
        }
        if (!(node instanceof HTMLElement)) continue;
        const tag = node.tagName?.toLowerCase();

        switch (tag) {
        case "h1":
        case "h2":
        case "h3":
        case "h4":
            pushText(tag, node, blocks);
            break;
        case "blockquote":
            walkBlocks(node.childNodes, blocks, true);
            break;
        case "ul":
        case "ol": {
            let n = 1;
            node.childNodes.forEach((li) => {
            if (!(li instanceof HTMLElement) || li.tagName?.toLowerCase() !== "li") return;
            const out: Inline[] = [];
            const hoisted: Block[] = [];
            li.childNodes.forEach((c) => walkInline(c, {}, out, hoisted));
            const inlines = tidy(out);
            if (hasContent(inlines)) {
                blocks.push({ type: "li", marker: tag === "ol" ? `${n++}.` : "•", inlines });
            }
            blocks.push(...hoisted);
            });
            break;
        }
        case "hr":
            blocks.push({ type: "hr" });
            break;
        case "img": {
            const src = node.getAttribute("src");
            if (src) blocks.push({ type: "img", src });
            break;
        }
        default:
            pushText(inQuote ? "quote" : "p", node, blocks);
        }
    }
}

export function htmlToBlocks(html: string): Block[] {
    const blocks: Block[] = [];
    const root = parse(sanitizeHtml(html));
    walkBlocks(root.childNodes, blocks);
    return blocks;
}