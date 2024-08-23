<template>
    <div id="cashflow-log">
        <h1 class="text-center cashflowlog-heading">Cashflow</h1>
        <div class="accordion" id="accordionCashflow">
            <div v-for="(log, index) in cashflowLog" :key="log.idcashflowLog" class="accordion-item cashflow-element"
                :style="{ animationDelay: index / 4 + 's' }">

                <!-- ACCORDION INFO -->
                <h2 class="accordion-header" id="headingOne" @click="openLog(log)">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        :data-bs-target="'#collapse' + log.idcashflowLog" aria-expanded="false"
                        :aria-controls="'collapse' + log.idcashflowLog">
                        Transaction ID: {{ log.idcashflowLog }} &nbsp;<b
                            :class="{ 'text-danger': log.type == 'Expense', 'text-success': log.type == 'Income' }">{{
                log.type }}</b>
                        &nbsp;
                        Name: {{ log.username }} Value: {{ log.value }} Currency: {{ log.currency }}
                        Date: {{ log.date }}
                    </button>
                </h2>

                <!-- ACCORDION BODY COLLAPSED -->
                <div :id="'collapse' + log.idcashflowLog" class="accordion-collapse collapse"
                    :aria-labelledby="'heading' + log.idcashflowLog" data-bs-parent="#accordionCashflow">
                    <div class="accordion-body">

                        <!-- USER -->
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <label class="input-group-text" :for="'username' + log.idcashflowLog">Name</label>
                            </div>
                            <select :id="'username' + log.idcashflowLog" class="name-select form-control"
                                aria-label="Name" aria-describedby="inputGroup-sizing-default" v-model="log.idUserSelected"
                                @change="inputChanging()">
                                <!--<option v-for="entity in entities" :key="entity.idEntities" :value="entity.idEntities">
                                    {{
                entity.name }}</option>
                                -->
                            </select>
                        </div>

                        <!-- TYPE -->
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <label class="input-group-text" :for="'typeName' + log.idcashflowLog">Type</label>
                            </div>
                            <select :id="'typeName' + log.idcashflowLog" class="type-select form-control"
                                aria-label="Type" aria-describedby="inputGroup-sizing-default" v-model="log.type"
                                @change="inputChanging()">
                                <option value="Income">Income</option>
                                <option value="Expense">Expense</option>
                            </select>
                        </div>

                        <!-- VALUE -->
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="inputGroup-sizing-default">Value</span>
                            </div>
                            <input :id="'value' + log.idcashflowLog" type="number" class="value-input form-control"
                                aria-label="Value" aria-describedby="inputGroup-sizing-default" v-model="log.value"
                                @change="inputChanging()">
                        </div>

                        <!-- CURRENCY -->
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <label class="input-group-text"
                                    :for="'currencyName' + log.idcashflowLog">Currency</label>
                            </div>
                            <select :id="'currencyName' + log.idcashflowLog" class="currency-select form-control"
                                aria-label="Currency" aria-describedby="inputGroup-sizing-default"
                                v-model="log.currency" @change="inputChanging()">
                                <option value="RON">RON</option>
                                <option value="EUR">EUR</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>

                        <!-- DATE -->
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="inputGroup-sizing-default">Date</span>
                            </div>
                            <input :id="'date' + log.idcashflowLog" type="datetime-local"
                                class="date-input form-control" aria-label="Value"
                                aria-describedby="inputGroup-sizing-default" v-model="log.date"
                                @change="inputChanging()">
                        </div>
                        <transition name="fade">
                            <button v-if="showButton" @click="updateCashflowLog(log)"
                                class="btn btn-primary">Update</button>
                        </transition>
                    </div>
                </div>
            </div>
        </div>
        <button type="button" class="btn-insert" data-bs-toggle="modal" data-bs-target="#insertModal"
            @click="resetInsertInfo()">Insert</button>

        <!-- MODAL POPUP -->
        <div class="modal fade" id="insertModal" tabindex="-1" aria-labelledby="InsertPopup" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="InsertPopup">Insert log</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">

                        <!-- USER INSERT -->
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <label class="input-group-text" for="usernameInsert">Name</label>
                            </div>
                            <select id="usernameInsert" class="name-select form-control" aria-label="Name"
                                aria-describedby="inputGroup-sizing-default" v-model="idUserInsert">
                                <!--<option v-for="entity in entities" :key="entity.idEntities" :value="entity.idEntities">
                                    {{
                entity.name }}</option>
                                -->
                            </select>
                        </div>

                        <!-- TYPE INSERT -->
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <label class="input-group-text" for="typeNameInsert">Type</label>
                            </div>
                            <select id="typeNameInsert" class="type-select form-control" aria-label="Type"
                                aria-describedby="inputGroup-sizing-default" v-model="typeInsert">
                                <option value="Income">Income</option>
                                <option value="Expense">Expense</option>
                            </select>
                        </div>

                        <!-- VALUE INSERT -->
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="inputGroup-sizing-default">Value</span>
                            </div>
                            <input id="valueInsert" type="number" class="value-input form-control" aria-label="Value"
                                aria-describedby="inputGroup-sizing-default" v-model="valueInsert">
                        </div>

                        <!-- CURRENCY INSERT -->
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <label class="input-group-text" for="currencyNameInsert">Currency</label>
                            </div>
                            <select id="currencyNameInsert" class="currency-select form-control" aria-label="Currency"
                                aria-describedby="inputGroup-sizing-default" v-model="currencyInsert">
                                <option value="RON">RON</option>
                                <option value="EUR">EUR</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>

                        <!-- DATE INSERT -->
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="inputGroup-sizing-default">Date</span>
                            </div>
                            <input type="datetime-local" class="date-input form-control" aria-label="Value"
                                aria-describedby="inputGroup-sizing-default" v-model="dateInsert">
                        </div>
                    </div>

                    <!-- BUTTONS FOR MODAL -->
                    <div class="modal-footer">
                        <button type="button" class="btn-cashflow-close" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn-save" @click="insertCashflowLog()">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <button @click="logout()" class="btn-logout"> <i class="fa-solid fa-right-from-bracket"></i> Logout</button>


    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true"
        :class="{ 'show': showToast }" style="position: absolute; top: 0; right: 0;">
        <div class="toast-header">
            <strong class="me-auto">Notification</strong>
            <button type="button" class="m1-2 mb-1 btn-close fade-in" @click="showToast = false"></button>
        </div>
        <div class="toast-body">
            {{ toastMessage }}
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'CashFlowLog',
    data() {
        return {
            cashflowLog: [],
            users: [],
            
            // toast
            showToast: false,
            toastMessage: '',
            showButton: false,

            // insert log
            idUserInsert: 0,
            typeInsert: '',
            valueInsert: 0,
            currencyInsert: '',
            dateInsert: '',

            // current log
            currentId: 0,
            currentType: '',
            currentValue: 0,
            currentCurrency: '',
            currentDate: '',
        }
    },

    created() {
        this.getUsers();
        //this.getCashflow();
    },
    methods: {
        logout() {
            localStorage.removeItem('user-token');
            this.$router.push('/login');
        },
        getCashflow() {
            const token = localStorage.getItem('user-token'); // get the token from local storage
            axios.get('http://localhost:3000/cashflowlog', {
                headers: {
                    Authorization: `Bearer ${token}` // send the token in the Authorization header
                }
            })
                .then(response => {
                    this.cashflowLog = response.data;
                })
                .catch(error => {
                    localStorage.removeItem('user-token');
                    this.toastMessage = 'Invalid login: ' + error.response.data.message;
                    this.showToast = true;

                    setTimeout(() => {
                        this.showToast = false;
                    }, 5000);
                    this.$router.push('/login');
                    return;
                });
        },
        getUsers() {
            axios.get('http://localhost:3000/users')
                .then(response => {
                    this.users = response.data;
                })
                .catch(error => {
                    console.error(error);
                });
        },
        inputChanging() {
            this.showButton = true;
        },
        resetInsertInfo() {
            this.idUserInsert = 0;
            this.typeInsert = '';
            this.valueInsert = 0;
            this.currencyInsert = '';
            this.dateInsert = '';
        },
        insertCashflowLog() {
            //console.log(this.idEntityInsert, this.typeInsert, this.valueInsert, this.currencyInsert, this.dateInsert);
            const token = localStorage.getItem('user-token'); // get the token from local storage
            if (this.idUserInsert == 0 || this.typeInsert == '' || this.valueInsert == 0 || this.currencyInsert == '' || this.dateInsert == '') {
                this.showToast = true;
                this.toastMessage = 'Please fill all fields';
                setTimeout(() => {
                    this.showToast = false;
                }, 5000);
            } else {
                axios.post("http://localhost:3000/cashflowlog/insertLog", {
                    idUserSelected: this.idEntityInsert,
                    type: this.typeInsert,
                    value: this.valueInsert,
                    currency: this.currencyInsert,
                    date: this.dateInsert
                },
                    {
                        headers: {
                            Authorization: `Bearer ${token}` // send the token in the Authorization header
                        }
                    })
                    .then(response => {
                        console.log(response.data);
                        if (response.data.success) {
                            this.showToast = true;
                            this.toastMessage = 'Log inserted successfully';
                            setTimeout(() => {
                                this.showToast = false;
                            }, 5000);

                            this.getCashflow();
                        }
                    })
                    .catch(error => {
                        this.showToast = true;
                        this.toastMessage = 'Error inserting log: ' + error.response.data.error;
                        setTimeout(() => {
                            this.showToast = false;
                        }, 5000);
                    });
            }

        },
        updateCashflowLog(log) {
            const token = localStorage.getItem('user-token'); // get the token from local storage
            console.log(JSON.stringify(log));
            axios.post(`http://localhost:3000/cashflowlog/updateLog/${log.idcashflowLog}`, {
                idEntity: log.idEntity,
                type: log.type,
                value: log.value,
                currency: log.currency,
                date: log.date
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}` // send the token in the Authorization header
                    }
                })
                .then(response => {
                    if (response.data.success) {
                        this.showToast = true;
                        this.toastMessage = 'Log updated successfully';

                        // update the current log values to the new ones so it doesn't reset when closing the log
                        this.currentType = log.type;
                        this.currentValue = log.value;
                        this.currentCurrency = log.currency;
                        this.currentDate = log.date;
                        setTimeout(() => {
                            this.showToast = false;
                        }, 5000);
                        this.getCashflow();
                    }
                })
                .catch(error => {
                    this.showToast = true;
                    this.toastMessage = 'Error updating log: ' + error.response.data.error;
                    setTimeout(() => {
                        this.showToast = false;
                    }, 5000);
                });
            this.showButton = false;
        },
        openLog(log) {
            if (this.currentId == 0) {
                this.currentId = log.idcashflowLog;
                this.currentType = log.type;
                this.currentValue = log.value;
                this.currentCurrency = log.currency;
                this.currentDate = log.date;
                //console.log(`currentId: ${this.currentId} currentType: ${this.currentType} currentValue: ${this.currentValue} currentCurrency: ${this.currentCurrency} currentDate: ${this.currentDate}`)
            } else {
                if (this.currentId == log.idcashflowLog) {

                    //reset the log in the array
                    log.type = this.currentType;
                    log.value = this.currentValue;
                    log.currency = this.currentCurrency;
                    log.date = this.currentDate;

                    // reset the current log values
                    this.currentId = 0;
                    this.currentType = '';
                    this.currentValue = 0;
                    this.currentCurrency = '';
                    this.currentDate = '';
                } else {
                    this.currentId = log.idcashflowLog;
                    this.currentType = log.type;
                    this.currentValue = log.value;
                    this.currentCurrency = log.currency;
                    this.currentDate = log.date;
                    //console.log(`currentId: ${this.currentId} currentType: ${this.currentType} currentValue: ${this.currentValue} currentCurrency: ${this.currentCurrency} currentDate: ${this.currentDate}`)
                }
            }
            this.showButton = false;
            //console.log(this.currentId);
        }
    }
}
</script>

<style scoped>
.app-global {
    height: 90%;
}

#cashflow-log cashflow-element {
    width: 90vh;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
}

.cashflow-element {
    margin-bottom: 10px;
    animation: slide-up-fade-in 1s ease;
    animation-fill-mode: backwards;
    /* This makes the animation delay apply to the start of the animation, not the end */
}

.fade-enter-from,
.fade-leave-to {
    position: relative;
    width: 75%;
    display: block;
    margin: 3rem auto 2rem auto;
    border-radius: 1.5rem;
    background: linear-gradient(90deg, var(--background-color3) 0%, var(--background-color2) 35%, var(--background-color1) 100%);
    z-index: 1;
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    position: relative;
    width: 75%;
    display: block;
    margin: 3rem auto 2rem auto;
    border-radius: 1.5rem;
    background: linear-gradient(90deg, var(--background-color3) 0%, var(--background-color2) 35%, var(--background-color1) 100%);
    z-index: 1;
    opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
    position: relative;
    width: 75%;
    display: block;
    margin: 3rem auto 2rem auto;
    border-radius: 1.5rem;
    background: linear-gradient(90deg, var(--background-color3) 0%, var(--background-color2) 35%, var(--background-color1) 100%);
    z-index: 1;
    transition: opacity 0.5s ease-in-out;
}
</style>