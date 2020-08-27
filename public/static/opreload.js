document.write = function () {
    console.log(arguments);
    for (const a of arguments)
        console.log(a);
}
console.log('work');
var b = {};