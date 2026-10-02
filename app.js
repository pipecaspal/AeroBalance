// ==========================================================
// AeroBalance
// Piper PA-28-161 Warrior II
//
// Educational demonstration only.
// Not approved for operational flight planning.
// ==========================================================


// ==========================================================
// AIRCRAFT CONSTANTS
// ==========================================================

const FRONT_ARM = 80.5;
const REAR_ARM = 118.1;
const FUEL_ARM = 95.0;
const BAGGAGE_ARM = 142.8;

const FUEL_DENSITY = 6.0;
const MAX_FUEL_GALLONS = 48;

const MAX_RAMP_WEIGHT = 2447;
const MAX_TAKEOFF_WEIGHT = 2440;
const MAX_LANDING_WEIGHT = 2440;

const MAX_BAGGAGE_WEIGHT = 200;

const AFT_CG_LIMIT = 93.0;

const TAXI_FUEL_WEIGHT = 7;

const GRAPH_MIN_WEIGHT = 1400;
const GRAPH_MAX_WEIGHT = 2500;

const GRAPH_MIN_CG = 82;
const GRAPH_MAX_CG = 94;


// ==========================================================
// ENGINEERING FUNCTIONS
// ==========================================================

function calculateMoment(weight, arm) {

    return weight * arm;

}


function calculateCG(moment, weight) {

    if (weight <= 0) {
        return 0;
    }

    return moment / weight;

}


// ----------------------------------------------------------
// Normal Category Forward CG Limit
//
// <= 1950 lb = 83.0 in
//
// 2440 lb = 88.3 in
//
// Straight-line variation between points.
// ----------------------------------------------------------

function getForwardCGLimit(weight) {

    if (weight <= 1950) {

        return 83.0;

    }


    if (weight >= 2440) {

        return 88.3;

    }


    return (
        83.0 +

        ((weight - 1950) /
        (2440 - 1950)) *

        (88.3 - 83.0)
    );

}


// ==========================================================
// PURE CALCULATION ENGINE
// ==========================================================
//
// This function does NOT interact with the webpage.
//
// That means:
// - the website can use it
// - automated tests can use it
// - future apps can use it
//
// ==========================================================

