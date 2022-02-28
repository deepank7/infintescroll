import React, { useState, useRef, useCallback } from "react";
import useBookSearch from "./useBookSearch";
import Loader from "react-loader-spinner";

function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { loading, error, books, hasMore } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("visible");
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
      console.log(node);
    },
    [loading, hasMore]
  );

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };
  return (
    <>
      <center><input type="text" value={query} onChange={handleSearch}></input></center>
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return (
            <div ref={lastBookElementRef} className="books" key={book}>
              {book}
            </div>
          );
        } else {
          return <div className="books" key={book}>{book}</div>;
        }
      })}
      <div><center>{loading && <Loader/>}</center></div>
      <div>{error && "error"}</div>
    </>
  );
}

export default App;
