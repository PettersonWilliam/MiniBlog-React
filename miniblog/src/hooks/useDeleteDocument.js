import { useState, useEffect, useReducer } from 'react';
import { db } from '../firebase/config';
import { doc, deleteDoc } from 'firebase/firestore';

const initialState = {
    loading: null,
    error: null
}

const deletetReducer = (state, action) => {
    switch(action.type) {
    //CASO ESTEJA CARREGANDO ELE FAZ ALGO CASO ELE ESTEJA INSERINDO DOCUMENTO FAZ OUTRA E SE DER ERRO ELE FAZ OUTRA E ASSIM ATE ONDE QUEREMOS
        case "LOADING":
            //caso esteja em loadin
            return{loading: true, error: null}
        case "DELETED_DOC":
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

export const useDeleteDocument = docCollection => {

    const [response, dispatch] = useReducer(deletetReducer, initialState)

    //deal with memory leak
    const [ cancelled, setCancelled ] = useState(false);

    const checkCancelBeforeDispatch = action => { //checkCancelBeforeDispatch -> checar antes de acionar o dispatch -> if (!cancelled) se não estiver cancelado ele aciona o dispatch
        if (!cancelled) {
            dispatch(action);
        }
    }

    const deleteDocument = async id => {
        checkCancelBeforeDispatch({
            type: "LOADING"
        });
        try {
            const deleteDocument = await deleteDoc(doc(db, docCollection, id))

            checkCancelBeforeDispatch({
                type: "DELETED_DOC",
                payload: deleteDocument
            });
       } catch (error) {
        checkCancelBeforeDispatch({
            type: "ERROR",
            payload: error.message
        });
        }
    }
    //MEMORY LEEK
    useEffect(() => {
        return () => setCancelled(true);
    }, []);

    return {deleteDocument, response};
}
