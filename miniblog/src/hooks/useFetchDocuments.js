import {useState, useEffect} from 'react';
import { db } from "../firebase/config";
import {
    collection,
    query,
    orderBy,
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

            setLoading(true);

            const collectionRef = await collection(db, docCollection);

            try {
                let createQuery;
                //aqui fazemos a validacao ou vem a busca ou vem o id do usuario pra eu fazer a deshboard ou nao vem nada e eu faço o resgate de tudo
                if (search) {
                    //where"tags" -> como tags é um array, temos acesso a um parametro chamado array-contains que é do proprio firebase verificando se a minha busca"search" esta dentro do array ordenando pela data de criacao"createdAt"
                    createQuery = await query(collectionRef, where("tagsArray", "array-contains", search), orderBy("createdAt", "desc"));
                } else {
                    createQuery = await query(collectionRef, orderBy("createdAt", "desc"));
                }

                await onSnapshot(createQuery, querySnapshot => {
                    setDocuments(
                        querySnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                        }))
                    )
                });

                setLoading(false);
            } catch (error) {
                setError(error.message);

                setLoading(false);
            }
        }
        loadData();//so vai ser chamado essa função quando chamar uma dessas iteraçoes -> quando fizer uma pesquisa, quando for selecionado algum ususario neste caso o "id" tbm quando for cancelado

        //[docCollection, search, uid, cancelled])  ---- >>>>  neste caso estamos mapeando cada busca: se for pela coleão, pelo input ou se estiver cancelado, pelo id ele mapea
    }, [docCollection, documents, search, uid, cancelled]);

    // LIMPESA DE MEMORIA
    useEffect(() => {
        return setCancelled(true); //nao vai carregar os dados quando ele desmontar
    }, []) //array de dependencia vazia pra ser executado apenas uma vez

    // SO REMONTA QUANDO CARREGAR OS DADOS DE NOVO
    return { documents, loading, error }; // retornamos como um objeto para acessar cada um individualmente
};