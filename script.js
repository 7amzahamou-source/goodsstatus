// =====================================================
// LOGISTICS CONTROL TOWER
// NEW PROJECT
// SHEET1
// =====================================================


// =====================================================
// GOOGLE APPS SCRIPT API
// =====================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbzcOzKiEgDRY5gMXiJequUKefzrF1hPb8RnEmt8KzuN-XzuxJWbYhfX0nXf9oHgvTVqOA/exec";



// =====================================================
// GLOBAL VARIABLES
// =====================================================

let orders = [];

let factoryChart = null;

let statusChart = null;



// =====================================================
// BASIC FUNCTIONS
// =====================================================

function safeText(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }

    return String(value).trim();

}



function escapeHTML(value) {

    return safeText(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}



function getNumber(value) {

    const number =

        Number(

            String(
                value ?? ""
            )

            .replace(
                /,/g,
                ""
            )

            .trim()

        );


    return Number.isFinite(
        number
    )

        ? number

        : 0;

}



function formatNumber(value) {

    return getNumber(
        value
    ).toLocaleString(
        "en-US"
    );

}



function setElementText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}



// =====================================================
// NORMALIZE DATA
// =====================================================

function normalizeOrder(item) {

    return {


        // A
        po:
            safeText(
                item.po ??
                item.purchaseOrder ??
                item.entry
            ),


        // B
        factory:
            safeText(
                item.factory
            ),


        // C
        contact:
            safeText(
                item.contact
            ),


        // D
        department:
            safeText(
                item.department
            ),


        // E
        model:
            safeText(
                item.model
            ),


        // F
        description:
            safeText(
                item.description
            ),


        // G
        qty:
            getNumber(
                item.qty ??
                item.quantity
            ),


        // H
        qtyPerContainer:
            getNumber(
                item.qtyPerContainer
            ),


        // I
        containers:
            getNumber(
                item.containers ??
                item.containerCount
            ),


        // J
        loaded:
            getNumber(
                item.loaded
            ),


        // K
        notLoaded:
            getNumber(
                item.notLoaded
            ),


        // L
        pol:
            safeText(
                item.pol
            ),


        // M
        pod:
            safeText(
                item.pod
            ),


        // N
        status:
            safeText(
                item.status
            )

    };

}



// =====================================================
// LOAD DATA
// =====================================================

async function loadOrders() {

    try {


        if (
            !API_URL ||
            API_URL.includes(
                "YOUR_GOOGLE"
            )
        ) {

            console.error(
                "Google Apps Script URL is missing."
            );

            return;

        }



        const response =
            await fetch(
                API_URL
            );



        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }



        const data =
            await response.json();



        if (
            !Array.isArray(
                data
            )
        ) {

            console.error(
                "API did not return an array:",
                data
            );

            return;

        }



        orders =
            data.map(
                normalizeOrder
            );



        refreshAll();


    }

    catch (error) {

        console.error(
            "Failed to load data:",
            error
        );

    }

}



// =====================================================
// FILTERED DATA
// =====================================================

function getFilteredOrders() {


    const search =

        safeText(

            document.getElementById(
                "searchInput"
            )?.value

        )
        .toLowerCase();



    const department =

        document.getElementById(
            "departmentFilter"
        )?.value || "";



    const factory =

        document.getElementById(
            "factoryFilter"
        )?.value || "";



    const status =

        document.getElementById(
            "statusFilter"
        )?.value || "";



    const pol =

        document.getElementById(
            "polFilter"
        )?.value || "";



    const pod =

        document.getElementById(
            "podFilter"
        )?.value || "";



    return orders.filter(
        item => {


            const searchable = [

                item.po,

                item.factory,

                item.contact,

                item.department,

                item.model,

                item.description,

                item.qty,

                item.qtyPerContainer,

                item.containers,

                item.loaded,

                item.notLoaded,

                item.pol,

                item.pod,

                item.status

            ]

            .join(" ")

            .toLowerCase();



            return (

                searchable.includes(
                    search
                )


                &&


                (
                    !department ||
                    item.department ===
                    department
                )


                &&


                (
                    !factory ||
                    item.factory ===
                    factory
                )


                &&


                (
                    !status ||
                    item.status ===
                    status
                )


                &&


                (
                    !pol ||
                    item.pol ===
                    pol
                )


                &&


                (
                    !pod ||
                    item.pod ===
                    pod
                )

            );

        }
    );

}



