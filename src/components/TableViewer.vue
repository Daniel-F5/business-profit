<template>
  <!--  render in table-->
  <div class="q-pa-md" dir="rtl">
    <q-table
        class="my-sticky-header-table"
        title="פקודות יומן"
        :data="pkodot"
        :columns="columns"
        row-key="name"
        flat
        bordered
        binary-state-sort
        virtual-scroll
        :rows-per-page-options="[0]"
    >
      <template v-slot:top>
        <div class="q-pa-md">
          <q-select
              rounded outlined
              v-model="year"
              :options="years"
              label="בחר שנה"
              style="min-width: 150px"
              @input="setYear(year)"
          />
        </div>
        <div class="q-pa-md">
          <q-select
              rounded outlined
              v-if="year"
              v-model="month"
              :options="monthsAndYears[year]"
              label="בחר חודש"
              style="min-width: 150px"
              @input="setMonth(year, month)"
          />
        </div>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="sector" :props="props">{{ props.row.sector }}</q-td>
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
                 onclick="window.open(`${href}`,'popup','width=600,height=600,scrollbars=no,resizable=no'); return false;">
                <q-icon name="receipt" size="md">
                </q-icon>
              </a>
            </div>
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn @click="remove(props.row)">מחק</q-btn>
            <q-btn @click="goToPkoda(props.row)">עדכון</q-btn>
          </q-td>
        </q-tr>
      </template>
      <template v-slot:pagination>
        <q-table
            :columns="[columns[0],columns[8],columns[4],columns[5],columns[6]]"
            style="background-color: #c1f4cd"
        >
          <template v-slot:body>
            <q-trs>
              <q-td>
              </q-td>
            </q-trs>
          </template>
        </q-table>
      </template>
    </q-table>
    <q-footer elevated>
    </q-footer>
  </div>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex'
import firebaseInstance from '../middleware/firebase'

export default {
  name: "PkodotYomanTable",
  props: ['tableName'],
  data() {
    return {
      columns: [
        {name: 'sector', label: 'ענף', field: 'sector', sortable: true},
        {
          name: 'type',
          label: 'סוג מסמך',
          align: 'left',
          field: row => row.type,
          sortable: true
        },
        {name: 'incomeOrExpense', label: 'סוג הכנסה / הוצאה', field: 'incomeOrExpense', sortable: true},
        {name: 'referenceNumber', label: 'מספר אסמכתא', field: 'referenceNumber'},
        {name: 'date', label: 'תאריך', field: 'date', sortable: true},
        {name: 'prices.priceWithoutVAT', label: 'סכום ללא מע"מ', field: 'priceWithoutVAT'},
        {name: 'prices.vat', label: 'מע"מ', field: 'vat'},
        {name: 'prices.priceIncludeVAT', label: 'סכום כולל מע"מ', field: 'priceIncludeVAT'},
        {name: 'details', label: 'פרטים', field: 'details'},
        {name: 'quantity', label: 'כמות', field: 'quantity', sortable: true},
        {name: 'docLink', label: 'מסמך'},
        {name: 'actions', label: 'פעולות'},
      ],
      year: '',
      month: '',
    }
  },
  computed: mapState('pkodot', ['monthsAndYears', 'years', 'editedPkodaId', 'pkodot', 'years', 'pkodotHm', 'path', 'currentMonth', 'currentYear']),
  methods: {
    ...mapMutations('pkodot', ['setEditedPkodaId', 'setEditedPkoda', 'setCurrentYear', 'setCurrentMonth', 'resetPkodot']),
    ...mapActions('pkodot', ['deletePkoda', 'getPkodotOrderd', 'getPkodot', 'getPath']),
    remove(pkoda) {
      this.setEditedPkodaId(pkoda.id)
      this.getPath(pkoda.date)
      this.deleteDoc()
      this.deletePkoda()
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
.my-sticky-header-table
  /* height or max-height is important */
  height: 700px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #c1f4cd

  thead tr th
    position: sticky
    z-index: 3

  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */

  &.q-table--loading thead tr:last-child th
    /* height of   all previous header rows */
    top: 20px
</style>