import styles from "./CreatePost.module.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import { useInsertDocument } from "../../hooks/useInsertDocument";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [formError, setFormError] = useState("");

  const { insertDocument, response } = useInsertDocument("posts");

 const { user } = useAuthValue();

 const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    setFormError("");

    //validade imagem URL
    //fazemos um try catch onde agnte tenta criar uma imagem em javascript dando sucesso ele cai no "try" dando error ele cai no "catch"
    try {
      new URL(image);
    } catch (error) {
      setFormError("A imagem precisa ser uma URL");
    }

    // criar array de tags
    // criando um array baseado nas string de tags que estamos recebendo la do input
    // .split(",") => buscando na string todas as virgulas
    // map(tag => tag.trim() -> faz um mapeamento por cada tag e com o trim() tirando os espaços
    // toLowerCase() -> transforma para minusculo para poder fazer a busca de uma maneira mais fácil
    const tagsArray = tags.split(",").map(tag => tag.trim().toLowerCase());


    // checar todos valores
    // aqui validamos se todos os valores vieram
    if (!title || !image ||!body ||!tags) {
        setFormError("Por favor, preencha todos os campos");
    }

    //se estiver com algum error eu nao permito que ele prossiga dando a messagem de erro do catch e em seguida caindo nessa condição se tem tem error para nesse passo
    if (formError) return;

    insertDocument({
      title,
      image,
      body,
      tagsArray,
      uid: user.uid,
      createBy: user.displayName,
    });

    // redirect to home page
    navigate("/");

  };
  return (
    <div className={styles.create_post}>
      <h2>Criar post</h2>
      <p>Escreva sobre o que quiser e compartilhe o seu conhecimento</p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Título</span>
          <input
            type="text"
            name="title"
            required
            placehlder="Pense num bom título..."
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </label>
        <label>
          <span>URL da imagem</span>
          <input
            type="text"
            name="image"
            required
            placeholder="Insira uma imagem que representa seu post"
            onChange={(e) => setImage(e.target.value)}
            value={image}
          />
        </label>
        <label>
          <span>Conteúdo</span>
          <textarea
            name="body"
            required
            placeholder="Insira o conteúdo do post"
            onChange={(e) => setBody(e.target.value)}
            value={body}
          ></textarea>
        </label>
        <label>
          <span>Tags</span>
          <input
            type="text"
            name="tags"
            required
            placeholder="Insira as tags separadas por vírgula."
            onChange={(e) => setTags(e.target.value)}
            value={tags}
          />
        </label>
        {!response.loading && <button className="btn">Cadastrar</button>}
        {response.loading && (
          <button className="btn" disabled>
            {" "}
            Aguarde...
          </button>
        )}
        {response.error && <p className="Error">{response.error}</p>}
        {formError && <p className="Error">{formError}</p>}
      </form>
    </div>
  );
};

export default CreatePost;
