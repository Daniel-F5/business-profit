export default {

    setPkodot: ((state, pkodot) => state.pkodot = pkodot),

    setPkodotHm: ((state, pkodotHm) => state.pkodotHm = pkodotHm),

    setEditedPkodaId: ((state, id) => state.editedPkodaId = id),

    setCurrentYear: ((state, year) => state.currentYear = year),

    setCurrentMonth: ((state, month) => state.currentMonth = month),

    setPath: ((state, path) => state.path = path),

    setMonthsAndYears: (state,monthsAndYears) => state.monthsAndYears = monthsAndYears,

    setYears: (state,years) => state.years = years,

    setEditedPkoda: ((state, pkoda) => {
        state.editedPkoda = {...pkoda};
        state.editedPkoda.prices = {...pkoda.prices};
        state.editedPkoda.doc = {...pkoda.doc};
    }),

    resetPkodot: ((state) => state.pkodot = []),

    resetPkodotHm: ((state) => state.pkodotHm = {}),

    resetEditedPkodaId: ((state) => state.editedPkodaId = ''),

    resetCurrentYearAndMonth: ((state) => {state.currentYear = ''; state.currentMonth = ''}),

    resetPath: ((state) => state.path = ''),

    resetMonthsAndYears: ((state) => state.MonthsAndYears = {}),

    resetYears: ((state) => state.years = []),

    resetEditedPkoda: ((state) => {
        state.editedPkoda = {
                type: '',
                referenceNumber: '',
                incomeOrExpense: '',
                date: '',
                prices: {
                    priceIncludeVAT: 0,
                    vat: 0,
                    priceWithoutVAT: 0
                },
                details: '',
                quantity: 0,
                doc: {
                    link: '',
                    fileName: '',
                    fileType: ''
                }
        }
    }),

    editPkoda: ((state, pkoda) => {
        const index = state.pkodot.findIndex(p => p.id === pkoda.id)
        state.pkodot.splice(index, 1, pkoda)
    }),

    deletePkoda: ((state, options) => {
        //remove the pkoda from pkodot array
        const index = state.pkodot.findIndex(p => p.id === options.pkodaId)
        state.pkodot.splice(index, 1)
    }),

    deletePkodaFromPkodotHM: (state, options) => {
        const pathArr = state.path.split('/');
        const year = pathArr[1];
        const month = pathArr[2];
        delete state.pkodotHm[year][month][options.pkodaId];
        //check if the pkodotHM is empty from pkodot in the current month and then delete the month from 'monthsAndYears' hash map
        if (Object.entries(state.pkodotHm[year][month]).length === 0 && state.pkodotHm[year][month].constructor === Object){
            // const newMonthsAndYears = state.monthsAndYears
            const deleteIndex = state.monthsAndYears[year].indexOf(month);
            delete state.monthsAndYears[year].splice(deleteIndex, 1)
            delete state.pkodotHm[year][month]
            state.currentMonth = '';
            //check if the pkodotHM is empty from pkodot in the current year and then delete the year from 'monthsAndYears' hash map
            if (Object.entries(state.pkodotHm[year]).length === 0 && state.pkodotHm[year].constructor === Object){
                delete state.monthsAndYears[year]
                delete state.pkodotHm[year]
                const deleteIndex = state.years.indexOf(year)
                delete state.years.splice(deleteIndex, 1)
                state.currentYear = '';
            }
        }
    },

    updatePkodaInPkodotHM: ((state, pkoda) => {
        const pathArr = state.path.split('/');
        const year = pathArr[1];
        const month = pathArr[2];
        const id = pathArr[3];
        if (state.pkodotHm){
            if (state.pkodotHm[year]){
                if (state.pkodotHm[year][month]){
                    if (state.pkodotHm[year][month][id]){
                        state.pkodotHm[year][month][id] = pkoda;
                    }
                }
            }
        }
    }),

    insertPkoda:(state, pkoda) => {
        const pathArr = state.path.split('/');
        const year = pathArr[1]
        const month = pathArr[2]
        const id = state.editedPkoda.id

        //insert the pkoda to the pkodot hash map
        if (!state.pkodotHm){
            state.pkodotHm = {}
        }
        if (!state.pkodotHm[year]){
            state.pkodotHm[year] = {};
        }
        if (!state.pkodotHm[year][month]){
            state.pkodotHm[year][month] = {}
        }
        state.pkodotHm[year][month][id] = pkoda

        if (!state.years.includes(year)){
            const years = state.years
            years.push(year);
            years.sort(function (a, b) {
                return a - b
            })
            state.years = years
            state.monthsAndYears[year] = []
        }

        if (!state.monthsAndYears[year].includes(month)){
            state.monthsAndYears[year].push(month)
            state.monthsAndYears[year].sort(function (a, b) {
                return a - b
            })
        }
        if (state.currentYear === year && state.currentMonth === month){
            state.pkodot.push(pkoda)
        }
    },
}