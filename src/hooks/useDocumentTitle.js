import { useEffect } from "react";

const useDocumentTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    return () => {
      document.title = prevTitle; // restaura si se desmonta el componente
    };
  }, [title]);
};

export default useDocumentTitle;
