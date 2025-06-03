import {getErrorCollection} from './firebase_apis.js'
import moment from 'moment';

export async function saveErrorsToDB(serviceOrderId, errors){
    try{
        const errorCollection = getErrorCollection();
        const ref = errorCollection.doc(serviceOrderId)
        await ref.set({
            serviceOrderId: serviceOrderId,
            errors: errors,
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        }, {merge: true});
    } catch (error){
        console.error('Error saving service order parameters errors to DB:', error);
    }

}


export async function getErrorLogList(req, res){
    try{
        const errorCollection = getErrorCollection();
        const errorLog = await errorCollection.get();
        const errorLogList = [];
        errorLog.forEach(doc => {
            errorLogList.push(doc.data());
        });
        res.status(200).send({errorLogList: errorLogList});
    } catch (error){
        console.error('getErrorLogList error:', error);
        res.status(500).send({message: `getErrorLogList error ${error}`});
    }
}