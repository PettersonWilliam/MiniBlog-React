import styles from './CreatePost.module.css'

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthValue } from '../../context/AuthContext';
import { useInsertDocument } from '../../hooks/useInsertDocument';

const CreatePost = () => {
    const [ title, setTitle ] = useState("");
    const [ image, setImage ] = useState("");
    const [ body, setBody ] = useState("");
    const [ tags, setTags ] = useState("");
    const [ formError, setFormError ] = useState("");

    const {insertDocument, response} = useInsertDocument("posts");
    const {user} = useAuthValue();


    const handleSubmit = e => {
        e.preventDefault();
        setFormError("");

        //validade image URL


        // criar array de tags



        //checar todos os valores



        insertDocument({
            title,
            image,
            body,
            tags,
            uid: user.uid,
            createBy: user.displayName
        });

        // redirect to home page

    };
  return (

    <div className={styles.create_post}>
        <h2>Criar post</h2>
        <p>Escreva sobre o que quiser e compartilhe o seu conhecimento</p>
          <form onSubmit={handleSubmit}>
            <label>
                <span>Título</span>
                <input type="text" name="title" required placehlder="Pense num bom título..." onChange={e => setTitle(e.target.value)} value={title} />
            </label>
            <label>
                <span>URL da imagem</span>
                <input type="text" name="image" required placehlder="Insira uma imagem que representa seu post" onChange={e => setImage(e.target.value)} value={image} />
            </label>
                <span>Conteúdo</span>
                <textarea name="body" required placeholder="Insira o conteúdo do post" onChange={e => setBody(e.target.value)} value={body}></textarea>
            <label>
                <span>Título</span>
                <input type="text" name="title" required placehlder="Pense num bom título..." onChange={e => setTitle(e.target.value)} value={title} />
            </label>
            <label>
            </label>
            <label>
                <span>Tags</span>
                <input type="text" name="tags" required placehlder="Insira as tags separadas por vírgula." onChange={e => setTags(e.target.value)} value={tags} />
            </label>
            {!response.loading && <button className='btn'>Cadastrar</button>}
            {response.loading && <button className='btn' disabled > Aguarde...</button>}
            {response.error && <p className='Error'>{response.error}</p>}
        </form>
    </div>
  )
}

export default CreatePost;
