/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { ListAstNode } from './ast.js';
/**
 * Concatenates a list of (2,3) AstNode's into a single (2,3) AstNode.
 * This mutates the items of the input array!
 * If all items have the same height, this method has runtime O(items.length).
 * Otherwise, it has runtime O(items.length * max(log(items.length), items.max(i => i.height))).
*/
export function concat23Trees(items) {
    if (items.length === 0) {
        return null;
    }
    if (items.length === 1) {
        return items[0];
    }
    if (allItemsHaveSameHeight(items)) {
        return concatFast(items);
    }
    return concatSlow(items);
}
/**
 * @param items must be non empty.
*/
function allItemsHaveSameHeight(items) {
    const firstHeight = items[0].listHeight;
    for (const item of items) {
        if (item.listHeight !== firstHeight) {
            return false;
        }
    }
    return true;
}
function concatFast(items) {
    let length = items.length;
    // All trees have same height, just create parent nodes.
    while (length > 1) {
        const newLength = length >> 1;
        // Ideally, due to the slice, not a lot of memory is wasted.
        const newItems = new Array(newLength);
        for (let i = 0; i < newLength; i++) {
            const j = i << 1;
            newItems[i] = ListAstNode.create(items.slice(j, (j + 3 === length) ? length : j + 2));
        }
        length = newLength;
        items = newItems;
    }
    return items[0];
}
function heightDiff(node1, node2) {
    return Math.abs(node1.listHeight - node2.listHeight);
}
function concatSlow(items) {
    // The items might not have the same height.
    // We merge all items by using a binary concat operator.
    let first = items[0];
    let second = items[1];
    for (let i = 2; i < items.length; i++) {
        const item = items[i];
        // Prefer concatenating smaller trees, as the runtime of concat depends on the tree height.
        if (heightDiff(first, second) <= heightDiff(second, item)) {
            first = concat(first, second);
            second = item;
        }
        else {
            second = concat(second, item);
        }
    }
    const result = concat(first, second);
    return result;
}
function concat(node1, node2) {
    if (node1.listHeight === node2.listHeight) {
        return ListAstNode.create([node1, node2]);
    }
    else if (node1.listHeight > node2.listHeight) {
        // node1 is the tree we want to insert into
        return node1.append(node2);
    }
    else {
        return node2.prepend(node1);
    }
}