// =====================================================
// FILTER OPTIONS
// =====================================================

function populateSelect(
    elementId,
    values,
    defaultLabel
) {


    const select =
        document.getElementById(
            elementId
        );


    if (!select) {

        return;

    }



    const uniqueValues = [

        ...new Set(

            values

                .map(
                    value =>
                        safeText(
                            value
                        )
                )

                .filter(Boolean)

        )

    ]

    .sort(
        (a, b) =>

            a.localeCompare(
                b,
                "ar"
            )
    );



    select.innerHTML = `

        <option value="">
            ${defaultLabel}
        </option>

    `;



    uniqueValues.forEach(
        value => {


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                value;


            option.textContent =
                value;


            select.appendChild(
                option
            );

        }
    );

}



// =====================================================
// POPULATE ALL FILTERS
// =====================================================

function populateFilters() {


    populateSelect(

        "departmentFilter",

        orders.map(
            item =>
                item.department
        ),

        "جميع الأقسام"

    );



    populateSelect(

        "factoryFilter",

        orders.map(
            item =>
                item.factory
        ),

        "جميع المصانع"

    );



    populateSelect(

        "statusFilter",

        orders.map(
            item =>
                item.status
        ),

        "جميع الحالات"

    );



    populateSelect(

        "polFilter",

        orders.map(
            item =>
                item.pol
        ),

        "جميع موانئ الشحن"

    );



    populateSelect(

        "podFilter",

        orders.map(
            item =>
                item.pod
        ),

        "جميع موانئ الوصول"

    );

}



// =====================================================
// KPI
// =====================================================

function updateKPIs() {


    const data =
        getFilteredOrders();



    // إجمالي السجلات

    const totalRecords =
        data.length;



    // إجمالي الكمية

    const totalQty =
        data.reduce(

            (
                total,
                item
            ) =>

                total +
                getNumber(
                    item.qty
                ),

            0

        );



    // إجمالي الحاويات

    const totalContainers =
        data.reduce(

            (
                total,
                item
            ) =>

                total +
                getNumber(
                    item.containers
                ),

            0

        );



    // الحاويات التي تم تحميلها

    const loadedContainers =
        data.reduce(

            (
                total,
                item
            ) =>

                total +
                getNumber(
                    item.loaded
                ),

            0

        );



    setElementText(

        "totalRecords",

        totalRecords
            .toLocaleString()

    );



    setElementText(

        "totalQty",

        totalQty
            .toLocaleString()

    );



    setElementText(

        "totalContainers",

        totalContainers
            .toLocaleString()

    );



    setElementText(

        "loadedContainers",

        loadedContainers
            .toLocaleString()

    );



    setElementText(

        "resultCount",

        `${totalRecords.toLocaleString()} سجل`

    );

}



// =====================================================
// MAIN TABLE
// =====================================================

