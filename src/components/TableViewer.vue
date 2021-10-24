<template>
  <!--  render in table-->
  <div class="q-pa-xs" dir="rtl">
    <q-table
        class="my-sticky-header-table pkodot-table"
        title="פקודות יומן"
        :data="pkodot"
        :columns="columns"
        :filter="filter"
        row-key="name"
        no-data-label="אין נתונים"
        flat
        bordered
        binary-state-sort
        virtual-scroll
        :rows-per-page-options="[0]"
    >
      <template v-slot:top-left>
        <div class="row">
        <q-input class="q-pb-xs q-px-sm" borderless dense debounce="300" 
        v-model="filter" bg-color="white" rounded outlined placeholder="חפש">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <div class="row inline">
        <div class="q-px-sm">
          <q-select class="year-select" dense rounded outlined v-model="year" 
          :options="years" label="בחר שנה"  @input="setYear(year)"/>
        </div>
        <div class="q-px-sm">
          <q-select class="month-select" v-if="year" dense rounded outlined v-model="month" 
          :options="monthsAndYears[year]" label="בחר חודש" @input="setMonth(year, month)"/>
        </div>
        </div>
        </div>
      </template>
      <template v-slot:top-right>
        <q-btn
          rounded outlined
          color="primary"
          icon-right="archive"
          label="יצא לקובץ csv"
          no-caps
          @click="exportTable"
        />
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="type" :props="props">{{ props.row.type }}</q-td>
          <q-td key="incomeOrExpense" :props="props">{{ props.row.incomeOrExpense }}</q-td>
          <q-td key="referenceNumber" :props="props">{{ props.row.referenceNumber }}</q-td>
          <q-td key="date" :props="props">{{ props.row.date }}</q-td>
          <q-td key="prices.priceWithoutVAT" :props="props">
            {{ props.row.prices.priceWithoutVAT }}
          </q-td>
          <q-td key="prices.vat" :props="props">
            {{ props.row.prices.vat }}
          </q-td>
          <q-td key="prices.priceIncludeVAT" :props="props">
            {{ props.row.prices.priceIncludeVAT }}
          </q-td>
          <q-td key="details" :props="props">{{ props.row.details }}</q-td>
          <q-td key="quantity" :props="props">{{ props.row.quantity }}</q-td>
          <q-td key="docLink" :props="props">
            <div v-if="props.row.doc.link">
              <a :props="props"
                 :href="props.row.doc.link"
                 target="popup"
                 style="text-decoration:none"
                 onclick="window.open(`${href}`,'popup','width=600,height=600,scrollbars=no,resizable=no'); return false;">
                <q-icon name="receipt" size="md" />
              </a>
            </div>
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn-group rounded dir="ltr">
            <q-btn glossy @click="remove(props.row)">מחק</q-btn>
            <q-btn glossy @click="goToPkoda(props.row)">עדכן</q-btn>
            </q-btn-group>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { exportFile } from 'quasar'
import {mapState, mapActions, mapMutations} from 'vuex'
import firebaseInstance from '../middleware/firebase'

