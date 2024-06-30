import "./searchBar.css";

const SearchBar = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("...");
  };

  return (
    <div className="searchBarContainer">
      <form
        className="searchForm d-flex align-items-center"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="query"
          placeholder="Search"
          title="Enter search keyword"
          className="customSearchInput"
        />

        <button type="submit" title="Search">
          <i className="bi bi-search" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
