// import styles from './Post.module.css';

// hooks
import { useParams } from "react-router-dom";
import useFetchDocument from "../../hooks/useFetchDocument";

function Post() {
    const { id } = useParams();
    //renomeou de document para post passando useFetchDocument("posts", id) posts -> collection e o id que vem na url, aqui ele carrega o documento
    const { document: post, loading } = useFetchDocument("posts", id);

    return (
        <div>
            {loading && <p>Carregando post...</p>}
            {post && (
                <>
                    <h1>{post.title}</h1>
                </>
            )}
        </div>
    )
}

export default Post;
