<template dir="rtl">
  <div class="q-py-md q-mx-sm pkoda-input" dir="rtl">
    <q-form class="q-gutter-sm q-mx-sm justify-center row items-start">
      <q-input class="col-md-1 col-sm-2 col-xs-12 text-subtitle1" stack-label clearable clear-icon="close" v-model="localEditedPkoda.sector" label='ענף'/>
      <q-select class="col-md-1 col-sm-2 col-xs-12 text-subtitle1" stack-label label='סוג מסמך' v-model="localEditedPkoda.type"  :options="typeOptions"/>
      <q-input class="col-md-1 col-sm-2 col-xs-12 text-subtitle1" stack-label clearable clear-icon="close"
               v-model="localEditedPkoda.incomeOrExpense" label='סוג הכנסה / הוצאה'/>
      <q-input class="col-md-1 col-sm-2 col-xs-12 text-subtitle1" stack-label clearable clear-icon="close" v-model="localEditedPkoda.referenceNumber" label='מספר אסמכתא'/>
      <q-input class="col-md-1 col-sm-2 col-xs-12" stack-label clearable clear-icon="close"
               v-model="localEditedPkoda.date" label='תאריך' mask="##/##/####">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy>
              <q-date today-btn v-model="localEditedPkoda.date" mask="DD/MM/YYYY">
                <div class="items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <div class="col-md-1 col-sm-3 col-xs-12">
        <q-input class="text-subtitle1" dense stack-label clearable clear-icon="close" type="number"
         v-model="localEditedPkoda.prices.priceWithoutVAT" label='סכום ללא מע"מ' />      
        <q-input class="text-subtitle1" dense stack-label clearable clear-icon="close"
                 type="number" v-model="localEditedPkoda.prices.vat" label='מע"מ'/>
        <q-input class="text-subtitle1" dense stack-label clearable clear-icon="close" type="number"
                  v-model="localEditedPkoda.prices.priceIncludeVAT" label='סכום כולל מע"מ'/>
                <div class="relative-position row q-mt-sm fit col-md-1">
                  <q-btn size="sm" class="fit" dense glossy label='חשב סכום ללא מע"מ' @click="vatFromPriceInc(localEditedPkoda.prices.priceIncludeVAT)"/>
                  <q-btn size="sm" class="fit" dense glossy label='חשב סכום כולל מע"מ' @click="vatFromPriceWithout(localEditedPkoda.prices.priceWithoutVAT)"/>
                 </div>
      </div>
      <q-input class="col-md-2 col-sm-4 col-xs-12 text-subtitle1" stack-label clearable clear-icon="close" v-model="localEditedPkoda.details" label='פרטים'/>
      <q-input class="col-md-1 col-sm-2 col-xs-12 text-subtitle1" stack-label clearable clear-icon="close"
               type="number" v-model="localEditedPkoda.quantity" label='כמות'/>
      <div class="row col-md-1 col-sm-2 col-xs-12 text-subtitle1 justify-evenly" v-if="localEditedPkoda.doc.link" >
        <a
          :href="localEditedPkoda.doc.link"
          target="popup"
          onclick="window.open(`${href}`,'popup','width=600,height=600,scrollbars=no,resizable=no'); return false;">
          <q-icon class="desktop-only col-3" name="receipt" size="xl"/>
        </a>
        <q-btn size="sm" dense class="col-6 center" glossy v-show="localEditedPkoda.doc.link" @click="removeDocFromPkoda()" label="מחק מסמך ועדכן פקודה">
          <q-icon name="delete"/>
        </q-btn>
      </div>
      <div class="col-md-1 col-sm-2 col-xs-12" v-show="!localEditedPkoda.doc.link">
        <q-file stack-label clearable v-model="file" id="photo" label="הוסף מסמך">
        <template v-slot:append>
          <q-icon name="attach_file" />
        </template>
        </q-file>
      </div>
      <div class="row col-md-1 col-sm-4 col-xs-12">
        <q-btn class="fit text-bold" size="sm" glossy v-if="!localEditedPkoda.id" label="הזן פקודה" icon="send" @click="insert()"/>
        <q-btn-group dir="ltr" class="fit">
        <q-btn size="sm" class="col-6 text-bold" glossy v-if="localEditedPkoda.id" label="עדכן פקודה" @click="update()"><q-icon name="update"/></q-btn>
        <q-btn size="sm" class="col-6 text-bold" glossy v-if="localEditedPkoda.id" label="מחק פקודה" @click="remove()"><q-icon name="delete"/></q-btn>
        </q-btn-group>
      </div>
    </q-form>
  </div>
</template>


<script>
import { date } from 'quasar'
import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'
import firebaseInstance from '../middleware/firebase'

