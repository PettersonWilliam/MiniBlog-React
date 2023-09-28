import { useState, useEffect, useReducer } from 'react';
import { db } from '../firebase/config';
import { updateDoc, doc } from 'firebase/firestore';

const initialState = {
    loading: null,
    error: null
}

const updateReducer = (state, action) => {
    switch(action.type) {
    //CASO ESTEJA CARREGANDO ELE FAZ ALGO CASO ELE ESTEJA INSERINDO DOCUMENTO FAZ OUTRA E SE DER ERRO ELE FAZ OUTRA E ASSIM ATE ONDE QUEREMOS
        case "LOADING":
            //caso esteja em loadin
            return{loading: true, error: null}
        case "UPDATED_DOC":
            //caso esteja com o documento inserido
            return{loading: false, error: null}
        case "ERROR":
            //caso der erro
            return{loading: false, error: action.payload}// action.payload -> aravez desse cara enviamos o erro pelo action
        default:
            //caso nào tenhamos uma action
            return state;
    }
}

export const useUpdateDocument = docCollection => {

    const [response, dispatch] = useReducer(updateReducer, initialState)

    //deal with memory leak
    const [ cancelled, setCancelled ] = useState(false);

    const checkCancelBeforeDispatch = action => { //checkCancelBeforeDispatch -> checar antes de acionar o dispatch -> if (!cancelled) se não estiver cancelado ele aciona o dispatch
        if (!cancelled) {
            dispatch(action);
        }
    }

    const updateDocument = async (id, data) => {
        checkCancelBeforeDispatch({
            type: "LOADING"
        });

        try {
            const docRef = await doc(db, docCollection, id);

            const updateDocument = await updateDoc(docRef, data);

            checkCancelBeforeDispatch({
                type: "UPDATED_DOC",
                payload: updateDocument
            });
       } catch (error) {
        checkCancelBeforeDispatch({
            type: "ERROR",
            payload: error.message
        });
        }
    }

    useEffect(() => {
        return () => setCancelled(true);
    }, []);

    return {updateDocument, response};
}
