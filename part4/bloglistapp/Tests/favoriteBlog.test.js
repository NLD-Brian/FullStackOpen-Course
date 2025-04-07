const { test, describe } = require('node:test')
const assert = require('node:assert')
const favoriteBlog = require('../Utils/list_helper').favoriteBlog

test('favoriteBlog returns the blog with most likes', () => {
    assert.deepStrictEqual(favoriteBlog([]), null)
})