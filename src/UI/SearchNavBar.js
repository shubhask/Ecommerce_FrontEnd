import { useState } from "react";

export default function SearchNavBar({handleOrderSearch}){


    const [keyword, setKeyword] = useState('');
    const [sortField, setSortField] = useState('orderTime');
    const [sortDir, setSortDir] = useState('desc');
    const handleSearch = async (e) => {
        e.preventDefault();
        handleOrderSearch(keyword, 1, sortField, sortDir);
    };

    return (
        <div class="row">
            <div class="col-md">
            
                <nav className="navbar navbar-expand-sm bg-light">
                    <div className="collapse navbar-collapse" id="seachNavBar">
                        <form className="form-inline" onSubmit={handleSearch}>
                            <input type="search" name="keyword" value={keyword}
                                placeholder="keyword"
                                onChange={(e) => setKeyword(e.target.value)}
                                class="p-sm-1" required />
                            <input type="hidden" name="sortField" value={sortField} />
                            <input type="hidden" name="sortDir" value={sortDir} />
                            <button type="submit" class="btn btn-outline-success">Search</button>		
                        </form>
                    </div>
                </nav>
            </div>
        </div>
    );
}