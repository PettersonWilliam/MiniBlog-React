import React from "react";

//import hooks
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useQuery } from "../../hooks/useQuery";

const Search = () => {
    const query = useQuery();
    const search = query.get("createQuery")

    return (

        <div>
            <h2>Search</h2>
            <p>{search}</p>
        </div>
    );
};

export default Search;