function renderTable() {


    const tbody =
        document.querySelector(
            "#ordersTable tbody"
        );


    if (!tbody) {

        return;

    }



    const data =
        getFilteredOrders();



    if (
        data.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="14"
                    class="empty-table"
                >
                    لا توجد بيانات
                </td>

            </tr>

        `;

        return;

    }



    tbody.innerHTML =

        data.map(
            item => `

                <tr>


                    <!-- A -->

                    <td>
                        ${escapeHTML(
                            item.po
                        )}
                    </td>


                    <!-- B -->

                    <td>
                        ${escapeHTML(
                            item.factory
                        )}
                    </td>


                    <!-- C -->

                    <td>
                        ${escapeHTML(
                            item.contact
                        )}
                    </td>


                    <!-- D -->

                    <td>
                        ${escapeHTML(
                            item.department
                        )}
                    </td>


                    <!-- E -->

                    <td>
                        ${escapeHTML(
                            item.model
                        )}
                    </td>


                    <!-- F -->

                    <td>
                        ${escapeHTML(
                            item.description
                        )}
                    </td>


                    <!-- G -->

                    <td class="center">
                        ${formatNumber(
                            item.qty
                        )}
                    </td>


                    <!-- H -->

                    <td class="center">
                        ${formatNumber(
                            item.qtyPerContainer
                        )}
                    </td>


                    <!-- I -->

                    <td class="center">
                        ${formatNumber(
                            item.containers
                        )}
                    </td>


                    <!-- J -->

                    <td class="center loaded-cell">
                        ${formatNumber(
                            item.loaded
                        )}
                    </td>


                    <!-- K -->

                    <td class="center not-loaded-cell">
                        ${formatNumber(
                            item.notLoaded
                        )}
                    </td>


                    <!-- L -->

                    <td>
                        ${escapeHTML(
                            item.pol
                        )}
                    </td>


                    <!-- M -->

                    <td>
                        ${escapeHTML(
                            item.pod
                        )}
                    </td>


                    <!-- N -->

                    <td>
                        ${escapeHTML(
                            item.status
                        )}
                    </td>


                </tr>

            `
        )

        .join("");

}



// =====================================================
// DATA PAGE TABLE
// =====================================================

function renderOrdersPage() {


    const tbody =
        document.querySelector(
            "#ordersPageTable tbody"
        );


    if (!tbody) {

        return;

    }



    const search =

        safeText(

            document.getElementById(
                "ordersSearchInput"
            )?.value

        )

        .toLowerCase();



    const data =

        orders.filter(
            item => {


                const searchable = [

                    item.po,

                    item.factory,

                    item.contact,

                    item.department,

                    item.model,

                    item.description,

                    item.qty,

                    item.qtyPerContainer,

                    item.containers,

                    item.loaded,

                    item.notLoaded,

                    item.pol,

                    item.pod,

                    item.status

                ]

                .join(" ")

                .toLowerCase();



                return searchable.includes(
                    search
                );

            }
        );



    setElementText(

        "ordersPageCount",

        `${data.length.toLocaleString()} سجل`

    );



    if (
        data.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="14"
                    class="empty-table"
                >
                    لا توجد بيانات
                </td>

            </tr>

        `;

        return;

    }



    tbody.innerHTML =

        data.map(
            item => `

                <tr>

                    <td>
                        ${escapeHTML(item.po)}
                    </td>

                    <td>
                        ${escapeHTML(item.factory)}
                    </td>

                    <td>
                        ${escapeHTML(item.contact)}
                    </td>

                    <td>
                        ${escapeHTML(item.department)}
                    </td>

                    <td>
                        ${escapeHTML(item.model)}
                    </td>

                    <td>
                        ${escapeHTML(item.description)}
                    </td>

                    <td class="center">
                        ${formatNumber(item.qty)}
                    </td>

                    <td class="center">
                        ${formatNumber(
                            item.qtyPerContainer
                        )}
                    </td>

                    <td class="center">
                        ${formatNumber(
                            item.containers
                        )}
                    </td>

                    <td class="center loaded-cell">
                        ${formatNumber(
                            item.loaded
                        )}
                    </td>

                    <td class="center not-loaded-cell">
                        ${formatNumber(
                            item.notLoaded
                        )}
                    </td>

                    <td>
                        ${escapeHTML(item.pol)}
                    </td>

                    <td>
                        ${escapeHTML(item.pod)}
                    </td>

                    <td>
                        ${escapeHTML(item.status)}
                    </td>

                </tr>

            `
        )

        .join("");

}



// =====================================================
// FACTORY CHART
// =====================================================

function drawFactoryChart() {


    const canvas =
        document.getElementById(
            "factoryChart"
        );


    if (!canvas) {

        return;

    }



    const data =
        getFilteredOrders();



    const factories = {};



    data.forEach(
        item => {


            const factory =
                item.factory ||
                "غير محدد";



            if (
                !factories[
                    factory
                ]
            ) {

                factories[
                    factory
                ] = {

                    qty: 0,

                    containers: 0

                };

            }



            factories[
                factory
            ].qty +=

                getNumber(
                    item.qty
                );



            factories[
                factory
            ].containers +=

                getNumber(
                    item.containers
                );

        }
    );



    const topFactories =

        Object.entries(
            factories
        )

        .sort(
            (
                a,
                b
            ) =>

                b[1].qty -
                a[1].qty

        )

        .slice(
            0,
            3
        );



    if (factoryChart) {

        factoryChart.destroy();

    }



    factoryChart =

        new Chart(

            canvas,

            {

                type: "bar",


                data: {

                    labels:

                        topFactories.map(
                            item =>
                                item[0]
                        ),


                    datasets: [

                        {

                            label:
                                "الكمية",

                            data:

                                topFactories.map(
                                    item =>
                                        item[1].qty
                                )

                        }

                    ]

                },


                options: {

                    indexAxis:
                        "y",


                    responsive:
                        true,


                    maintainAspectRatio:
                        false,


                    plugins: {

                        legend: {

                            display:
                                false

                        },


                        tooltip: {

                            callbacks: {

                                afterLabel:
                                    context => {


                                        const item =

                                            topFactories[
                                                context.dataIndex
                                            ][1];


                                        return [

                                            `الحاويات: ${item.containers.toLocaleString()}`

                                        ];

                                    }

                            }

                        }

                    },


                    scales: {

                        x: {

                            beginAtZero:
                                true

                        }

                    }

                }

            }

        );

}



