// define('a', function () {
//     console.log('a');
//     return {
//         add: function (a, b) {
//             return a + b;
//         }
//     }
// });

// define('a', ['b'], function (b) {
//     console.log('a');
//     console.log(b.equil(1, 2));
//     return {
//         add: function (a, b) {
//             return a + b;
//         }
//     }
// });

define('a', ['c'], function (c) {
    console.log('a');
    console.log(c.sqrt(4));
    return {
        add: function (a, b) {
            return a + b;
        }
    }
});