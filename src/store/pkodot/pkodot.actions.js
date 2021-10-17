import database from "../../middleware/firebase/database";

export default {
    getPkodotOrderd: async ({dispatch, commit}) => {
        await dispatch('getPkodotHm')
        const years = await dispatch('getYears')
        const monthsAndYears = {}
        commit('setYears', years)
        for (const year of years) {
            let months = []
            months = await dispatch('getMonths', year)
            monthsAndYears[year] = months
        }
        commit('setMonthsAndYears', monthsAndYears)
    },

    getPkodotHm: async ({commit}) => {
        //get the hash map of the pkodot from the database (fireBase)
        const pkodotHm = await database.read({entity: `pkodot`})
        //save the hash map to the state
        await commit('setPkodotHm', pkodotHm)
    },

    getYears: ({state}) => {
        //make sorted array of the years
        const years = [];
        for (const year in state.pkodotHm) {
            years.push(year);
        }
        years.sort(function (a, b) {
            return a - b
        })
        return years;
    },

    getMonths: ({state}, year) => {
        //make sorted array of the months
        const months = [];
        for (const month in state.pkodotHm[year]) {
            months.push(month)
        }
        months.sort(function (a, b) {
            return a - b
        });
        return months;
    },

    getPkodot: ({state, commit}, dates) => {
        //make array with the the pkodot from the pkodotHm in the specific year and month - this array will render to the pkodot table

        const pkodotArr = []
        //Object.assign not work good here because the insider object
        let newPkodot = JSON.stringify({...state.pkodotHm[dates.year][dates.month]})
        //pkodot is object that include all of the pkodot in the specific year and month {fireBase ID: {pkoda}}
        let pkodot = JSON.parse(newPkodot)

        //generate array with all the relevant pkodot
        for (const pkodaKey in pkodot) {
            pkodot[pkodaKey].id = pkodaKey
            pkodotArr.push(pkodot[pkodaKey])
        }
        commit('setPkodot', pkodotArr)
    },

    deletePkoda: ({state, commit}, updateCheck) => {
        //remove the pkoda from the data base (fireBase)
        database.remove({entity: state.path, pkodaId: state.editedPkodaId}).then(()=> {
            console.log('the Pkoda has deleted from fireBase')
        });

        commit('deletePkoda', {pkodaId: state.editedPkodaId})
        if (!updateCheck){
            commit('deletePkodaFromPkodotHM', {pkodaId: state.editedPkodaId})
        }
        commit('resetEditedPkodaId')

        commit('resetPath')

    },

    updatePkoda: async ({state, commit}) => {

        const pkoda = {}

        Object.assign(pkoda, state.editedPkoda)
        Object.assign(pkoda.prices, state.editedPkoda.prices)
        Object.assign(pkoda.doc, state.editedPkoda.doc)
        pkoda.id = state.editedPkodaId

        //saves in DB
        //need to remove the last pkoda and insert the new pkoda
        await database.update({entity: state.path, pkoda})

        //save in store
        commit('updatePkodaInPkodotHM', pkoda)

        commit('resetEditedPkoda')
        commit('resetEditedPkodaId')

    },

    insertPkoda: async ({dispatch, state, commit}) => {
        let pkoda = {}
        
        pkoda = {...state.editedPkoda}
        pkoda.prices = {...state.editedPkoda.prices}
        pkoda.doc = {...state.editedPkoda.doc}
        //saves in DB
        await dispatch('getPath', state.editedPkoda.date)
        //pkoda.id = (await database.create({entity: state.path, pkoda})).key
        await database.create({entity: state.path, pkoda})

        //saves in store
        commit('insertPkoda', pkoda)
        await dispatch('getPkodotHm')
        commit('setPkodotHm', state.pkodotHm)

        commit('resetEditedPkoda')
        commit('resetEditedPkodaId')

    },

    setEditedPkodaById: async ({state, commit}, options) => {
        let pkoda = {};
        let path = `pkodot/${options.year}/${options.month}/${options.id}`
        if (state.pkodot.length && state.pkodot.find(pkoda => pkoda.id === state.editedPkodaId)) {
            Object.assign(pkoda, state.editedPkoda)
        } else {
            pkoda = {...await database.read({entity: path})}
        }

        await commit('setEditedPkoda', pkoda)
    },

    getPath: ({state, commit}, pkodaDate) => {
        const dateArr = pkodaDate.split('/');
        const id = state.editedPkodaId
        const path = `pkodot/${dateArr[2]}/${dateArr[1]}/${id}`;

        commit('setPath', path)
    },

    resetPkodotStore: ({commit}) => {
        commit('resetCurrentYearAndMonth');
        commit('resetEditedPkoda');
        commit('resetEditedPkodaId');
        commit('resetPath');
        commit('resetPkodot');
        commit('resetPkodotHm');
        commit('resetMonthsAndYears');
        commit('resetYears');
    }
}