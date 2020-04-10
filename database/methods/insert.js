const ex = require('./exercises');

ex.insertExercise(
    "<h1>Fibonacci numbers</h1> \
    <p>Your goal is to implement an algorithm to compute the nth first numbers of Fibonacci as F(n) = F(n-1) + F(n-2)</p>",
    {
        c: "int fib(int n)",
        cpp: "int fib(int n)",
        python: "def fib(n)",
        java: "int fib(int n)",
        swift: "func fib(n: Int)",
        "objective-c": "int fib(int n)"
    },
    "4",
    "5",
    [
        "0", "1", "7", "15", "28"
    ]
)