function calculateScenario(input) {

    const emptyWeight =
        Number(input.emptyWeight);

    const emptyCG =
        Number(input.emptyCG);

    const pilot =
        Number(input.pilot);

    const frontPassenger =
        Number(input.frontPassenger);

    const rearPassengers =
        Number(input.rearPassengers);

    const fuelGallons =
        Number(input.fuelGallons);

    const tripFuelGallons =
        Number(input.tripFuelGallons);

    const baggage =
        Number(input.baggage);


    // ------------------------------------------------------
    // INPUT VALIDATION
    // ------------------------------------------------------

    const inputs = [

        emptyWeight,
        emptyCG,
        pilot,
        frontPassenger,
        rearPassengers,
        fuelGallons,
        tripFuelGallons,
        baggage

    ];


    if (
        inputs.some(
            value => !Number.isFinite(value)
        )
    ) {

        return {

            valid: false,

            problems: [
                "INVALID INPUT"
            ]

        };

    }


    if (
        inputs.some(
            value => value < 0
        )
    ) {

        return {

            valid: false,

            problems: [
                "NEGATIVE VALUES ARE NOT ALLOWED"
            ]

        };

    }


    if (
        emptyWeight <= 0 ||
        emptyCG <= 0
    ) {

        return {

            valid: false,

            problems: [
                "INVALID BASIC EMPTY WEIGHT OR CG"
            ]

        };

    }


    // ======================================================
    // PAYLOAD AND FUEL
    // ======================================================

    const frontOccupantWeight =

        pilot +
        frontPassenger;


    const occupantWeight =

        pilot +
        frontPassenger +
        rearPassengers;


    const payload =

        occupantWeight +
        baggage;


    const fuelWeight =

        fuelGallons *
        FUEL_DENSITY;


    const requestedTripFuelWeight =

        tripFuelGallons *
        FUEL_DENSITY;


    // ======================================================
    // STATION MOMENTS
    // ======================================================

    const emptyMoment =

        calculateMoment(
            emptyWeight,
            emptyCG
        );


    const frontMoment =

        calculateMoment(
            frontOccupantWeight,
            FRONT_ARM
        );


    const rearMoment =

        calculateMoment(
            rearPassengers,
            REAR_ARM
        );


    const fuelMoment =

        calculateMoment(
            fuelWeight,
            FUEL_ARM
        );


    const baggageMoment =

        calculateMoment(
            baggage,
            BAGGAGE_ARM
        );


    // ======================================================
    // RAMP CONDITION
    // ======================================================

    const rampWeight =

        emptyWeight +
        payload +
        fuelWeight;


    const rampMoment =

        emptyMoment +
        frontMoment +
        rearMoment +
        fuelMoment +
        baggageMoment;


    const rampCG =

        calculateCG(
            rampMoment,
            rampWeight
        );


    // ======================================================
    // TAKEOFF CONDITION
    // ======================================================

    const taxiFuelUsed =

        Math.min(
            TAXI_FUEL_WEIGHT,
            fuelWeight
        );


    const taxiFuelMoment =

        calculateMoment(
            taxiFuelUsed,
            FUEL_ARM
        );


    const takeoffWeight =

        rampWeight -
        taxiFuelUsed;


    const takeoffMoment =

        rampMoment -
        taxiFuelMoment;


    const takeoffCG =

        calculateCG(
            takeoffMoment,
            takeoffWeight
        );


    const takeoffFuelWeight =

        fuelWeight -
        taxiFuelUsed;


    const takeoffFuelGallons =

        takeoffFuelWeight /
        FUEL_DENSITY;


    // ======================================================
    // LANDING CONDITION
    // ======================================================

    const tripFuelUsed =

        Math.min(
            requestedTripFuelWeight,
            takeoffFuelWeight
        );


    const tripFuelMoment =

        calculateMoment(
            tripFuelUsed,
            FUEL_ARM
        );


    const landingWeight =

        takeoffWeight -
        tripFuelUsed;


    const landingMoment =

        takeoffMoment -
        tripFuelMoment;


    const landingCG =

        calculateCG(
            landingMoment,
            landingWeight
        );


    const landingFuelWeight =

        takeoffFuelWeight -
        tripFuelUsed;


    const landingFuelGallons =

        landingFuelWeight /
        FUEL_DENSITY;


    // ======================================================
    // CG LIMITS
    // ======================================================

    const takeoffForwardLimit =

        getForwardCGLimit(
            takeoffWeight
        );


    const landingForwardLimit =

        getForwardCGLimit(
            landingWeight
        );


    // ======================================================
    // LOADING SUMMARY
    // ======================================================

    const maxTakeoffUsefulLoad =

        MAX_TAKEOFF_WEIGHT -
        emptyWeight;


    const usefulLoadUsed =

        takeoffWeight -
        emptyWeight;


    const takeoffWeightMargin =

        MAX_TAKEOFF_WEIGHT -
        takeoffWeight;


    const fullFuelWeight =

        MAX_FUEL_GALLONS *
        FUEL_DENSITY;


    const fullFuelPayloadCapacity =

        MAX_RAMP_WEIGHT -
        emptyWeight -
        fullFuelWeight;


    // ======================================================
    // LIMIT CHECKS
    // ======================================================

    const problems = [];


    if (
        fuelGallons >
        MAX_FUEL_GALLONS
    ) {

        problems.push(
            "FUEL CAPACITY EXCEEDED"
        );

    }


    if (
        baggage >
        MAX_BAGGAGE_WEIGHT
    ) {

        problems.push(
            "BAGGAGE LIMIT EXCEEDED"
        );

    }


    if (
        rampWeight >
        MAX_RAMP_WEIGHT
    ) {

        problems.push(
            "OVER MAX RAMP WEIGHT"
        );

    }


    if (
        takeoffWeight >
        MAX_TAKEOFF_WEIGHT
    ) {

        problems.push(
            "OVER MAX TAKEOFF WEIGHT"
        );

    }


    if (
        landingWeight >
        MAX_LANDING_WEIGHT
    ) {

        problems.push(
            "OVER MAX LANDING WEIGHT"
        );

    }


    if (
        takeoffCG <
        takeoffForwardLimit
    ) {

        problems.push(
            "TAKEOFF CG FORWARD OF LIMIT"
        );

    }


    if (
        takeoffCG >
        AFT_CG_LIMIT
    ) {

        problems.push(
            "TAKEOFF CG AFT OF LIMIT"
        );

    }


    if (
        landingCG <
        landingForwardLimit
    ) {

        problems.push(
            "LANDING CG FORWARD OF LIMIT"
        );

    }


    if (
        landingCG >
        AFT_CG_LIMIT
    ) {

        problems.push(
            "LANDING CG AFT OF LIMIT"
        );

    }


    if (
        requestedTripFuelWeight >
        takeoffFuelWeight
    ) {

        problems.push(
            "TRIP FUEL EXCEEDS AVAILABLE FUEL"
        );

    }


    // ======================================================
    // RETURN COMPLETE RESULT
    // ======================================================

    return {

        valid: true,

        ramp: {

            weight:
                rampWeight,

            moment:
                rampMoment,

            cg:
                rampCG

        },


        takeoff: {

            weight:
                takeoffWeight,

            moment:
                takeoffMoment,

            cg:
                takeoffCG,

            forwardLimit:
                takeoffForwardLimit,

            aftLimit:
                AFT_CG_LIMIT,

            fuelGallons:
                takeoffFuelGallons

        },


        landing: {

            weight:
                landingWeight,

            moment:
                landingMoment,

            cg:
                landingCG,

            forwardLimit:
                landingForwardLimit,

            aftLimit:
                AFT_CG_LIMIT,

            fuelGallons:
                landingFuelGallons

        },


        summary: {

            payload:
                payload,

            fuelWeight:
                fuelWeight,

            maxTakeoffUsefulLoad:
                maxTakeoffUsefulLoad,

            usefulLoadUsed:
                usefulLoadUsed,

            takeoffWeightMargin:
                takeoffWeightMargin,

            fullFuelPayloadCapacity:
                fullFuelPayloadCapacity

        },


        problems:
            problems,


        status:

            problems.length === 0
                ? "WITHIN LIMITS"
                : problems.join(" • ")

    };

}


