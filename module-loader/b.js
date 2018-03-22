// define('b', function () {
//     console.log('b');
//     return {
//         equal: function (a, b) {
//             return a === b;
//         }
//     }
// });

// define('b', ['c'], function (c) {
//     console.log('b');
//     console.log(c.sqrt(4));
//     return {
//         equil: function (a, b) {
//             return a === b;
//         }
//     }
// });

define('b', ['c'], function (c) {
    console.log('b');
    console.log(c.sqrt(9));
    return {
        equil: function (a, b) {
            return a === b;
        }
    }
});