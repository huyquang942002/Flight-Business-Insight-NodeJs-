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
        const docRef = this.firestore.collection(collection).doc(data['Short name city'])
        await docRef.set(data)
    }

    async getCity(collection,data){
        const docRef = this.firestore.collection(collection).doc(data['Short name city'])
        const doc = await docRef.get()
        return JSON.stringify(doc.data())
    }

    async setAud(collection,data){
        const docRef = this.firestore.collection(collection).doc(data.Currency)
        await docRef.set(data)
    }

    async getAud(collection,data){
        const docRef = this.firestore.collection(collection).doc(data.Currency)
        const doc = await docRef.get()
        return JSON.stringify(doc.data())
    }

    
}

module.exports = new fireStoreClient();