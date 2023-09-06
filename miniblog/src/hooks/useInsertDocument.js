import { useState, useEffect, useReducer } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const initialState = {
    loading: null,
    error: null
}

const insertReducer = (state, action) => {
    switch(action.type) {
    //CASO ESTEJA CARREGANDO ELE FAZ ALGO CASO ELE ESTEJA INSERINDO DOCUMENTO FAZ OUTRA E SE DER ERRO ELE FAZ OUTRA E ASSIM ATE ONDE QUEREMOS
        case "LOADING":
            //caso esteja em loadin
            return{loading: true, error: null}
        case "INSERTED_DOC":
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

export const useInsertDocument = docCollection => {

    const [response, dispatch] = useReducer(insertReducer, initialState)

    //deal with memory leak
    const [ cancelled, setCancelled ] = useState(false);

    const checkCancelBeforeDispatch = action => { //checkCancelBeforeDispatch -> checar antes de acionar o dispatch -> if (!cancelled) se não estiver cancelado ele aciona o dispatch
        if (!cancelled) {
            dispatch(action);
        }
    }

    const insertDocument = async document => {
        checkCancelBeforeDispatch({
            type: "LOADING"
        });
        try {

            const newDocument = { ...document, createdAt: Timestamp.now() }

            const insertDocument = await addDoc(
                collection(db, docCollection), newDocument
            )
            checkCancelBeforeDispatch({
                type: "INSERTED_DOC",
                payload: insertDocument
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
    });

    return {insertDocument, response};
}