export default {
  name: "PkodotYomanTable",
  props: ['tableName'],
  data() {
    return {
      columns: [
        {
          name: 'type',
          required: true,
          label: 'סוג מסמך',
          align: 'center',
          field: row => row.type,
          format: val => `${val}`,
          sortable: true
        },
        {name: 'incomeOrExpense',align: 'center', label: 'סוג הכנסה / הוצאה', field: 'incomeOrExpense', sortable: true},
        {name: 'referenceNumber',align: 'center', label: 'מספר אסמכתא', field: 'referenceNumber'},
        {name: 'date',align: 'center', label: 'תאריך', field: 'date', sortable: true},
        {name: 'prices.priceWithoutVAT',align: 'center', label: 'סכום ללא מע"מ', field: 'priceWithoutVAT'},
        {name: 'prices.vat',align: 'center', label: 'מע"מ', field: 'vat'},
        {name: 'prices.priceIncludeVAT',align: 'center', label: 'סכום כולל מע"מ', field: 'priceIncludeVAT'},
        {name: 'details',align: 'center', label: 'פרטים', field: 'details'},
        {name: 'quantity',align: 'center', label: 'כמות', field: 'quantity', sortable: true},
        {name: 'docLink',align: 'center', label: 'מסמך'},
        {name: 'actions',align: 'center', label: 'פעולות'},
      ],
      year: '',
      month: '',
      filter: ''
    }
  },
  computed: mapState('pkodot', ['monthsAndYears', 'years', 'editedPkodaId', 'pkodot', 'years', 'pkodotHm', 'path', 'currentMonth', 'currentYear']),
  methods: {
    ...mapMutations('pkodot', ['setEditedPkodaId', 'setEditedPkoda', 'setCurrentYear', 'setCurrentMonth', 'resetPkodot']),
    ...mapActions('pkodot', ['deletePkoda', 'getPkodotOrderd', 'getPkodot', 'getPath']),
    remove(pkoda) {
      this.setEditedPkodaId(pkoda.id)
      this.getPath(pkoda.date)
      if (pkoda.doc.fileName){
        this.deleteDoc()
      }
      this.deletePkoda()
    },
    
    wrapCsvValue (val, formatFn) {
      let formatted = formatFn !== void 0
        ? formatFn(val)
        : val

      formatted = formatted === void 0 || formatted === null
        ? ''
        : String(formatted)

      formatted = formatted.split('"').join('""')
      /**
       * Excel accepts \n and \r in strings, but some other CSV parsers do not
       * Uncomment the next two lines to escape new lines
       */
      // .split('\n').join('\\n')
      // .split('\r').join('\\r')

      return `"${formatted}"`
    },

    exportTable () {
        // naive encoding to csv format
        let rows = []
        for (let pkoda of this.pkodot) {
          for (const property in pkoda) {
            if (property === 'prices'){
              pkoda.priceWithoutVAT = pkoda.prices.priceWithoutVAT;
              pkoda.vat = pkoda.prices.vat;
              pkoda.priceIncludeVAT = pkoda.prices.priceIncludeVAT;
            }
          }
          rows.push(pkoda);
        }
        const content = [this.columns.map(col => this.wrapCsvValue(col.label))].concat(
          rows.map(row => this.columns.map(col => this.wrapCsvValue(
            typeof col.field === 'function'
              ? col.field(row)
              : row[ col.field === void 0 ? col.name : col.field ],
            col.format
          )).join(','))
        ).join('\r\n')

        const status = exportFile(
          'table-export.csv',
          content,
          'text/csv'
        )
      },

    deleteDoc() {
      const storage = firebaseInstance.firebase.storage();
      const storageRef = storage.ref(`users/${window.user.uid}/${this.path}`);
      storageRef.delete().then(() => {
        console.log('image deleted')
      })
    },

    goToPkoda(pkoda) {
      this.setEditedPkodaId(pkoda.id)
      this.setEditedPkoda(pkoda)
      this.getPath(pkoda.date)
      this.$router.push(`/${this.path}`);
    },

    setMonth(year, month){
      this.getPkodot({year, month})
      this.setCurrentMonth(month)
    },

    setYear(year){
      this.resetPkodot()
      this.setCurrentYear(year)
      this.setCurrentMonth('')
    }
  },

  created() {
    this.getPkodotOrderd();
    //render the pkodot in the current mount
    if (this.pkodotHm){
      if (this.pkodotHm[this.currentYear]){
        if (this.pkodotHm[this.currentYear][this.currentMonth]){
          this.month = this.currentMonth
          this.year = this.currentYear
          this.setMonth(this.year, this.month)
        }
      }
    }
  },
  watch: {
    currentMonth(){
      this.month = this.currentMonth;
    },
    currentYear(){
      this.year = this.currentYear;
    }
  }
}
</script>

<style lang="sass">
.year-select, .month-select
  min-width: 120px

.my-sticky-header-table
  /* height or max-height is important */
  height: 41rem

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #6EA9F0

  thead tr th
    position: sticky
    z-index: 3

  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */

  &.q-table--loading thead tr:last-child th
    /* height of   all previous header rows */
    top: 20px
.q-btn-group
  background: #435870
  color: white
</style>