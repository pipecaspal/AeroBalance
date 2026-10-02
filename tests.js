// ==========================================================
// AeroBalance Automated Validation Suite
// ==========================================================


const engine =

    window.AeroBalance;


// ==========================================================
// TEST UTILITIES
// ==========================================================

const testResults = [];


function assert(condition, message) {

    if (!condition) {

        throw new Error(message);

    }

}


function assertClose(
    actual,
    expected,
    tolerance,
    name
) {

    const difference =

        Math.abs(
            actual - expected
        );


    if (
        difference >
        tolerance
    ) {

        throw new Error(

            `${name}: expected ${expected}, got ${actual}`

        );

    }

}


function assertProblem(
    result,
    expectedProblem
) {

    assert(

        result.problems.includes(
            expectedProblem
        ),

        `Expected warning: ${expectedProblem}`

    );

}


function runTest(
    name,
    testFunction
) {

    try {

        testFunction();


        testResults.push({

            name: name,

            passed: true,

            details: "PASS"

        });

    }

    catch (error) {

        testResults.push({

            name: name,

            passed: false,

            details:
                error.message

        });

    }

}


// ==========================================================
// TEST 1
//
// OFFICIAL PIPER POH SAMPLE
// ==========================================================

runTest(

    "Piper POH Sample Loading",

    function () {

        const result =

            engine.calculateScenario({

                emptyWeight: 1500,

                emptyCG: 85.9,

                pilot: 170,

                frontPassenger: 170,

                rearPassengers: 340,

                fuelGallons: 44.5,

                tripFuelGallons: 0,

                baggage: 0

            });


        assertClose(
            result.ramp.weight,
            2447,
            0.01,
            "Ramp weight"
        );


        assertClose(
            result.ramp.moment,
            221739,
            0.01,
            "Ramp moment"
        );


        assertClose(
            result.ramp.cg,
            90.6167,
            0.01,
            "Ramp CG"
        );


        assertClose(
            result.takeoff.weight,
            2440,
            0.01,
            "Takeoff weight"
        );


        assertClose(
            result.takeoff.moment,
            221074,
            0.01,
            "Takeoff moment"
        );


        assertClose(
            result.takeoff.cg,
            90.6041,
            0.01,
            "Takeoff CG"
        );


        assert(
            result.problems.length === 0,

            "POH sample should be within limits"
        );

    }

);


// ==========================================================
// TEST 2
//
// NORMAL TRAINING FLIGHT
// ==========================================================

runTest(

    "Normal Training Flight",

    function () {

        const result =

            engine.calculateScenario({

                emptyWeight: 1500,

                emptyCG: 85.9,

                pilot: 170,

                frontPassenger: 170,

                rearPassengers: 0,

                fuelGallons: 30,

                tripFuelGallons: 15,

                baggage: 20

            });


        assert(

            result.status ===
            "WITHIN LIMITS",

            "Expected loading to be within limits"
        );


        assertClose(
            result.ramp.weight,
            2040,
            0.01,
            "Ramp weight"
        );


        assertClose(
            result.takeoff.weight,
            2033,
            0.01,
            "Takeoff weight"
        );


        assertClose(
            result.landing.weight,
            1943,
            0.01,
            "Landing weight"
        );

    }

);


// ==========================================================
// TEST 3
//
// OVERWEIGHT CONDITION
// ==========================================================

runTest(

    "Overweight Detection",

    function () {

        const result =

            engine.calculateScenario({

                emptyWeight: 1500,

                emptyCG: 85.9,

                pilot: 170,

                frontPassenger: 170,

                rearPassengers: 340,

                fuelGallons: 44.5,

                tripFuelGallons: 0,

                baggage: 50

            });


        assertProblem(
            result,
            "OVER MAX RAMP WEIGHT"
        );


        assertProblem(
            result,
            "OVER MAX TAKEOFF WEIGHT"
        );

    }

);


// ==========================================================
// TEST 4
//
// FORWARD CG CONDITION
// ==========================================================

runTest(

    "Forward CG Detection",

    function () {

        const result =

            engine.calculateScenario({

                emptyWeight: 1500,

                emptyCG: 85.9,

                pilot: 400,

                frontPassenger: 400,

                rearPassengers: 0,

                fuelGallons: 0,

                tripFuelGallons: 0,

                baggage: 0

            });


        assertProblem(
            result,
            "TAKEOFF CG FORWARD OF LIMIT"
        );

    }

);