export default {
  name: "AddPkoda",
  props: ['tableName'],
  computed: {
    ...mapState('pkodot', ['pkodot', 'editedPkodaId', 'editedPkoda', 'path']),
    ...mapGetters('pkodot', ['getNewId'])
  },
  data() {
    return {
      typeOptions: ['הכנסה', 'הוצאה', 'רכוש קבוע'],
      localEditedPkoda: {
        type: '',
        sector: '',
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
      },
      file: null,
      tempDate: null
    }
  },

  
  methods: {
    ...mapActions('pkodot', ['insertPkoda', 'updatePkoda', 'deletePkoda', 'setEditedPkodaById', 'getPath']),
    ...mapMutations('pkodot', ['setEditedPkoda', 'resetEditedPkoda', 'resetEditedPkodaId', 'setPkodot', 'setEditedPkodaId', 'resetPkodot', 'setPath']),
    cleanInputs() {
      //clear the inputs in this component
      const obj = {}
      this.file = null;
      delete this.localEditedPkoda.id
      Object.assign(this.localEditedPkoda, {...this.editedPkoda})
      Object.assign(obj, {...this.editedPkoda.prices})
      this.localEditedPkoda.prices = obj
    },

    setEditedPkodaInStore() {
      // set the 'localEditedPkoda' to the state.EditedPkoda
      this.setEditedPkoda(this.localEditedPkoda)
    },

    goToHome() {
      this.$router.push(`/`);
    },

    checkVaildDate() {
      if(date.isValid(this.localEditedPkoda.date)){
        console.log("the date is valid")
      } else {
        console.log("unvalid date !!!")
      }
    },

    insert(lastId) {
      let id = lastId ? lastId : this.getNewId();
      this.localEditedPkoda.id = id
      this.setEditedPkodaId(id)
      if (this.localEditedPkoda.prices || this.localEditedPkoda.quantity) {
        this.fixNumbers()
      }
      const self = this

      if (this.file) {
        this.localEditedPkoda.doc.fileName = id; //bug
        this.localEditedPkoda.doc.fileType = this.file.type.split('/')[1]; //bug
        self.addDoc().then(snapshot => {
          snapshot.ref.getDownloadURL().then(async url => {
            self.localEditedPkoda.doc.link = url; //bug
            console.log(`Image Uploaded Successfully! Link: ${self.editedPkoda.doc.link}`);
            await self.setEditedPkodaInStore();
            self.insertPkoda().then(() => {
              self.cleanInputs()
              if (lastId) {
                self.goToHome()
              }
            })
          })
        });
      } else {
        self.setEditedPkodaInStore();
        self.insertPkoda().then(() => {
          self.cleanInputs()
          if (lastId) {
            self.goToHome()
          }
        })
      }
    },

    update() {
      this.setEditedPkodaInStore();
      const tempMonthAndYear = this.tempDate.slice(3);
      const editedPkodaMonthAndYear = this.editedPkoda.date.slice(3);
      const lastId = this.$route.params.id
      //check if the date in the pkoda has changed
      if (tempMonthAndYear !== editedPkodaMonthAndYear) {
        debugger
        this.deletePkoda(true);
        this.insert(lastId)
      } else {
        debugger
        this.updatePkoda().then(() => {
              this.goToHome()
        }); //todo - build new function that update the database without use insert + remove
      }
    },

    remove() {
      this.setEditedPkodaInStore();
      if (this.editedPkoda.doc.link) {
        this.deleteDoc();
      }
      this.deletePkoda();
      this.goToHome()
    },

    fixNumbers() {
      //convert the relevant strings to numbers
      this.localEditedPkoda.prices.priceIncludeVAT = parseFloat(this.localEditedPkoda.prices.priceIncludeVAT);
      this.localEditedPkoda.prices.vat = parseFloat(this.localEditedPkoda.prices.vat);
      this.localEditedPkoda.prices.priceWithoutVAT = parseFloat(this.localEditedPkoda.prices.priceWithoutVAT);
      this.localEditedPkoda.quantity = parseFloat(this.localEditedPkoda.quantity);
    },

    vatFromPriceInc(priceIncludeVAT) {
      let sumWithVAT = parseFloat(priceIncludeVAT);
      let sumWithoutVAT = sumWithVAT / 1.17;
      this.localEditedPkoda.prices.priceWithoutVAT = sumWithoutVAT.toFixed(2);
      this.localEditedPkoda.prices.vat = (sumWithVAT - sumWithoutVAT).toFixed(2)
    },

    vatFromPriceWithout(priceWithoutVAT) {
      let sumWithoutVAT = parseFloat(priceWithoutVAT);
      let sumWithVAT = sumWithoutVAT * 1.17;
      this.localEditedPkoda.prices.priceIncludeVAT = sumWithVAT.toFixed(2);
      this.localEditedPkoda.prices.vat = (sumWithVAT - sumWithoutVAT).toFixed(2)
    },

    addDoc() {
      const storage = firebaseInstance.firebase.storage();
      this.getPath(this.localEditedPkoda.date);
      const storageRef = storage.ref(`users/${window.user.uid}/${this.path}`);
      return storageRef.put(this.file)
    },

    removeDocFromPkoda() {
      const self = this;
      this.deleteDoc().then(() => {
        self.localEditedPkoda.doc.link = ''
        self.localEditedPkoda.doc.fileName = ''
        self.localEditedPkoda.doc.fileType = ''
        this.update()
      })
    },

    async deleteDoc() {
      const storage = firebaseInstance.firebase.storage();
      const storageRef = storage.ref(`users/${window.user.uid}/${this.path}`);
      storageRef.delete().then(() => {
        console.log('image deleted')
      })
      return;
    },
  },

  created() {
    if (this.$route.params.id) {
      this.setPath(`pkodot/${this.$route.params.year}/${this.$route.params.month}/${this.$route.params.id}`)
      this.setEditedPkodaId(this.$route.params.id)
      this.setEditedPkodaById({
        //todo - try to use the state instead the route
        //try 1 = not work in case of refresh page because we don't get the path in the fireBase to set the editedPkoda
        id: this.$route.params.id,
        year: this.$route.params.year,
        month: this.$route.params.month
      })
          .then(() => {
            this.localEditedPkoda = {...this.editedPkoda}
            this.localEditedPkoda.prices = {...this.editedPkoda.prices}
            this.localEditedPkoda.doc = {...this.editedPkoda.doc}
            this.tempDate = this.editedPkoda.date
          })
    }
  }
}
</script>

<style lang="sass">
.pkoda-input
  border: white
  border-style: solid
  border-radius: 10px
  border-width: 1px

</style>