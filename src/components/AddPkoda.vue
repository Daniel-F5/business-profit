<template dir="rtl">
  <div class="q-pa-md" dir="rtl">
    <q-form class="q-gutter-md row items-start no-wrap">
      <q-input outlined clearable clear-icon="close" v-model="localEditedPkoda.sector" label='ענף'
                style="max-width: 150px"/>
      <q-select outlined v-model="localEditedPkoda.type" label='סוג מסמך' :options="typeOptions"
                style="min-width: 135px"/>
      <q-input outlined clearable clear-icon="close"
               v-model="localEditedPkoda.incomeOrExpense" label='סוג הכנסה / הוצאה'/>
      <q-input outlined clearable clear-icon="close" v-model="localEditedPkoda.referenceNumber" label='מספר אסמכתא'
               style="max-width: 150px"/>
      <!-- <q-input outlined clearable type="date" v-model="localEditedPkoda.date"/> -->
      <q-input outlined clearable clear-icon="close"
               v-model="localEditedPkoda.date" label='תאריך' mask="##/##/####">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy>
              <q-date
                  v-model="localEditedPkoda.date"
                  mask="DD-MM-YYYY"
              ></q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <div>
        <q-input dense outlined clearable clear-icon="close"
                 @input="vatFromPriceWithout(localEditedPkoda.prices.priceWithoutVAT)"
                 type="number" v-model="localEditedPkoda.prices.priceWithoutVAT" label='סכום ללא מע"מ'/>
        <q-input dense outlined clearable clear-icon="close"
                 type="number" v-model="localEditedPkoda.prices.vat" label='מע"מ'/>
        <q-input dense outlined clearable clear-icon="close" @input="vatFromPriceInc(localEditedPkoda.prices.priceIncludeVAT)"
                 type="number" v-model="localEditedPkoda.prices.priceIncludeVAT" label='סכום כולל מע"מ'/>
      </div>
      <q-input outlined clearable clear-icon="close" v-model="localEditedPkoda.details" label='פרטים'/>
      <q-input outlined clearable clear-icon="close" style="max-width: 100px"
               type="number" v-model="localEditedPkoda.quantity" label='כמות'/>
      <a v-show="localEditedPkoda.doc.link"
         :href="localEditedPkoda.doc.link"
         target="popup"
         onclick="window.open(`${href}`,'popup','width=600,height=600,scrollbars=no,resizable=no'); return false;">
        <q-icon name="receipt" size="xl"/>
      </a>
      <q-btn v-show="localEditedPkoda.doc.link" @click="removeDocFromPkoda()" label="מחק מסמך ועדכן פקודה">
        <q-icon name="delete"/>
      </q-btn>
      <div v-show="!localEditedPkoda.doc.link" style="max-width: 130px; min-width: 130px">
        <q-file clearable filled v-model="file" id="photo" label="הוסף מסמך"/>
      </div>
      <q-btn v-if="!localEditedPkoda.id" label="הזן פקודה" icon="send" @click="insert()"/>
      <q-btn v-if="localEditedPkoda.id" label="עדכן פקודה" @click="update()"/>
      <q-btn v-if="localEditedPkoda.id" label="מחק פקודה" @click="remove()"/>
    </q-form>
  </div>
</template>


<script>
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
    read() {
      //clear the inputs in this component
      const obj = {}
      this.file = null;
      delete this.localEditedPkoda.id
      Object.assign(this.localEditedPkoda, {...this.editedPkoda})
      Object.assign(obj, {...this.editedPkoda.prices})
      this.localEditedPkoda.prices = obj
    },

    localSetEditedPkoda() {
      // set the 'localEditedPkoda' to the state.EditedPkoda
      this.setEditedPkoda(this.localEditedPkoda)
    },

    goToHome() {
      this.$router.push(`/`);
    },

    insert(lastId) {
      let id = lastId ? lastId : this.getNewId();
      this.localEditedPkoda.id = id
      this.setEditedPkodaId(id)
      if (this.localEditedPkoda.prices && this.localEditedPkoda.quantity) {
        this.fixNumbers()
      }
      const self = this
      if (this.file) {
        this.localEditedPkoda.doc.fileName = id;
        this.localEditedPkoda.doc.fileType = this.file.type.split('/')[1];
        self.addDoc().then(snapshot => {
          snapshot.ref.getDownloadURL().then(async url => {
            self.localEditedPkoda.doc.link = url;
            console.log(`Image Uploaded Successfully! Link: ${self.editedPkoda.doc.link}`);
            await self.localSetEditedPkoda();
            self.insertPkoda().then(() => {
              self.read()
              if (lastId) {
                self.goToHome()
              }
            })
          })
        });
      } else {
        self.localSetEditedPkoda();
        self.insertPkoda().then(() => {
          self.read()
          if (lastId) {
            self.goToHome()
          }
        })
      }
    },

    update() {
      this.localSetEditedPkoda();
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
      this.localSetEditedPkoda();
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
        this.update()
      })
    },

    deleteDoc() {
      const storage = firebaseInstance.firebase.storage();
      const storageRef = storage.ref(`users/${window.user.uid}/${this.path}`);
      storageRef.delete().then(() => {
        console.log('image deleted')
      })
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
    console.log(this.editedPkoda.doc.link)
  }
}
</script>

<style scoped>
</style>