var cal = {
    // (A) PROPERTIES
    // (A1) FLAGS & DATA
    sMon: false, // week start on monday
    data: null, // events for selected period
    sDay: 0, sMth: 0, sYear: 0, // selected day month year

    // (A2) MONTHS & DAY NAMES
    months: [
        "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
        "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"
    ],
    days: ["អាទិត្យ", "ចន្ទ", "អង្ការ", "ពុធ", "ព្រ.ហ", "សុក្រ", "សៅរ៍"],

    // Define the festival days you want to highlight with corresponding letters
    festivalMonths: {
        // January
        0: { 1: "ទិវាចូលឆ្នាំសកល", 7: "ទិវាជ័យជម្នះលើរបបប្រល័យពូជសាសន៍" },

        // February
        1: {},

        // March
        2: { 8: "ទិវាសិទ្ធិនារី" },

        // April
        3: { 14: "ពិធីបុណ្យចូលឆ្នាំប្រពៃណីជាតិ-មហាសង្រ្កាន្ត", 15: "ពិធីបុណ្យចូលឆ្នាំប្រពៃណីជាតិ-វិរវ័នវត", 16: "ពិធីបុណ្យចូលឆ្នាំប្រពៃណីជាតិ-ថ្ងៃឡើងស័ក" },

        // May
        4: { 1: "ទិវាពលកម្មអន្តរជាតិ", 14: "ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម ព្រះករុណាព្រះបាទសម្ដេចព្រះបរមនាថ នរោត្ដម សីហមុនី ព្រះមហាក្សត្រនៃព្រះរាជាណាចក្រកម្ពុជា", 22: "ពិធីបុណ្យវិសាខបូជា", 26: "ព្រះរាជពិធីបុណ្យច្រត់ព្រះនង្គ័ល" },

        // June
        5: { 18: "ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម សម្ដេចព្រះមហាក្សត្រីនរោត្ដម មុនីនាថ សីហនុ ព្រះវររាជមាតាជាតិខ្មែរក្នុងសេរីភាព សេចក្ដីថ្លៃថ្នូរ និងសុភមង្គល" },

        // July
        6: {},

        // August
        7: {},

        // September
        8: { 24: "ទិវាប្រកាសរដ្ឋធម្មនុញ្ញ" },

        // October
        9: { 1: "ពិធីបុណ្យភ្ជុំបិណ្ឌ", 2: "ពិធីបុណ្យភ្ជុំបិណ្ឌ", 3: "ពិធីបុណ្យភ្ជុំបិណ្ឌ", 15: "ទិវាប្រារព្ធពិធីគោរពវិញ្ញាណក្ខន្ឌ ព្រះករុណាព្រះបាទសម្ដេច ព្រះ នរោត្ដម​ សីហនុ ព្រះមហាវីរក្សត្រ ព្រះវររាជមិតាឯករាជ្យ បូរណភាពទឹកដី​ និងឯកភាពជាតិខ្មែរ", 25: "" },

        // November
        10: { 9: "ពិធីបុណ្យឯករាជ្យជាតិ", 14: "ព្រះរាជពិធីបុណ្យអុំទូក បណ្ដែតប្រទីប និង​សំពះព្រះខែអកអំបុក", 15: "ព្រះរាជពិធីបុណ្យអុំទូក បណ្ដែតប្រទីប និង​សំពះព្រះខែអកអំបុក", 16: "ព្រះរាជពិធីបុណ្យអុំទូក បណ្ដែតប្រទីប និង​សំពះព្រះខែអកអំបុក" },

        // December
        11: { 29: "ទិវាសន្តិភាពនៅកម្ពុជា" }
    },

    // (A3) HTML ELEMENTS
    hMth: null, hYear: null, // month/year selector
    hWrap: null, // calendar wrapper
    hFormWrap: null, hForm: null, // event form
    hfDate: null, hfTxt: null, hfDel: null, // form fields

    // (B) INIT CALENDAR
    init: () => {
        // (B1) GET HTML ELEMENTS
        cal.hMth = document.getElementById("calMonth");
        cal.hYear = document.getElementById("calYear");
        cal.hWrap = document.getElementById("calWrap");
        cal.hFormWrap = document.getElementById("calForm");
        cal.hForm = cal.hFormWrap.querySelector("form");
        cal.hfDate = document.getElementById("evtDate");
        cal.hfTxt = document.getElementById("evtTxt");
        cal.hfDel = document.getElementById("evtDel");
        cal.allYearBtn = document.getElementById("allYearBtn"); // Button for setting event all year

        // (B2) APPEND MONTHS/YEAR
        let now = new Date(),
            nowMth = now.getMonth();
        cal.hYear.value = parseInt(now.getFullYear());
        for (let i = 0; i < 12; i++) {
            let opt = document.createElement("option");
            opt.value = i;
            opt.innerHTML = cal.months[i];
            if (i == nowMth) { opt.selected = true; }
            cal.hMth.appendChild(opt);
        }

        // (B3) ATTACH CONTROLS
        cal.hMth.onchange = () => {
            cal.draw();
            cal.addFestivals();
        };
        cal.hYear.onchange = cal.draw;
        cal.hForm.onsubmit = cal.save;
        document.getElementById("evtClose").onclick = () => cal.hFormWrap.close();
        cal.hfDel.onclick = cal.del;

        // (B4) START - DRAW CALENDAR
        if (cal.sMon) { cal.days.push(cal.days.shift()); }
        cal.draw();

        // (B5) ADD KHMER FESTIVALS
        cal.addFestivals();
    },

    // (C) DRAW CALENDAR FOR SELECTED MONTH
    draw: () => {
        // (C1) DAYS IN MONTH + START/END DAYS
        cal.sMth = parseInt(cal.hMth.value); // selected month
        cal.sYear = parseInt(cal.hYear.value); // selected year
        document.querySelector(".current-year").innerHTML = cal.sYear;
        let daysInMth = new Date(cal.sYear, cal.sMth + 1, 0).getDate(), // number of days in selected month
            startDay = new Date(cal.sYear, cal.sMth, 1).getDay(), // first day of the month
            endDay = new Date(cal.sYear, cal.sMth, daysInMth).getDay(), // last day of the month
            now = new Date(), // current date
            nowMth = now.getMonth(), // current month
            nowYear = parseInt(now.getFullYear()), // current year
            nowDay = cal.sMth == nowMth && cal.sYear == nowYear ? now.getDate() : null;

        // (C2) LOAD DATA FROM LOCALSTORAGE
        cal.data = localStorage.getItem(`cal-${cal.sMth}-${cal.sYear}`);
        if (cal.data == null) {
            localStorage.setItem(`cal-${cal.sMth}-${cal.sYear}`, "{}");
            cal.data = {};
        } else { cal.data = JSON.parse(cal.data); }

        // (C3) DRAWING CALCULATIONS
        let squares = [];
        if (cal.sMon && startDay != 1) {
            let blanks = startDay == 0 ? 7 : startDay;
            for (let i = 1; i < blanks; i++) { squares.push("b"); }
        }
        if (!cal.sMon && startDay != 0) {
            for (let i = 0; i < startDay; i++) { squares.push("b"); }
        }
        for (let i = 1; i <= daysInMth; i++) { squares.push(i); }
        if (cal.sMon && endDay != 0) {
            let blanks = endDay == 6 ? 1 : 7 - endDay;
            for (let i = 0; i < blanks; i++) { squares.push("b"); }
        }
        if (!cal.sMon && endDay != 6) {
            let blanks = endDay == 0 ? 6 : 6 - endDay;
            for (let i = 0; i < blanks; i++) { squares.push("b"); }
        }

        // (C4) "RESET" CALENDAR
        cal.hWrap.innerHTML = `<div class="calHead"></div>
<div class="calBody">
    <div class="calRow"></div>
</div>`;

        // (C5) CALENDAR HEADER - DAY NAMES
        let wrap = cal.hWrap.querySelector(".calHead");
        for (let d of cal.days) {
            let cell = document.createElement("div");
            cell.className = "calCell";
            cell.innerHTML = d;
            wrap.appendChild(cell);
        }

        // (C6) CALENDAR BODY - INDIVIDUAL DAYS & EVENTS
        wrap = cal.hWrap.querySelector(".calBody");
        row = cal.hWrap.querySelector(".calRow");
        for (let i = 0; i < squares.length; i++) {
            let cell = document.createElement("div");
            cell.className = "calCell";
            if ((cal.sMon ? (i % 7 === 6) : (i % 7 === 0)) && squares[i] !== "b") {
                cell.classList.add("sunday"); // Add Sunday class
            }

            if (nowDay == squares[i]) { cell.classList.add("calToday"); }
            if (squares[i] == "b") { cell.classList.add("calBlank"); }
            else {
                cell.innerHTML = `<div class="cellDate">${squares[i]}</div>`;
                if (cal.data[squares[i]]) {
                    cell.innerHTML += "<div class='evt'>" + cal.data[squares[i]] + "</div>";
                }

                // Check if the current cell has a festival and show the popup message
                const month = parseInt(cal.hMth.value);
                const festivals = cal.festivalMonths[month];
                const day = parseInt(squares[i]);
                if (festivals && festivals.hasOwnProperty(day)) {
                    const festivalDescription = festivals[day];
                    cell.title = festivalDescription; // Set the festival description as the title attribute
                    cell.style.cursor = "pointer"; // Change cursor to pointer to indicate it's clickable
                    cell.onclick = () => {
                        alert(festivalDescription);
                    };
                }
            }
            row.appendChild(cell);

            if (i != (squares.length - 1) && i != 0 && (i + 1) % 7 == 0) {
                row = document.createElement("div");
                row.className = "calRow";
                wrap.appendChild(row);
            }
        }

        // (C7) ADD FESTIVALS AFTER DRAWING
        cal.addFestivals();
    },


    // (G) NAVIGATE PREVIOUS YEAR
    navigatePreviousYear: () => {
        cal.hYear.value = parseInt(cal.hYear.value) - 1;
        cal.draw();
    },

    // (H) NAVIGATE NEXT YEAR
    navigateNextYear: () => {
        cal.hYear.value = parseInt(cal.hYear.value) + 1;
        cal.draw();
    },

    // (I) ADD KHMER FESTIVALS
    addFestivals: () => {
        const month = parseInt(cal.hMth.value);
        const festivals = cal.festivalMonths[month];
        const cells = document.querySelectorAll(".calCell");

        cells.forEach((cell) => {
            const cellDate = cell.querySelector(".cellDate");
            if (cellDate) {
                const day = parseInt(cellDate.innerHTML);
                if (festivals && festivals.hasOwnProperty(day)) {
                    const festivalLetter = festivals[day];
                    let festivalElement = cell.querySelector(".festival-letter");
                    if (!festivalElement) {
                        festivalElement = document.createElement("div");
                        festivalElement.classList.add("festival-letter");
                        cell.appendChild(festivalElement);
                    }
                    festivalElement.innerHTML = festivalLetter;
                } else {
                    let festivalElement = cell.querySelector(".festival-letter");
                    if (festivalElement) {
                        festivalElement.remove();
                    }
                }
            }
        });
    },

};

window.onload = () => {
    cal.init();
    // Get the next and back buttons
    const backButton = document.getElementById("back");
    const nextButton = document.getElementById("next");

    // Add event listeners to the buttons
    backButton.addEventListener("click", cal.navigatePreviousYear);
    nextButton.addEventListener("click", cal.navigateNextYear);
};