// ==========================================================
// TEST 5
//
// AFT CG CONDITION
// ==========================================================

runTest(

    "Aft CG Detection",

    function () {

        const result =

            engine.calculateScenario({

                emptyWeight: 1500,

                emptyCG: 85.9,

                pilot: 0,

                frontPassenger: 0,

                rearPassengers: 400,

                fuelGallons: 0,

                tripFuelGallons: 0,

                baggage: 100

            });


        assertProblem(
            result,
            "TAKEOFF CG AFT OF LIMIT"
        );

    }

);


// ==========================================================
// TEST 6
//
// FUEL CAPACITY
// ==========================================================

runTest(

    "Fuel Capacity Detection",

    function () {

        const result =

            engine.calculateScenario({

                emptyWeight: 1500,

                emptyCG: 85.9,

                pilot: 170,

                frontPassenger: 0,

                rearPassengers: 0,

                fuelGallons: 49,

                tripFuelGallons: 0,

                baggage: 0

            });


        assertProblem(
            result,
            "FUEL CAPACITY EXCEEDED"
        );

    }

);


// ==========================================================
// TEST 7
//
// BAGGAGE LIMIT
// ==========================================================

runTest(

    "Baggage Limit Detection",

    function () {

        const result =

            engine.calculateScenario({

                emptyWeight: 1500,

                emptyCG: 85.9,

                pilot: 170,

                frontPassenger: 0,

                rearPassengers: 0,

                fuelGallons: 0,

                tripFuelGallons: 0,

                baggage: 201

            });


        assertProblem(
            result,
            "BAGGAGE LIMIT EXCEEDED"
        );

    }

);


// ==========================================================
// TEST 8
//
// TRIP FUEL GREATER THAN AVAILABLE FUEL
// ==========================================================

runTest(

    "Trip Fuel Availability",

    function () {

        const result =

            engine.calculateScenario({

                emptyWeight: 1500,

                emptyCG: 85.9,

                pilot: 170,

                frontPassenger: 170,

                rearPassengers: 0,

                fuelGallons: 10,

                tripFuelGallons: 15,

                baggage: 0

            });


        assertProblem(
            result,
            "TRIP FUEL EXCEEDS AVAILABLE FUEL"
        );

    }

);


// ==========================================================
// TEST 9
//
// FORWARD CG INTERPOLATION
// ==========================================================

runTest(

    "Forward CG Boundary Interpolation",

    function () {

        assertClose(

            engine.getForwardCGLimit(
                1950
            ),

            83.0,

            0.0001,

            "1950 lb forward limit"

        );


        assertClose(

            engine.getForwardCGLimit(
                2440
            ),

            88.3,

            0.0001,

            "2440 lb forward limit"

        );


        assertClose(

            engine.getForwardCGLimit(
                2195
            ),

            85.65,

            0.0001,

            "Midpoint forward limit"

        );

    }

);


// ==========================================================
// DISPLAY TEST RESULTS
// ==========================================================

const resultTable =

    document.getElementById(
        "testResults"
    );


testResults.forEach(

    result => {

        const row =

            document.createElement(
                "tr"
            );


        const nameCell =

            document.createElement(
                "td"
            );


        const statusCell =

            document.createElement(
                "td"
            );


        const detailsCell =

            document.createElement(
                "td"
            );


        nameCell.textContent =
            result.name;


        statusCell.textContent =

            result.passed
                ? "PASS"
                : "FAIL";


        statusCell.className =

            result.passed
                ? "pass"
                : "fail";


        detailsCell.textContent =
            result.details;


        row.appendChild(
            nameCell
        );


        row.appendChild(
            statusCell
        );


        row.appendChild(
            detailsCell
        );


        resultTable.appendChild(
            row
        );

    }

);


// ==========================================================
// SUMMARY
// ==========================================================

const passedTests =

    testResults.filter(
        test => test.passed
    ).length;


const totalTests =

    testResults.length;


const summary =

    document.getElementById(
        "testSummary"
    );


summary.textContent =

    `${passedTests} / ${totalTests} TESTS PASSED`;


summary.className =

    "summary-result " +

    (
        passedTests === totalTests

            ? "all-pass"

            : "has-failure"
    );