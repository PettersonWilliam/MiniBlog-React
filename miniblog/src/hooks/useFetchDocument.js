import {useState, useEffect} from 'react';
import { db } from "../firebase/config";
import {
   doc, getDoc
} from "firebase/firestore";

//search -> para fazer a busca do usuario  $$  uid -> para pegar cada id do usuario na busca $$ docCollection -> coleção onde estou pegando os dados
const useFetchDocument = (docCollection, id) => {
    const [document, setDocument] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    //deal with memory leak
    const [ cancelled, setCancelled ] = useState(false);

    useEffect(() => {
        async  function loadDocument() {
            if (cancelled) return;

            setLoading(true);

            try {
                //vamos ter que pegar a referencia de um documento la da base do firebase ambos tem que ter await pois esperamops essa ação acontecer pra poder dar o get
                const docRef = await doc(db, docCollection, id);
                const docSnap = await getDoc(docRef);

                //aqui conseguimos obter os dados que vieram la da base com o metodo "getDoc"
                setDocument(docSnap.data());

                setLoading(false);
            } catch (error) {
                console.log(error);
                setError(error.message)

                setLoading(true);
            }
        }

        loadDocument();//so vai ser chamado essa função quando chamar uma dessas iteraçoes -> quando fizer uma pesquisa, quando for selecionado algum ususario neste caso o "id" tbm quando for cancelado

        //[docCollection, id])  ---- >>>>  neste caso estamos mapeando cada busca: se for pela coleão ou pelo id ele mapea
    }, [docCollection, id, cancelled]);

    // LIMPESA DE MEMORIA
    useEffect(() => {
        return setCancelled(true); //nao vai carregar os dados quando ele desmontar
    }, []) //array de dependencia vazia pra ser executado apenas uma vez

    // SO REMONTA QUANDO CARREGAR OS DADOS DE NOVO
    return { document, loading, error }; // retornamos como um objeto para acessar cada um individualmente
};

export default useFetchDocument;