// =====================================================
// STATUS CHART
// =====================================================

function drawStatusChart() {


    const canvas =
        document.getElementById(
            "statusChart"
        );


    if (!canvas) {

        return;

    }



    const data =
        getFilteredOrders();



    const statuses = {};



    data.forEach(
        item => {


            const status =
                item.status ||
                "غير محدد";



            if (
                !statuses[
                    status
                ]
            ) {

                statuses[
                    status
                ] = {

                    containers:
                        0,

                    rows:
                        0

                };

            }



            statuses[
                status
            ].containers +=

                getNumber(
                    item.containers
                );



            statuses[
                status
            ].rows++;

        }
    );



    const entries =

        Object.entries(
            statuses
        )

        .sort(
            (
                a,
                b
            ) =>

                b[1].containers -
                a[1].containers

        );



    if (statusChart) {

        statusChart.destroy();

    }



    statusChart =

        new Chart(

            canvas,

            {

                type: "doughnut",


                data: {

                    labels:

                        entries.map(
                            item =>
                                item[0]
                        ),


                    datasets: [

                        {

                            label:
                                "الحاويات",

                            data:

                                entries.map(
                                    item =>
                                        item[1].containers
                                )

                        }

                    ]

                },


                options: {

                    responsive:
                        true,


                    maintainAspectRatio:
                        false,


                    plugins: {

                        tooltip: {

                            callbacks: {

                                afterLabel:
                                    context => {


                                        const item =

                                            entries[
                                                context.dataIndex
                                            ][1];


                                        return `السجلات: ${item.rows.toLocaleString()}`;

                                    }

                            }

                        }

                    }

                }

            }

        );

}



// =====================================================
// NAVIGATION
// =====================================================

function setupNavigation() {


    document
        .querySelectorAll(
            ".nav-btn"
        )

        .forEach(
            button => {


                button.addEventListener(
                    "click",
                    () => {


                        document
                            .querySelectorAll(
                                ".nav-btn"
                            )

                            .forEach(
                                btn =>
                                    btn.classList.remove(
                                        "active"
                                    )
                            );



                        button.classList.add(
                            "active"
                        );



                        document
                            .querySelectorAll(
                                ".page-section"
                            )

                            .forEach(
                                section =>
                                    section.classList.add(
                                        "hidden"
                                    )
                            );



                        const target =

                            document.getElementById(
                                button.dataset.page
                            );



                        if (target) {

                            target.classList.remove(
                                "hidden"
                            );

                        }

                    }
                );

            }
        );

}



// =====================================================
// EVENTS
// =====================================================

function setupEvents() {


    const filterIds = [

        "searchInput",

        "departmentFilter",

        "factoryFilter",

        "statusFilter",

        "polFilter",

        "podFilter"

    ];



    filterIds.forEach(
        id => {


            const element =
                document.getElementById(
                    id
                );


            if (!element) {

                return;

            }



            element.addEventListener(
                "input",
                refreshFilteredView
            );


            element.addEventListener(
                "change",
                refreshFilteredView
            );

        }
    );



    const ordersSearch =

        document.getElementById(
            "ordersSearchInput"
        );



    if (ordersSearch) {

        ordersSearch.addEventListener(
            "input",
            renderOrdersPage
        );

    }

}



// =====================================================
// REFRESH FILTERED VIEW
// =====================================================

function refreshFilteredView() {


    updateKPIs();

    renderTable();

    drawFactoryChart();

    drawStatusChart();

}



// =====================================================
// REFRESH EVERYTHING
// =====================================================

function refreshAll() {


    populateFilters();

    refreshFilteredView();

    renderOrdersPage();

}



// =====================================================
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {


        setupNavigation();

        setupEvents();

        loadOrders();

    }
);