import {db} from "../firebase/config"

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut
} from 'firebase/auth'

import {useState, useEffect} from 'react';

export const useAuthentication = () => {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)

    const [cancelled, setCancelled] = useState(false);

    const auth = getAuth()// apartir deste bloco conseguimos ultilizar funcoes de autenticação

    // aqui fazenmos uma funçao pra checar esse cara
    function checkIfIsCancelled() {
        if (cancelled) {
            return;
        }
    }

    const createUser = async data => {
        checkIfIsCancelled()

        setLoading(true);
        setError(null);//quando ele esta no sou estado inicial ele ja começa limpo pois havera alguns caso que quando for iniciar a pagia ele vai estar com algum dado e precisamos limpar o campo

        //criacao do usuario
        try {
            const {user} = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );
            //atualizacao do usuario caso o usuario edite seu perfil
            await updateProfile(user, {
                displayName: data.displayName
            });

            setLoading(false);

            return user;
        } catch (error) {
            console.log(error.message);
            console.log(typeof error.message);

            //COMO AS MENSAGENS DO BACKEND ESTAO VINDO EM INGLES TRATAMOS ELA AQUI ATRAVEZ DE UMA VERIFICACAO E QUANDO RETORNAR AO USUARIO TRAZER AS SEGUINTES MENSAGENS DESEJADAS
            let systemErrorMessage;

            if (error.message.includes("password")) {
                systemErrorMessage = "A senha precisa conter no mínimo 6 caracteres"
            } else if (error.message.includes("email-already")) { //CASO O EMAIL JA EXISTA
                systemErrorMessage = "Email ja cadastrado"
            } else {
                systemErrorMessage = "Ocorreu um erro, por favor tente novamente mais tarde!"
            }

            setLoading(false);
            setError(systemErrorMessage);
        }
    };
    //A funcao que coloca o cancelado como "true" assim que agente sair dessa pagina
    useEffect(() => {
        return () => setCancelled(true);
    }, []);


// aqui retornamos os nossos objeotos tanto de mensagem quanto de criacao e varios outros
    return {
        auth,
        createUser,
        error,
        loading
    }
}
