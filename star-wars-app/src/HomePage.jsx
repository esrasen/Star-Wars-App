import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

const Container = styled.div`
  padding: 20px;
`;

const SearchBar = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  width: 100%;
  font-size: 16px;
`;

const StarshipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const StarshipCard = styled.div`
  border: 1px solid #ccc;
  padding: 20px;
  width: calc(33.333% - 20px);
  box-sizing: border-box;
`;

const LoadMoreButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
`;

const HomePage = () => {
    const [starships, setStarships] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStarships();
    }, [page]);

    const fetchStarships = async () => {
        const response = await axios.get(`https://swapi.dev/api/starships/?page=${page}`);
        setStarships(prevStarships => [...prevStarships, ...response.data.results]);
    };

    const handleSearch = async (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value === '') {
            setStarships([]);
            setPage(1);
        } else {
            const response = await axios.get(`https://swapi.dev/api/starships/?search=${e.target.value}`);
            setStarships(response.data.results);
        }
    };

    return (
        <Container>
            <h1>Star Wars Starships</h1>
            <SearchBar
                type="text"
                placeholder="Search by name or model"
                value={searchTerm}
                onChange={handleSearch}
            />
            <StarshipList>
                {starships.map(starship => (
                    <StarshipCard key={starship.url}>
                        <h3>{starship.name}</h3>
                        <p>Model: {starship.model}</p>
                        <p>Max Speed: {starship.max_atmosphering_speed}</p>
                        <Link to={`/starship/${starship.url.match(/(\d+)/)[0]}`}>Details</Link>
                    </StarshipCard>
                ))}
            </StarshipList>
            {searchTerm === '' && (
                <LoadMoreButton onClick={() => setPage(prevPage => prevPage + 1)}>Load More</LoadMoreButton>
            )}
        </Container>
    );
};

export default HomePage;
