#!/usr/bin/env node
const suan = require('../dist')
const descryption = `usage:
normal mode:
    suan24 <numbers...>
target mode with --target(or -t) option. You can specify other numbers instead of 24 as target.
    suan24 --target <target number> <numbers...>
    suan24 -t <target number> <numbers...>
option --parentheses(or -p) will keep all parentheses of output required or not.
Example:
    suan24 8 8 3 3
    suan24 4 6
    suan24 --target 25 5 1 5 1
you can try more numbers, for example 5 numbers:
    suan24 4 6 7 9 89
about:
    A simple program to resolve suan 24 (calculate 24) game
    this program is presented by Simon1987.com`

if (process.argv.length <= 2) {
    console.log(descryption)
} else {
    let isGettingTarget = false
    let isKeepParentheses = false
    let nums = []
    let targetNum = 24
    for (let i = 2; i < process.argv.length; i ++) {
        const thisArg = process.argv[i]
        if (thisArg === '--help' || thisArg === '-h') {
            console.log(descryption)
            process.exit()
        } else if (thisArg === '--target' || thisArg === '-t') {
            isGettingTarget = true
        }  else if (thisArg === '--parentheses' || thisArg === '-p') {
            isKeepParentheses = true
        } else {
            let thisNum = parseInt(thisArg)
            if (!isNaN(thisNum)) {
                if (isGettingTarget) {
                    isGettingTarget = false
                    targetNum = thisNum
                } else {
                    nums.push(thisNum)
                }
            }
        }
    }
    //
    console.log(`you are suan${targetNum} by ${nums}`)
    let pp = suan.suan(targetNum, ...nums)
    while(true) {
        let next = pp.next()
        if(next.done) {
            console.log('all done')
            break
        } else {
            let str = suan.expressionToString(next.value, isKeepParentheses)
            console.log(str)
        }
    }
}


  