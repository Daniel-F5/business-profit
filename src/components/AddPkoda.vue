<template>
<div class="q-pt-xs">
  <q-card class="q-py-sm q-mx-xs pkoda-input" dir="rtl">
    <q-form
      autofocus
      ref="myForm"
      class="q-gutter-sm q-mx-sm justify-evenly row items-start"
      @submit="onSubmit()"
    >
        <div class="col-md-2 col-sm-2 col-xs-12">
          <q-select
            dense
            class="text-subtitle1"
            stack-label
            label="סוג מסמך"
            v-model="localEditedPkoda.type"
            :options="typeOptions"
            hide-bottom-space
            lazy-rules
            :rules="[(val) => val.length > 0 || 'בחר סוג מסמך']"
          />
          <q-input
            dense
            class="text-subtitle1"
            stack-label
            clearable
            clear-icon="close"
            maxlength="20"
            v-model="localEditedPkoda.incomeOrExpense"
            label="סוג הכנסה / הוצאה"
          />
          <q-input
            dense
            class="text-subtitle1"
            stack-label
            clearable
            clear-icon="close"
            v-model="localEditedPkoda.referenceNumber"
            label="מספר אסמכתא"
            maxlength="20"
          />
        </div>
        <div class="col-md-2 col-sm-3 col-xs-12">
          <q-input
            dense
            class="text-subtitle1"
            stack-label
            clearable
            clear-icon="close"
            type="text"
            oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\..*)\./g, '$1').replace(/^0+/g, '').replace(/(?<!^)-/g, '');"
            maxlength="20"
            v-model="localEditedPkoda.prices.priceWithoutVAT"
            label='סכום ללא מע"מ'
          />
          <q-input
            dense
            class="text-subtitle1"
            stack-label
            clearable
            clear-icon="close"
            type="text"
            oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\..*)\./g, '$1').replace(/^0+/g, '').replace(/(?<!^)-/g, '');"
            maxlength="20"
            v-model="localEditedPkoda.prices.vat"
            label='מע"מ'
          >
            <template v-slot:append>
              <q-btn size="md" dense @click="vatCalculate()">
                <q-icon name="calculate" />
              </q-btn>
            </template>
          </q-input>
          <q-input
            dense
            class="text-subtitle1"
            stack-label
            clearable
            clear-icon="close"
            type="text"
            oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\..*)\./g, '$1').replace(/^0+/g, '').replace(/(?<!^)-/g, '');"
            maxlength="20"
            v-model="localEditedPkoda.prices.priceIncludeVAT"
            label='סכום כולל מע"מ'
          />
        </div>

        <div class="col col-sm-3 col-xs-12 column">
          <div class="">
            <q-input
              dense
              class="col col-md-10 col-sm-11 col-xs-12 text-subtitle1"
              stack-label
              clearable
              clear-icon="close"
              hide-bottom-space
              v-model="localEditedPkoda.date"
              label="תאריך"
              mask="##/##/####"
              lazy-rules
              :rules="[(val) => val.length === 10 || 'תאריך שגוי']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy>
                    <q-date
                      today-btn
                      v-model="localEditedPkoda.date"
                      mask="DD/MM/YYYY"
                    >
                      <div class="items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input
              dense
              class="col-md-10 col-sm-11 col-xs-12 text-subtitle1"
              stack-label
              clearable
              clear-icon="close"
              oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\..*)\./g, '$1').replace(/^0+/g, '').replace(/(?<!^)-/g, '');"
              maxlength="20"
              type="text"
              v-model="localEditedPkoda.quantity"
              label="כמות"
            />

            <q-input
              dense
              class="col-md-10 col-sm-11 col-xs-12 text-subtitle1"
              stack-label
              clearable
              clear-icon="close"
              maxlength="40"
              v-model="localEditedPkoda.details"
              label="פרטים"
            />
          </div>
        </div>

        <div v-show="!inProcess" class="col col-sm-3 col-xs-12 column">
          <div class="">
            <div
              class="col-md-3 col-sm-5 col-xs-5 q-pb-sm"
              v-show="!localEditedPkoda.doc.link"
            >
              <q-file
                dense
                outlined
                stack-label
                clearable
                v-model="file"
                id="photo"
                label="הוסף מסמך"
              >
                <template v-slot:append>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>

            <div
              class="col row inline col-sm-12 col-xs-12 text-subtitle1 justify-between fit q-pb-sm"
              v-if="localEditedPkoda.doc.link"
            >
              <a
                class="col"
                :href="localEditedPkoda.doc.link"
                target="popup"
                style="text-decoration:none"
                onclick="window.open(`${href}`,'popup','width=600,height=600,scrollbars=no,resizable=no'); return false;"
              >
                <q-icon name="receipt" size="xl" />
              </a>
              <q-btn
                size="md"
                color="secondary"
                dense
                class="col"
                v-show="localEditedPkoda.doc.link"
                @click="removeDocFromPkoda()"
                label="מחק מסמך ועדכן פקודה"
              >
                <q-icon name="delete" />
              </q-btn>
            </div>

            <div
              class="col-md-3 col-sm-5 col-xs-5 q-pb-sm"
              v-if="!localEditedPkoda.id"
            >
              <q-btn
                type="submit"
                class="fit text-bold"
                size="md"
                :disable="!validInputs"
                label="הזן פקודה"
                color="primary"
                text-color="white"
              />
            </div>
            <q-btn-group dir="ltr" class="fit" v-if="localEditedPkoda.id">
              <q-btn
                size="sm"
                type="submit"
                class="col-4 text-bold"
                :disable="!validInputs"
                v-if="localEditedPkoda.id"
                label="עדכן פקודה"
                ><q-icon name="update"
              /></q-btn>
              <q-btn
                size="sm"
                class="col-4 text-bold"
                v-if="localEditedPkoda.id"
                label="מחק פקודה"
                @click="remove()"
                ><q-icon name="delete"
              /></q-btn>
              <q-btn
                size="sm"
                class="col-4 text-bold"
                v-if="localEditedPkoda.id"
                label="חזור לעמוד הראשי"
                @click="goToHome()"
                ><q-icon name="home"
              /></q-btn>
            </q-btn-group>
          </div>
        </div>
      
    </q-form>
    <q-inner-loading
      :showing="inProcess"
    />
  </q-card>
  </div>
