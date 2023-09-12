import {useState, useEffect} from 'react';
import { db } from "../firebase/config";
import {
    collection,
    query,
    orderby,
    onSnapshot,
    where
} from "firebase/firestore";

//search -> para fazer a busca do usuario  $$  uid -> para pegar cada id do usuario na busca $$ docCollection -> coleção onde estou pegando os dados
export const useFetchDocuments = (docCollection, search = null, uid = null) => {
    const [documents, setDocuments] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    //deal with memory leak
    const [ cancelled, setCancelled ] = useState(false);

    useEffect(() => {
        async  function loadData() {
            if (cancelled) return;

            setLoading(true)

            const collectionRef = await collection(db, docCollection)

            try {
                let createQuery;

                createQuery = await query(collectionRef, orderby("createdAt", "desc"));

                await onSnapshot(createQuery, (querySnapshot) => {

                    setDocuments(
                        querySnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                        }))
                    );
                });

                setLoading(false);
            } catch (error) {
                console.log(error);
                setError(error.message);

                setLoading(false);
            }
        }
        loadData();//so vai ser chamado essa função quando chamar uma dessas iteraçoes -> quando fizer uma pesquisa, quando for selecionado algum ususario neste caso o "id" tbm quando for cancelado

        //[docCollection, search, uid, cancelled])  ---- >>>>  neste caso estamos mapeando cada busca: se for pela coleão, pelo input ou se estiver cancelado, pelo id ele mapea
    }, [docCollection, search, uid, cancelled]);

    // LIMPESA DE MEMORIA
    useEffect(() => {
        return setCancelled(true); //nao vai carregar os dados quando ele desmontar
    }, []) //array de dependencia vazia pra ser executado apenas uma vez

    // SO REMONTA QUANDO CARREGAR OS DADOS DE NOVO
    return { documents, loading, error }; // retornamos como um objeto para acessar cada um individualmente
};