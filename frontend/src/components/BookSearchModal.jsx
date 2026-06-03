import React, { useState } from "react";

export default function BookSearchModal() {
  const [activeTab, setActiveTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);

  // Simulated Backend Search
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsSearching(true);
    
    setTimeout(() => {
      setResults([
        { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", status: "Available" },
        { id: 2, title: "Clean Architecture", author: "Robert C. Martin", status: "Borrowed" },
        { id: 3, title: "Harry Potter", author: "J.K. Rowling", status: "Available" }
      ].filter(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase())));
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="modal fade custom-modal" id="bookSearchModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header border-0 bg-light">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-journal-text me-2 text-primary"></i> Library Services
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          
          <div className="modal-body p-4">
            {/* Custom Nav Pills */}
            <div className="bg-light p-1 rounded-pill mb-4 d-flex">
              <button 
                className={`btn flex-fill rounded-pill fw-bold ${activeTab === "search" ? "btn-primary shadow-sm" : "btn-light text-muted"}`} 
                onClick={() => setActiveTab("search")}
              >
                <i className="bi bi-search me-2"></i>Search Catalog
              </button>
              <button 
                className={`btn flex-fill rounded-pill fw-bold ${activeTab === "track" ? "btn-primary shadow-sm" : "btn-light text-muted"}`}
                onClick={() => setActiveTab("track")}
              >
                <i className="bi bi-clock-history me-2"></i>Track Borrowed
              </button>
            </div>

            <div className="tab-content">
              {/* SEARCH TAB */}
              {activeTab === "search" && (
                <div className="fade show active">
                  <form onSubmit={handleSearch} className="mb-4 d-flex gap-2">
                    <div className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden border">
                      <span className="input-group-text bg-white border-0"><i className="bi bi-search text-muted"></i></span>
                      <input 
                        type="text" 
                        className="form-control border-0 shadow-none" 
                        placeholder="Search title, author, or ISBN..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary rounded-pill px-4">
                      {isSearching ? <span className="spinner-border spinner-border-sm"></span> : "Search"}
                    </button>
                  </form>

                  {/* Results */}
                  <div className="results-container">
                    {results.length > 0 && <h6 className="mb-3 text-muted">Search Results ({results.length}):</h6>}
                    {results.map((book) => (
                      <div className="d-flex align-items-center p-3 mb-3 bg-white border rounded-4 shadow-sm" key={book.id}>
                        <div className="bg-primary bg-gradient text-white rounded-3 d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '70px'}}>
                          <i className="bi bi-book fs-4"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-bold">{book.title}</h6>
                          <p className="mb-0 text-muted small">By {book.author}</p>
                        </div>
                        <div className="text-end">
                          <span className={`badge rounded-pill mb-2 ${book.status === 'Available' ? 'bg-success' : 'bg-warning text-dark'}`}>
                            {book.status}
                          </span>
                          <button className="btn btn-sm btn-outline-primary rounded-pill d-block w-100" disabled={book.status !== 'Available'}>
                            {book.status === 'Available' ? 'Reserve' : 'Waitlist'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TRACKING TAB */}
              {activeTab === "track" && (
                <div className="fade show active text-center py-5">
                  <i className="bi bi-upc-scan display-1 text-primary opacity-50 mb-3 d-block"></i>
                  <h5 className="fw-bold mb-2">Check Your Due Dates</h5>
                  <p className="text-muted mb-4">Enter your Member ID to see your current borrowed items.</p>
                  
                  <div className="input-group input-group-lg mx-auto shadow-sm rounded-pill overflow-hidden border" style={{maxWidth: "400px"}}>
                    <span className="input-group-text bg-white border-0"><i className="bi bi-person-badge text-muted"></i></span>
                    <input type="text" className="form-control border-0 shadow-none" placeholder="e.g. MEM-12345" />
                    <button className="btn btn-dark px-4" onClick={() => alert("Mock Data: You have 2 books due on Friday!")}>Check</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}