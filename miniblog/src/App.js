import './App.css';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth'; // funcao que mapea se a autenticacao do usuario foi feita com sucesso

//hooks
import { useState, useEffect } from 'react';
import { useAuthentication } from './hooks/useAuthentication';
//context - contexto
import { AuthProvider } from './context/AuthContext';

//pages -- paginas
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import CreatePost from './pages/CreatePost/CreatePost';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
    const [user, setUser] = useState(undefined); //inicializa como undefined pois ainda nao tem usuario
    const {auth} = useAuthentication() //chamamos aqui para que toda vez nao ter que esta chamando a func. de autenti. ao termino que cada bloco

    const loadingUser = user === undefined; // atribuimos a "loading" o usuario com o valor de undefined e toda vez que o usuario for "UNDEFINED" ele vai estar carregando de alguma maneira.

    //toda vez que o usuario trocar de autenticacao ele fara esse mapeamento e setamos o usuario atravez do setUser chamndo a funcaop de onAuthStateChange(auth, (user) => {  --> setando a autent. e o usuario que ira logar que terá uma nova autenticacao
    useEffect(() => {
        onAuthStateChanged(auth, user => {
            setUser(user)
        })
    }, [auth]);

    // aqui fazemos uma validacao para que nao tenhamos futuros problemas de que ele so sera mostrado quando estiver algo ou algum usuario melhor falando.
    if (loadingUser) {
        return <p>Carregando...</p>
    }

    return (
        <div className="App">
            <AuthProvider value={{ user }}>
                <BrowserRouter>
                    <Navbar/>
                    <div className="container">
                        <Routes>
                            <Route path='/' element={ <Home /> } />
                            <Route path='/About' element={ <About /> } />
                            <Route path='/login' element={!user ? <Login/> : <Navigate to="/" /> } /> {/* se nao tiver usuario ele envia o usuario para tela de login e se tiver usuario ele vai pra tela "home" */}
                            <Route path='/register' element={ !user ? <Register/> : <Navigate to="/" /> } />
                            <Route path='/posts/create' element={ user ? <CreatePost/> : <Navigate to="/login" /> } />
                            <Route path='/dashboard' element={ user ? <Dashboard/> : <Navigate to="/login" /> } />
                        </Routes>
                    </div>
                    <Footer/>
                </BrowserRouter>
            </AuthProvider>
        </div>
    );
};

export default App;