</template>

<script>
import { date } from "quasar";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import firebaseInstance from "../middleware/firebase";

export default {
  name: "AddPkoda",
  props: ["tableName"],
  computed: {
    priceWithoutVAT() {
      return this.localEditedPkoda.prices.priceWithoutVAT;
    },
    priceIncludeVAT() {
      return this.localEditedPkoda.prices.priceIncludeVAT;
    },
    vat() {
      return this.localEditedPkoda.prices.vat;
    },
    ...mapState("pkodot", ["pkodot", "editedPkodaId", "editedPkoda", "path"]),
    ...mapGetters("pkodot", ["getNewId"]),
  },
  data() {
    return {
      typeOptions: ["הכנסה", "הוצאה", "רכוש קבוע"],
      localEditedPkoda: {
        type: "",
        referenceNumber: "",
        incomeOrExpense: "",
        date: "",
        prices: {
          priceIncludeVAT: 0,
          vat: 0,
          priceWithoutVAT: 0,
        },
        details: "",
        quantity: 0,
        doc: {
          link: "",
          fileName: "",
          fileType: "",
        },
      },
      file: null,
      tempDate: null,
      validInputs: false,
      inProcess: false,
    };
  },

  methods: {
    ...mapActions("pkodot", [
      "insertPkoda",
      "updatePkoda",
      "deletePkoda",
      "setEditedPkodaById",
      "getPath",
    ]),
    ...mapMutations("pkodot", [
      "setEditedPkoda",
      "resetEditedPkoda",
      "resetEditedPkodaId",
      "setPkodot",
      "setEditedPkodaId",
      "resetPkodot",
      "setPath",
    ]),
    cleanInputs() {
      //clear the inputs in this component (after using reseting the editedPkoda in the store)
      this.file = null;
      delete this.localEditedPkoda.id;
      this.localEditedPkoda = { ...this.editedPkoda };
      this.localEditedPkoda.prices = { ...this.editedPkoda.prices };
      this.localEditedPkoda.doc = { ...this.editedPkoda.doc };
    },

    setEditedPkodaInStore() {
      // set the 'localEditedPkoda' to the state.EditedPkoda
      this.setEditedPkoda({ ...this.localEditedPkoda });
    },

    goToHome() {
      this.$router.push(`/`);
    },

    onSubmit() {
      this.inProcess = true;
      this.editedPkodaId ? this.update() : this.insert();
    },

    checkVaildDate() {
      if (date.isValid(this.localEditedPkoda.date)) {
        console.log("the date is valid");
        return true;
      } else {
        console.log("unvalid date !!!");
        return false;
      }
    },

    insert(lastId) {
      let id = lastId ? lastId : this.getNewId();
      this.localEditedPkoda.id = id;
      this.setEditedPkodaId(id);
      if (this.localEditedPkoda.prices || this.localEditedPkoda.quantity) {
        this.fixNumbers();
      }
      const self = this;
      if (this.file) {
        this.localEditedPkoda.doc.fileName = id;
        this.localEditedPkoda.doc.fileType = this.file.type.split("/")[1];
        self.addDoc().then((snapshot) => {
          snapshot.ref.getDownloadURL().then(async (url) => {
            self.localEditedPkoda.doc.link = url;
            console.log(
              `Image Uploaded Successfully! Link: ${self.editedPkoda.doc.link}`
            );
            await self.setEditedPkodaInStore();
            self.insertPkoda().then(() => {
              self.cleanInputs();
              this.$refs.myForm.resetValidation();
              this.inProcess = false;
              if (lastId) {
                self.goToHome();
              }
            });
          });
        });
      } else {
        self.setEditedPkodaInStore();
        self.insertPkoda().then(() => {
          self.cleanInputs();
          this.$refs.myForm.resetValidation();
          this.inProcess = false;
          if (lastId) {
            self.goToHome();
          }
        });
      }
    },

    update() {
      this.fixNumbers();
      this.setEditedPkodaInStore();
      const tempMonthAndYear = this.tempDate.slice(3);
      const editedPkodaMonthAndYear = this.editedPkoda.date.slice(3);
      const lastId = this.$route.params.id;
      //check if the date in the pkoda has changed
      if (tempMonthAndYear !== editedPkodaMonthAndYear) {
        this.deletePkoda(true);
        this.insert(lastId);
      } else {
        if (this.file) {
          this.localEditedPkoda.doc.fileName = this.editedPkodaId;
          this.localEditedPkoda.doc.fileType = this.file.type.split("/")[1];
          const self = this;
          self.addDoc().then((snapshot) => {
            snapshot.ref.getDownloadURL().then(async (url) => {
              self.localEditedPkoda.doc.link = url;
              console.log(
                `Image Uploaded Successfully! Link: ${self.editedPkoda.doc.link}`
              );
              await self.setEditedPkodaInStore();
              self.updatePkoda().then(() => {
                this.goToHome();
              });
            });
          });
        } else {
          this.updatePkoda().then(() => {
            this.goToHome();
          });
        }
      }
    },

    remove() {
      this.setEditedPkodaInStore();
      if (this.editedPkoda.doc.link) {
        this.deleteDoc();
      }
      this.deletePkoda();
      this.goToHome();
    },

    fixNumbers() {
      //convert the relevant strings to numbers
      this.localEditedPkoda.prices.priceIncludeVAT = parseFloat(
        this.localEditedPkoda.prices.priceIncludeVAT
      );
      this.localEditedPkoda.prices.vat = parseFloat(
        this.localEditedPkoda.prices.vat
      );
      this.localEditedPkoda.prices.priceWithoutVAT = parseFloat(
        this.localEditedPkoda.prices.priceWithoutVAT
      );
      this.localEditedPkoda.quantity = parseFloat(
        this.localEditedPkoda.quantity
      );
    },

    vatCalculate() {
      let checkIfVatEmpty = (this.localEditedPkoda.prices.vat === null || this.localEditedPkoda.prices.vat === '');
      let checkIfIncVatEmpty = (this.localEditedPkoda.prices.priceIncludeVAT === null || this.localEditedPkoda.prices.priceIncludeVAT === '');
      //calculate from the price include v.a.t.
      if (this.localEditedPkoda.prices.priceWithoutVAT === null || this.localEditedPkoda.prices.priceWithoutVAT === '') {
        if (checkIfIncVatEmpty) {
          if (checkIfVatEmpty) {
            //can't calculate, enter price without v.a.t. or price include v.a.t.
            this.localEditedPkoda.prices.vat = 0;
            this.localEditedPkoda.prices.priceWithoutVAT = 0;
            this.localEditedPkoda.prices.priceIncludeVAT = 0;
          } else {
            this.localEditedPkoda.prices.vat = parseFloat(
              this.localEditedPkoda.prices.vat
            );
            this.localEditedPkoda.prices.priceWithoutVAT = (
              this.localEditedPkoda.prices.vat / 0.17
            ).toFixed(2);
            this.localEditedPkoda.prices.priceWithoutVAT = parseFloat(
              this.localEditedPkoda.prices.priceWithoutVAT
            );
            this.localEditedPkoda.prices.priceIncludeVAT =
              this.localEditedPkoda.prices.priceWithoutVAT +
              this.localEditedPkoda.prices.vat;
          }
        } else {
          //calculate 17% v.a.t if the vat input is empty
          if (checkIfVatEmpty) {
            this.vatFromPriceInc();
          } else {
            let vat = parseFloat(this.localEditedPkoda.prices.vat);
            let sumWithVAT = parseFloat(
              this.localEditedPkoda.prices.priceIncludeVAT
            );
            let sumWithoutVAT = sumWithVAT / 1.17;
            let maxVat = (sumWithVAT - sumWithoutVAT).toFixed(2);
            //check if the number in the vat input is bigger then 17% of price include v.a.t.
            if (vat >= maxVat) {
              this.localEditedPkoda.prices.priceWithoutVAT = sumWithoutVAT.toFixed(
                2
              );
              this.localEditedPkoda.prices.vat = maxVat;
            } else {
              this.localEditedPkoda.prices.priceWithoutVAT = (
                sumWithVAT - vat
              ).toFixed(2);
            }
          }
        }
      }
      //calculate from the price without v.a.t.
      else {
        if (checkIfIncVatEmpty) {
          if (checkIfVatEmpty) {
            this.vatFromPriceWithout();
          } else {
            let vat = parseFloat(this.localEditedPkoda.prices.vat);
            let sumWithoutVAT = parseFloat(
              this.localEditedPkoda.prices.priceWithoutVAT
            );
            let sumWithVAT = sumWithoutVAT * 1.17;
            let maxVat = (sumWithVAT - sumWithoutVAT).toFixed(2);
            //check if the number in the vat input is bigger then 17% of price include v.a.t.
            if (vat >= maxVat) {
              this.localEditedPkoda.prices.priceIncludeVAT = sumWithVAT.toFixed(
                2
              );
              this.localEditedPkoda.prices.vat = maxVat;
            } else {
              this.localEditedPkoda.prices.priceIncludeVAT =
                sumWithoutVAT + vat;
            }
          }
        } else {
          if (checkIfVatEmpty) {
            this.localEditedPkoda.prices.priceWithoutVAT = parseFloat(
              this.localEditedPkoda.prices.priceWithoutVAT
            );
            this.localEditedPkoda.prices.priceIncludeVAT = parseFloat(
              this.localEditedPkoda.prices.priceIncludeVAT
            );
            if (
              this.localEditedPkoda.prices.priceWithoutVAT >=
              this.localEditedPkoda.prices.priceIncludeVAT
            ) {
              let maxPrice = this.localEditedPkoda.prices.priceIncludeVAT.toFixed(
                2
              );
              this.localEditedPkoda.prices.priceWithoutVAT = maxPrice;
              this.localEditedPkoda.prices.vat = 0;
            } else {
              this.localEditedPkoda.prices.vat = (
                this.localEditedPkoda.prices.priceIncludeVAT -
                this.localEditedPkoda.prices.priceWithoutVAT
              ).toFixed(2);
            }
          } else {
            this.fixNumbers();
            let maxVat = (
              this.localEditedPkoda.prices.priceIncludeVAT -
              this.localEditedPkoda.prices.priceIncludeVAT / 1.17
            ).toFixed(2);
            let maxPrice = this.localEditedPkoda.prices.priceIncludeVAT.toFixed(
              2
            );
            if (
              this.localEditedPkoda.prices.priceWithoutVAT >=
              this.localEditedPkoda.prices.priceIncludeVAT
            ) {
              this.localEditedPkoda.prices.priceWithoutVAT = maxPrice;
              this.localEditedPkoda.prices.vat = 0;
            }
            if (this.localEditedPkoda.prices.vat >= maxVat) {
              this.localEditedPkoda.prices.vat = maxVat;
              this.localEditedPkoda.prices.priceWithoutVAT =
                this.localEditedPkoda.prices.priceIncludeVAT - maxVat;
            }
            if (
              this.localEditedPkoda.prices.priceWithoutVAT +
                this.localEditedPkoda.prices.vat !=
              this.localEditedPkoda.prices.priceIncludeVAT
            ) {
              this.localEditedPkoda.prices.priceWithoutVAT =
                this.localEditedPkoda.prices.priceIncludeVAT -
                this.localEditedPkoda.prices.vat;
            }
          }
        }
      }
    },

    vatFromPriceInc() {
      let sumWithVAT = parseFloat(this.localEditedPkoda.prices.priceIncludeVAT);
      let sumWithoutVAT = sumWithVAT / 1.17;
      this.localEditedPkoda.prices.priceWithoutVAT = sumWithoutVAT.toFixed(2);
      this.localEditedPkoda.prices.vat = (sumWithVAT - sumWithoutVAT).toFixed(
        2
      );
    },

    vatFromPriceWithout() {
      let sumWithoutVAT = parseFloat(
        this.localEditedPkoda.prices.priceWithoutVAT
      );
      let sumWithVAT = sumWithoutVAT * 1.17;
      this.localEditedPkoda.prices.priceIncludeVAT = sumWithVAT.toFixed(2);
      this.localEditedPkoda.prices.vat = (sumWithVAT - sumWithoutVAT).toFixed(
        2
      );
    },

    addDoc() {
      const storage = firebaseInstance.firebase.storage();
      this.getPath(this.localEditedPkoda.date);
      const storageRef = storage.ref(`users/${window.user.uid}/${this.path}`);
      return storageRef.put(this.file);
    },

    removeDocFromPkoda() {
      const self = this;
      this.deleteDoc().then(() => {
        self.localEditedPkoda.doc.link = "";
        self.localEditedPkoda.doc.fileName = "";
        self.localEditedPkoda.doc.fileType = "";
        this.update();
      });
    },

    checkInputPrices() {
      const incVat = parseFloat(this.localEditedPkoda.prices.priceIncludeVAT);
      const withoutVat = parseFloat(
        this.localEditedPkoda.prices.priceWithoutVAT
      );
      const vat = parseFloat(this.localEditedPkoda.prices.vat);
      this.validInputs =
        withoutVat + vat === incVat &&
        (incVat - incVat / 1.17).toFixed(2) >= vat
          ? true
          : false;
    },

    async deleteDoc() {
      const storage = firebaseInstance.firebase.storage();
      const storageRef = storage.ref(`users/${window.user.uid}/${this.path}`);
      storageRef.delete().then(() => {
        console.log("image deleted");
      });
      return;
    },
  },
  watch: {
    vat() {
      this.checkInputPrices();
    },
    priceIncludeVAT() {
      this.checkInputPrices();
    },
    priceWithoutVAT() {
      this.checkInputPrices();
    },
  },

  created() {
    if (this.$route.params.id) {
      this.setPath(
        `pkodot/${this.$route.params.year}/${this.$route.params.month}/${this.$route.params.id}`
      );
      this.setEditedPkodaId(this.$route.params.id);
      this.setEditedPkodaById({
        id: this.$route.params.id,
        year: this.$route.params.year,
        month: this.$route.params.month,
      }).then(() => {
        this.localEditedPkoda = { ...this.editedPkoda };
        this.localEditedPkoda.prices = { ...this.editedPkoda.prices };
        this.localEditedPkoda.doc = { ...this.editedPkoda.doc };
        this.tempDate = this.editedPkoda.date;
      });
    }
    this.checkInputPrices();
  },
};
</script>

<style lang="sass">
.pkoda-input
  border: #6EA9F0
  border-style: solid
  border-radius: 10px
  border-width: 1px
</style>
