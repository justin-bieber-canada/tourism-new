import React, { useState, useEffect } from 'react';
import VisitorSidebar from './VisitorSidebar';
import './visitor.css';
import { Link } from 'react-router-dom';
import { visitorService } from '../../services/visitorService';

export default function ExploreSites() {
  const [sites, setSites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    visitorService.getSites().then(data => {
      // Map data to match component expectation if needed, or adjust component
      setSites(data.map(s => ({
        id: s.site_id,
        name: s.site_name,
        image: s.image || 'https://via.placeholder.com/300',
        location: s.location || 'Unknown',
        description: s.description || '',
        price: s.price || 0
      })));
    });
  }, []);

  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="visitor-layout">
      <VisitorSidebar />
      <main className="visitor-main">
        <header className="visitor-main-header">
          <h1>Explore Historical Sites</h1>
          <input 
            type="text" 
            placeholder="Search sites..." 
            className="form-control w-25"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </header>

        <div className="row g-4">
          {filteredSites.map(site => (
            <div className="col-md-4" key={site.id}>
              <div className="card site-card h-100">
                <img src={site.image} className="card-img-top" alt={site.name} />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{site.name}</h5>
                  <p className="card-text text-muted"><small>{site.location}</small></p>
                  <p className="card-text">{site.description}</p>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="site-price">{site.price} ETB</span>
                    <div>
                        <Link to={`/visitor/sites/${site.id}`} className="btn btn-sm btn-outline-primary me-2">View Details</Link>
                        <Link to={`/visitor/request-guide/${site.id}`} className="btn btn-sm btn-primary">Request Guide</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
