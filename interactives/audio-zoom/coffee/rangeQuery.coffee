### This is an implementation of range query specially as in the definition
    of Range Max Query but any comparison function may be used
###
"use strict"
max = (a, b) ->
    if isNaN(b)
        a
    else if a > b
        a
    else
        b

segmentTree = (arr, queryFunc=max) ->
    ### This creates a segmentTree from an array ###
    ArrType = arr.constructor
    # Tree size must bethe size of the nearest (rounded up) power of
    # 2 of the original array + the original array.length
    upperPowerOfTwo = 2**Math.ceil(Math.log2(arr.length))
    treeSize = upperPowerOfTwo + arr.length
    tree = new ArrType(treeSize)
    if ArrType is Array
        tree[upperPowerOfTwo...treeSize] = arr
    else
        tree.set(arr, upperPowerOfTwo)
    for i in [upperPowerOfTwo - 1...0]
        tree[i] = queryFunc(tree[i*2], tree[i*2 + 1])
    tree.dataLength = arr.length
    return tree

span = (node, arrLen) ->
    ### Returns what range is spanned by a given node e.g.
        span(1) is the entire segment tree so [0, treeSize]
    ###
    upperPowerOfTwo = 2**Math.ceil(Math.log2(arrLen))
    lowerPowerOfTwo = 2**(Math.log2(node) // 1)
    diff = node - lowerPowerOfTwo
    # Size of the range spanned
    change = upperPowerOfTwo / lowerPowerOfTwo
    return [
        change * diff
        change * (diff + 1)
    ]

rangeQuery = ({tree, dataLength}, queryFunc=greaterThan) ->
    ### This creates a function that allows you to query the max value inside
        a range of a given array (or any query given a queryFunction
    ###
    return query = (lower=0, upper=dataLength) ->
        ### This function queries the segment tree recursively
            it tries to select a minimum number of points that describe
            the range entered
        ###
        _query = (node) ->
            if lower >= upper
                throw new Error("Queried range smaller than size 1")
            else if lower < 0
                throw new Error("Lower bound is below zero")
            else if upper > dataLength
                throw new Error("Upper bound is beyond array")
            [spanLower, spanUpper] = span(node, dataLength)
            middle = (spanLower + spanUpper) // 2
            # If our search span fully contains
            # the query on the node then the max is definitely within
            # that node
            if lower <= spanLower and upper >= spanUpper
                return tree[node]
            # If the range spanned by a node is simply one then the max is
            # simply the node itself
            else if spanUpper - spanLower is 1
                return tree[node]
            # If the range is entirely on the left subtree then just
            # query the left subtree
            else if upper <= middle
                return _query(node*2)
            # If the range is entirely on the right subtree then just
            # query the right subtree
            else if lower >= middle
                return _query(node*2+1)
            # Otherwise pick the max of querying both the left and right
            # subtrees
            else
                leftBest = _query(node*2)
                rightBest = _query(node*2+1)
                return queryFunc(leftBest, rightBest)
        return _query(1)

module.exports = {
    rangeQuery
    segmentTree
}