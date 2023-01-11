// https://github.com/ueberdosis/tiptap/blob/main/demos/src/Experiments/GlobalDragHandle/Vue/DragHandle.js

import { NodeSelection, Plugin } from "prosemirror-state"
// @ts-ignore
import { __serializeForClipboard, EditorView } from "prosemirror-view"

export interface DragHandleOptions {
    /**
     * The width of the drag handle
     */
    dragHandleWidth: number
}

function absoluteRect(node: Element) {
    const data = node.getBoundingClientRect()

    return {
        top: data.top,
        left: data.left,
        width: data.width
    }
}

function nodeDOMAtCoords(coords: { x: number; y: number }) {
    return document
        .elementsFromPoint(coords.x, coords.y)
        .find(
            (elem: HTMLElement) =>
                elem.parentElement?.matches?.(".ProseMirror") ||
                elem.matches(
                    [
                        "li",
                        "p:not(:first-child)",
                        "pre",
                        "blockquote",
                        "h1, h2, h3",
                        "[data-type=callout]",
                        "[data-type=horizontalRule]",
                        ".tableWrapper",
                        ".node-subdocument",
                        ".node-equationBlock"
                    ].join(", ")
                )
        )
}

export function nodePosAtDOM(node: Element, view: EditorView) {
    const boundingRect = node.getBoundingClientRect()

    return view.posAtCoords({
        left: boundingRect.left + 1,
        top: boundingRect.top + 1
    }).inside
}

export default function DragHandle(options: DragHandleOptions) {
    function handleDragStart(event: DragEvent, view: EditorView) {
        view.focus()

        if (!event.dataTransfer) return

        const node = nodeDOMAtCoords({
            x: event.clientX + 50 + options.dragHandleWidth,
            y: event.clientY
        })

        if (!(node instanceof Element)) return

        const nodePos = nodePosAtDOM(node, view)
        view.dispatch(
            view.state.tr.setSelection(
                NodeSelection.create(view.state.doc, nodePos)
            )
        )

        const slice = view.state.selection.content()
        const { dom, text } = __serializeForClipboard(view, slice)

        event.dataTransfer.clearData()
        event.dataTransfer.setData("text/html", dom.innerHTML)
        event.dataTransfer.setData("text/plain", text)
        event.dataTransfer.effectAllowed = "copyMove"

        event.dataTransfer.setDragImage(node, 0, 0)

        view.dragging = { slice, move: event.ctrlKey }
    }

    function handleClick(event: MouseEvent, view: EditorView) {
        view.focus()

        view.dom.classList.remove("dragging")

        const node = nodeDOMAtCoords({
            x: event.clientX + 50 + options.dragHandleWidth,
            y: event.clientY
        })

        if (!(node instanceof Element)) return

        const nodePos = nodePosAtDOM(node, view)
        view.dispatch(
            view.state.tr.setSelection(
                NodeSelection.create(view.state.doc, nodePos)
            )
        )
    }

    let dragHandleElement: HTMLElement = null

    function hideDragHandle() {
        if (dragHandleElement) {
            dragHandleElement.classList.add("hidden")
        }
    }

    function showDragHandle() {
        if (dragHandleElement) {
            dragHandleElement.classList.remove("hidden")
        }
    }

    return new Plugin({
        view: (view) => {
            dragHandleElement = document.createElement("div")
            dragHandleElement.draggable = true
            dragHandleElement.dataset.dragHandle = ""
            dragHandleElement.classList.add("drag-handle")
            dragHandleElement.addEventListener("dragstart", (e) => {
                handleDragStart(e, view)
            })
            dragHandleElement.addEventListener("click", (e) => {
                handleClick(e, view)
            })

            hideDragHandle()

            view.dom.parentElement.appendChild(dragHandleElement)

            return {
                destroy: () => {
                    dragHandleElement?.remove?.()
                    dragHandleElement = null
                }
            }
        },
        props: {
            handleDOMEvents: {
                mousemove: (view, event) => {
                    if (!view.editable) {
                        return
                    }

                    const node = nodeDOMAtCoords({
                        x: event.clientX + 50 + options.dragHandleWidth,
                        y: event.clientY
                    })

                    if (!(node instanceof Element)) {
                        hideDragHandle()
                        return
                    }

                    const compStyle = window.getComputedStyle(node)
                    const lineHeight = parseInt(compStyle.lineHeight, 10)
                    const paddingTop = parseInt(compStyle.paddingTop, 10)

                    const rect = absoluteRect(node)

                    rect.top += (lineHeight - 24) / 2
                    rect.top += paddingTop
                    // Li markers
                    if (
                        node.matches("ul:not([data-type=taskList]) li, ol li")
                    ) {
                        rect.left -= options.dragHandleWidth
                    }
                    rect.width = options.dragHandleWidth

                    dragHandleElement.style.left = `${rect.left - rect.width}px`
                    dragHandleElement.style.top = `${rect.top}px`
                    showDragHandle()
                },
                keydown: () => {
                    hideDragHandle()
                },
                mousewheel: () => {
                    hideDragHandle()
                },
                // dragging class is used for CSS
                dragstart: (view) => {
                    view.dom.classList.add("dragging")
                },
                drop: (view) => {
                    view.dom.classList.remove("dragging")
                },
                dragend: (view) => {
                    view.dom.classList.remove("dragging")
                }
            }
        }
    })
}