// ==========================================================
// EXPORT ENGINE FOR TESTING
// ==========================================================

window.AeroBalance = {

    calculateScenario,

    calculateMoment,

    calculateCG,

    getForwardCGLimit,

    constants: {

        FRONT_ARM,
        REAR_ARM,
        FUEL_ARM,
        BAGGAGE_ARM,

        FUEL_DENSITY,
        MAX_FUEL_GALLONS,

        MAX_RAMP_WEIGHT,
        MAX_TAKEOFF_WEIGHT,
        MAX_LANDING_WEIGHT,

        MAX_BAGGAGE_WEIGHT,

        AFT_CG_LIMIT,

        TAXI_FUEL_WEIGHT

    }

};


// ==========================================================
// WEBPAGE HELPERS
// ==========================================================

function getInputValue(id) {

    return Number(
        document.getElementById(id).value
    );

}


function setText(id, value) {

    document
        .getElementById(id)
        .textContent = value;

}


function displayStatus(message, type) {

    const statusElement =

        document.getElementById(
            "statusResult"
        );


    statusElement.textContent =
        message;


    statusElement.className =
        "status " + type;

}


// ==========================================================
// WEBPAGE CALCULATION
// ==========================================================

function calculateWeightAndBalance() {

    const input = {

        emptyWeight:
            getInputValue("emptyWeight"),

        emptyCG:
            getInputValue("emptyCG"),

        pilot:
            getInputValue("pilot"),

        frontPassenger:
            getInputValue("frontPassenger"),

        rearPassengers:
            getInputValue("rearPassengers"),

        fuelGallons:
            getInputValue("fuelGallons"),

        tripFuelGallons:
            getInputValue("tripFuelGallons"),

        baggage:
            getInputValue("baggage")

    };


    const result =

        calculateScenario(input);


    if (!result.valid) {

        displayStatus(
            result.problems.join(" • "),
            "danger"
        );

        return;

    }


    // ======================================================
    // RAMP OUTPUT
    // ======================================================

    setText(
        "totalWeightResult",
        result.ramp.weight.toFixed(1) +
        " lb"
    );


    setText(
        "totalMomentResult",
        result.ramp.moment.toFixed(1) +
        " lb-in"
    );


    setText(
        "cgResult",
        result.ramp.cg.toFixed(2) +
        " in"
    );


    // ======================================================
    // TAKEOFF OUTPUT
    // ======================================================

    setText(
        "takeoffWeightResult",
        result.takeoff.weight.toFixed(1) +
        " lb"
    );


    setText(
        "takeoffCGResult",
        result.takeoff.cg.toFixed(2) +
        " in"
    );


    setText(
        "forwardLimitResult",
        result.takeoff.forwardLimit.toFixed(2) +
        " in"
    );


    setText(
        "aftLimitResult",
        result.takeoff.aftLimit.toFixed(2) +
        " in"
    );


    setText(
        "takeoffFuelResult",
        result.takeoff.fuelGallons.toFixed(2) +
        " gal"
    );


    // ======================================================
    // LANDING OUTPUT
    // ======================================================

    setText(
        "landingWeightResult",
        result.landing.weight.toFixed(1) +
        " lb"
    );


    setText(
        "landingCGResult",
        result.landing.cg.toFixed(2) +
        " in"
    );


    setText(
        "landingForwardLimitResult",
        result.landing.forwardLimit.toFixed(2) +
        " in"
    );


    setText(
        "landingAftLimitResult",
        result.landing.aftLimit.toFixed(2) +
        " in"
    );


    setText(
        "landingFuelResult",
        result.landing.fuelGallons.toFixed(2) +
        " gal"
    );


    // ======================================================
    // LOADING SUMMARY
    // ======================================================

    setText(
        "usefulLoadResult",
        result.summary.maxTakeoffUsefulLoad.toFixed(1) +
        " lb"
    );


    setText(
        "payloadResult",
        result.summary.payload.toFixed(1) +
        " lb"
    );


    setText(
        "fuelWeightResult",
        result.summary.fuelWeight.toFixed(1) +
        " lb"
    );


    setText(
        "weightMarginResult",
        result.summary.takeoffWeightMargin.toFixed(1) +
        " lb"
    );


    setText(
        "fullFuelPayloadResult",
        result.summary.fullFuelPayloadCapacity.toFixed(1) +
        " lb"
    );


    setText(
        "usefulLoadUsedResult",
        result.summary.usefulLoadUsed.toFixed(1) +
        " lb"
    );


    // ======================================================
    // TABLE
    // ======================================================

    setText(
        "tableRampWeight",
        result.ramp.weight.toFixed(1) +
        " lb"
    );


    setText(
        "tableRampCG",
        result.ramp.cg.toFixed(2) +
        " in"
    );


    setText(
        "tableTakeoffWeight",
        result.takeoff.weight.toFixed(1) +
        " lb"
    );


    setText(
        "tableTakeoffCG",
        result.takeoff.cg.toFixed(2) +
        " in"
    );


    setText(
        "tableLandingWeight",
        result.landing.weight.toFixed(1) +
        " lb"
    );


    setText(
        "tableLandingCG",
        result.landing.cg.toFixed(2) +
        " in"
    );


    // ======================================================
    // STATUS
    // ======================================================

    if (
        result.problems.length === 0
    ) {

        displayStatus(
            "WITHIN LIMITS",
            "safe"
        );

    }

    else {

        displayStatus(
            result.status,
            "danger"
        );

    }


    // ======================================================
    // GRAPH
    // ======================================================

    drawCGGraph(

        result.ramp.weight,
        result.ramp.cg,

        result.takeoff.weight,
        result.takeoff.cg,

        result.landing.weight,
        result.landing.cg

    );

}


