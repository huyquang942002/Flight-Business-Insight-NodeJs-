const fireStore = require('@google-cloud/firestore')

class fireStoreClient { 
    constructor() {
        this.firestore = new fireStore({
            projectId: "flight-daily-report",
            keyFilename:'./service-account.json'
        })
    }

    async setFlightID(collection,data){
        const docRef = this.firestore.collection(collection).doc(data.ID)
        await docRef.set(data)
    }

    async getFlightID(collection,data){
        const docRef = this.firestore.collection(collection).doc(data.ID)
        const doc = await docRef.get()
        return doc.data();
    }

    async setCity(collection,data){
        const docRef = this.firestore.collection(collection).doc(data['City'])
        await docRef.set(data)
    }

    async getCityFrom(collection,data){
        const docRef = this.firestore.collection(collection).doc(data['From'])
        const doc = await docRef.get()
        return doc.data()
    }

    async getCityTo(collection,data){
        const docRef = this.firestore.collection(collection).doc(data['To'])
        const doc = await docRef.get()
        return doc.data()
    }

    async setAud(collection,data){
        const docRef = this.firestore.collection(collection).doc(data['Currency'])
        await docRef.set(data)
    }

    async getAud(collection,data){
        const docRef = this.firestore.collection(collection).doc(data['Currency Unit'])
        const doc = await docRef.get()
        return doc.data()
    }

    
}

module.exports = new fireStoreClient();