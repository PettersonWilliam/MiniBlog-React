import { useLocation } from "react-router-dom";
import { useMemo } from "react"; //serve tanto pra peformace como tambem para referenciar um objeto

export function useQuery() {
    const { search } = useLocation();

    //URLSearchParams -> objeto javaScript, ele vai buscar o que passamos no parametro neste caso search - "URLSearchParams(search)" - useMemo -> recebe tbm um array de dependencias [Search] - neste caso essa função so ira ser chamada quando o search for alterado
    return useMemo(() => new URLSearchParams(search), [search]);
}