// ==========================================================
// CG GRAPH
// ==========================================================

function drawCGGraph(
    rampWeight,
    rampCG,
    takeoffWeight,
    takeoffCG,
    landingWeight,
    landingCG
) {

    const svg =

        document.getElementById(
            "cgGraph"
        );


    svg.innerHTML = "";


    const width = 760;
    const height = 470;


    const margin = {

        left: 75,
        right: 35,
        top: 30,
        bottom: 65

    };


    const plotWidth =

        width -
        margin.left -
        margin.right;


    const plotHeight =

        height -
        margin.top -
        margin.bottom;


    const xMin = GRAPH_MIN_CG;
    const xMax = GRAPH_MAX_CG;

    const yMin = GRAPH_MIN_WEIGHT;
    const yMax = GRAPH_MAX_WEIGHT;


    function xScale(cg) {

        return (

            margin.left +

            ((cg - xMin) /
            (xMax - xMin)) *

            plotWidth

        );

    }


    function yScale(weight) {

        return (

            margin.top +

            plotHeight -

            ((weight - yMin) /
            (yMax - yMin)) *

            plotHeight

        );

    }


    function makeSVG(
        tag,
        attributes = {},
        text = ""
    ) {

        const element =

            document.createElementNS(
                "http://www.w3.org/2000/svg",
                tag
            );


        for (
            const [key, value]
            of Object.entries(attributes)
        ) {

            element.setAttribute(
                key,
                value
            );

        }


        if (text !== "") {

            element.textContent =
                text;

        }


        svg.appendChild(
            element
        );


        return element;

    }


    // Background

    makeSVG(
        "rect",
        {
            x: margin.left,
            y: margin.top,
            width: plotWidth,
            height: plotHeight,
            class: "graph-background"
        }
    );


    // X Grid

    for (
        let cg = 82;
        cg <= 94;
        cg += 2
    ) {

        const x =
            xScale(cg);


        makeSVG(
            "line",
            {
                x1: x,
                y1: margin.top,
                x2: x,
                y2: margin.top + plotHeight,
                class: "grid-line"
            }
        );


        makeSVG(
            "text",
            {
                x: x,
                y: margin.top + plotHeight + 25,
                class: "axis-number",
                "text-anchor": "middle"
            },
            cg.toString()
        );

    }


    // Y Grid

    for (
        let weight = 1400;
        weight <= 2400;
        weight += 200
    ) {

        const y =
            yScale(weight);


        makeSVG(
            "line",
            {
                x1: margin.left,
                y1: y,
                x2: margin.left + plotWidth,
                y2: y,
                class: "grid-line"
            }
        );


        makeSVG(
            "text",
            {
                x: margin.left - 12,
                y: y + 5,
                class: "axis-number",
                "text-anchor": "end"
            },
            weight.toString()
        );

    }


    // Axis labels

    makeSVG(
        "text",
        {
            x:
                margin.left +
                plotWidth / 2,

            y:
                height - 15,

            class:
                "axis-label",

            "text-anchor":
                "middle"
        },

        "Center of Gravity — inches aft of datum"
    );


    const yAxisLabel =

        makeSVG(
            "text",
            {
                x: 20,

                y:
                    margin.top +
                    plotHeight / 2,

                class:
                    "axis-label",

                "text-anchor":
                    "middle"
            },

            "Aircraft Weight (lb)"
        );


    yAxisLabel.setAttribute(

        "transform",

        `rotate(-90 20 ${
            margin.top +
            plotHeight / 2
        })`

    );


    // Envelope

    const envelopePoints = [

        [83.0, GRAPH_MIN_WEIGHT],

        [83.0, 1950],

        [88.3, 2440],

        [93.0, 2440],

        [93.0, GRAPH_MIN_WEIGHT]

    ];


    let envelopePath = "";


    envelopePoints.forEach(
        (point, index) => {

            const x =
                xScale(point[0]);

            const y =
                yScale(point[1]);


            if (index === 0) {

                envelopePath +=
                    `M ${x} ${y}`;

            }

            else {

                envelopePath +=
                    ` L ${x} ${y}`;

            }

        }
    );


    envelopePath += " Z";


    makeSVG(
        "path",
        {
            d: envelopePath,
            class: "envelope-area"
        }
    );


    makeSVG(
        "text",
        {
            x:
                xScale(93.0) - 5,

            y:
                yScale(2440) - 8,

            class:
                "limit-label",

            "text-anchor":
                "end"
        },

        "2440 lb"
    );


    // Trajectory

    const trajectoryPoints = [

        `${xScale(rampCG)},${yScale(rampWeight)}`,

        `${xScale(takeoffCG)},${yScale(takeoffWeight)}`,

        `${xScale(landingCG)},${yScale(landingWeight)}`

    ].join(" ");


    makeSVG(
        "polyline",
        {
            points:
                trajectoryPoints,

            class:
                "trajectory-line"
        }
    );


    // Label helper

    function addPointLabel(
        label,
        pointX,
        pointY,
        offsetX,
        offsetY
    ) {

        const labelX =
            pointX + offsetX;

        const labelY =
            pointY + offsetY;


        makeSVG(
            "line",
            {
                x1: pointX,
                y1: pointY,

                x2:
                    labelX -
                    Math.sign(offsetX || 1) * 4,

                y2:
                    labelY + 4,

                class:
                    "label-leader"
            }
        );


        makeSVG(
            "text",
            {
                x: labelX,
                y: labelY,

                class:
                    "point-label",

                "text-anchor":
                    offsetX < 0
                        ? "end"
                        : "start"
            },

            label
        );

    }


    // Ramp point

    const rampX =
        xScale(rampCG);

    const rampY =
        yScale(rampWeight);


    makeSVG(
        "circle",
        {
            cx: rampX,
            cy: rampY,
            r: 7,
            class: "ramp-point"
        }
    );


    addPointLabel(
        "Ramp",
        rampX,
        rampY,
        18,
        -26
    );


    // Takeoff point

    const takeoffX =
        xScale(takeoffCG);

    const takeoffY =
        yScale(takeoffWeight);


    makeSVG(
        "circle",
        {
            cx: takeoffX,
            cy: takeoffY,
            r: 7,
            class: "takeoff-point"
        }
    );


    addPointLabel(
        "Takeoff",
        takeoffX,
        takeoffY,
        28,
        30
    );


    // Landing point

    const landingX =
        xScale(landingCG);

    const landingY =
        yScale(landingWeight);


    makeSVG(
        "circle",
        {
            cx: landingX,
            cy: landingY,
            r: 7,
            class: "landing-point"
        }
    );


    addPointLabel(
        "Landing",
        landingX,
        landingY,
        -20,
        -22
    );


    // Border

    makeSVG(
        "rect",
        {
            x:
                margin.left,

            y:
                margin.top,

            width:
                plotWidth,

            height:
                plotHeight,

            class:
                "graph-border"
        }
    );

}


// ==========================================================
// ONLY START WEBSITE UI IF WE ARE ON index.html
// ==========================================================

const calculateButton =

    document.getElementById(
        "calculateButton"
    );


if (calculateButton) {

    calculateButton.addEventListener(
        "click",
        calculateWeightAndBalance
    );


    calculateWeightAndBalance();

}