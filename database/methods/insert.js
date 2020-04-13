const ex = require('./exercises');

ex.insertExercise(
    "<h1>Fibonacci numbers</h1> \
    <p>Your goal is to implement an algorithm to compute the nth first numbers of Fibonacci as F(n) = F(n-1) + F(n-2)</p>",
    {
        c: "int fib(int n)",
        cpp: "int fib(int n)",
        python: "def fib(n)",
        java: "int fib(int n)",
        swift: "func fib(_ n: Int) -> Int",
        "objective-c": "int fib(int n)"
    },
    "fib",
    ["n"],
    {
        [7]: 13,
        [15]: 610,
        [28]: 317811,
        [33]: 3524578
    }
)
